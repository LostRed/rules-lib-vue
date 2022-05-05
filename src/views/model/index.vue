<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="left-panel" style="float: left">
        <el-tree
          :data="tree"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          @node-click="handleTreeNodeClick"
        />
      </div>
      <div class="right-panel">
        <div class="operation-panel">
          <div>
            <el-form ref="queryForm" size="small" :inline="true" :model="probe">
              <el-form-item label="模型编号" prop="code">
                <el-input v-model="probe.code" placeholder="请输入关键字"/>
              </el-form-item>
              <el-form-item label="模型关键词" prop="keyword">
                <el-input v-model="probe.keyword" placeholder="请输入关键字"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitQueryForm()">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetQueryForm('queryForm')">重置</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="list.length===0" @click="handleFilter">筛选</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button :disabled="probe.libraryId==null" type="success" size="small" @click="handleCreate()">
              创建
            </el-button>
          </div>
        </div>
        <div>
          <div v-if="showFilters" class="filter-panel">
            <el-form ref="filterForm" size="mini">
              <el-form-item label="筛选条件">
                <el-tag
                  v-for="attribute in probe.attributes"
                  :key="attribute.id"
                  size="mini"
                  closable
                  @close="handleClose(attribute.id)"
                >{{ attribute.value }}
                </el-tag>
              </el-form-item>
              <el-form-item
                v-for="attribute in displayedAttributeViews"
                :key="attribute.id"
                :label="attribute.attributeName"
              >
                <el-tag
                  v-for="value in attribute.values"
                  :key="value"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(attribute.id,value)"
                >{{ value }}
                </el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="probe.libraryId!=null">
          <div style="margin-bottom: 20px">
            <el-table :data="list" size="small" border fit highlight-current-row height="100%">
              <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
              <el-table-column prop="code" label="模型编号" width="100"/>
              <el-table-column prop="keyword" label="模型关键词" show-overflow-tooltip min-width="300"/>
              <el-table-column
                v-for="attribute in displayedHeaders"
                :key="attribute.id"
                :label="attribute.attributeName"
                show-overflow-tooltip
                min-width="100"
              >
                <template v-slot="scope">
                  <span>{{ scope.row.attributeMap.get(attribute.id) }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template v-slot="scope">
                  <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-popconfirm title="确定删除吗？" style="margin-left: 5px" @confirm="handleDelete(scope.row)">
                    <el-button slot="reference" type="text" size="small">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalElements"
              :current-page="pageable.page + 1"
              :page-size="pageable.size"
              :page-sizes="[1, 5, 10, 20, 50, 100]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
      <el-dialog title="编辑模型" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
          <el-row>
            <el-col v-for="attribute in model.attributes" :key="attribute.id" :span="12">
              <el-form-item v-if="attribute.valueList==null||attribute.length===0" :label="attribute.attributeName">
                <el-input v-model="attribute.value" class="property-input"/>
              </el-form-item>
              <el-form-item v-if="attribute.valueList!=null&&attribute.length!==0" :label="attribute.attributeName">
                <el-select v-model="attribute.value" placeholder="请选择值">
                  <el-option
                    v-for="value in attribute.valueList"
                    :key="value"
                    :label="value"
                    :value="value"
                    @change="attribute.value=value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('modelAttrForm')">取消</el-button>
          <el-button size="small" type="primary" @click="submitModelForm('modelAttrForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deleteModel, editModelAttribute, searchModel } from '@/api/model'
import { queryTree, queryByLibrary } from '@/api/attribute'

export default {
  name: 'Model',
  data() {
    return {
      tree: [],
      headers: [],
      defaultProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },
      libraries: [],
      list: [],
      attributeViews: [],
      showFilters: false,
      probe: {
        id: null,
        code: null,
        keyword: null,
        libraryId: null,
        attributes: []
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      model: {
        libraryId: null,
        libraryName: null,
        code: null,
        keyword: null,
        attributes: []
      }
    }
  },
  computed: {
    displayedHeaders: function() {
      return this.headers.filter(header => {
        return header.displayed
      })
    },
    displayedAttributeViews: function() {
      console.log(this.attributeViews)
      console.log(this.displayedHeaders)
      return this.attributeViews.filter(e => {
        for (let i = 0; i < this.displayedHeaders.length; i++) {
          if (e.id === this.displayedHeaders[i].id) {
            return true
          }
        }
        return false
      })
    }
  },
  created() {
    queryTree().then(res => {
      if (res.code === 0) {
        this.tree = res.data
      }
    })
    this.probe.libraryId = this.$route.params.libraryId
    if (this.probe.libraryId != null) {
      this.queryHeaders()
      this.list = []
      this.query()
    }
  },
  methods: {
    handleFilter() {
      this.showFilters = !this.showFilters
    },
    indexMethod(index) {
      return index + 1
    },
    queryHeaders() {
      queryByLibrary({ probe: this.probe.libraryId })
        .then(res => {
          if (res.code === 0) {
            this.headers = res.data
          }
        })
    },
    handleTreeNodeClick(data, node, element) {
      if (node.isLeaf) {
        this.probe.libraryId = node.key
        this.queryHeaders()
        this.list = []
        this.query()
      }
    },
    handleClose(id) {
      this.probe.attributes.splice(this.probe.attributes.indexOf(id), 1)
      this.query()
    },
    handleClickTag(attributeId, val) {
      this.probe.attributes.push({
        id: attributeId,
        value: val
      })
      this.query()
    },
    query() {
      const searchParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      searchModel(searchParam)
        .then(res => {
          if (res.code === 0) {
            this.attributes = []
            this.list = res.data.modelViews
            this.attributeViews = res.data.attributeViews
            this.totalElements = res.data.totalElements
            this.totalPages = res.data.totalPages
            this.formatAllAttributes()
          }
        })
    },
    formatAllAttributes() {
      const list = this.list
      for (let i = 0; i < list.length; i++) {
        const attributes = list[i].attributes
        list[i].attributeMap = new Map()
        for (let j = 0; j < attributes.length; j++) {
          list[i].attributeMap.set(attributes[j].id, attributes[j].value)
        }
      }
    },
    submitQueryForm() {
      if (this.probe.libraryId != null) {
        this.query()
      } else {
        this.$message('请先选择一个库')
      }
    },
    resetQueryForm(formName) {
      this.$refs[formName].resetFields()
      this.selectedOptions = []
      this.list = []
      this.attributeViews = []
    },
    handleCurrentChange(val) {
      this.pageable.page = val - 1
      this.query()
    },
    handleSizeChange(val) {
      this.pageable.size = val
      this.query()
    },
    handleEdit(row) {
      this.model.id = row.id
      this.model.code = row.code
      this.model.keyword = row.keyword
      this.model.libraryId = row.libraryId
      this.model.attributes = row.attributes
      this.queryHeaders()
      for (let i = 0; i < this.headers.length; i++) {
        const attribute = this.findAttribute(this.headers[i])
        if (attribute != null) {
          attribute.valueType = this.headers[i].valueType
          attribute.valueList = this.headers[i].valueList
        } else {
          this.model.attributes.push({
            id: this.headers[i].id,
            attributeName: this.headers[i].attributeName,
            valueType: this.headers[i].valueType,
            valueList: this.headers[i].valueList
          })
        }
      }
      this.dialogFormVisible = true
    },
    findAttribute(header) {
      for (let i = 0; i < this.model.attributes.length; i++) {
        if (this.model.attributes[i].id === header.id) {
          return this.model.attributes[i]
        }
      }
    },
    handleCreate() {
      this.$router.push({
        name: 'CreateModel',
        params: {
          libraryId: this.probe.libraryId
        }
      })
    },
    handleDelete(row) {
      deleteModel({ probe: row.id })
        .then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.query()
          }
        })
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitModelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editModelAttribute(this.model)
            .then(() => {
              this.$message.success('修改成功')
              this.query()
              this.dialogFormVisible = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.fixed-container {
  height: 100vh;
  margin-top: -50px;
  padding-top: 50px;
}

.app-container {
  height: 100%;
}

.app-container > div:nth-child(2) {
  flex: 1 1 auto;
}

.left-panel {
  min-width: 200px;
  margin-right: 20px;
}

.right-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.right-panel > div:nth-child(3) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.right-panel > div:nth-child(3) > div:nth-child(1) {
  flex: 1 1 auto;
}

.operation-panel {
  display: flex;
  justify-content: space-between;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.property-input {
  width: 90%;
}

.tag {
  margin-right: 5px;
}

.tag:hover {
  cursor: pointer;
}
</style>
