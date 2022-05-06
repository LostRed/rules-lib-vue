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
              <el-form-item prop="keyword">
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
              <el-form-item>
                <div class="pagination">
                  <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalElements"
                    :current-page="pageable.page + 1"
                    :page-size="pageable.size"
                    :page-sizes="[1,10, 15, 20, 50]"
                    :pager-count="11"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                  />
                </div>
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
                  style="margin-right: 5px"
                  @close="handleClose(attribute.id)"
                >{{ attribute.value }}
                </el-tag>
              </el-form-item>
              <div
                v-for="attribute in displayedAttributeViews"
                :key="attribute.id"
                class="filter-class"
              >
                <div class="filter-label">{{ attribute.attributeName }}</div>
                <el-tag
                  v-for="value in attribute.values"
                  :key="value"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(attribute.id,value,attribute.values)"
                >{{ value }}
                </el-tag>
              </div>
            </el-form>
          </div>
        </div>
        <div v-if="probe.libraryId!=null">
          <div style="margin-bottom: 20px">
            <el-table :data="list" size="small" border fit highlight-current-row>
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
                  <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
                  <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="handleDelete(scope.row)">
                    <el-button slot="reference" type="text" size="small">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <el-dialog :title="operation+'模型'" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
          <el-row>
            <el-col v-for="attribute in model.attributes" :key="attribute.id" :span="12">
              <el-form-item v-if="attribute.valueList==null||attribute.length===0" :label="attribute.attributeName">
                <el-input v-model="attribute.value" class="property-input" :disabled="operation==='查看'"/>
              </el-form-item>
              <el-form-item v-if="attribute.valueList!=null&&attribute.length!==0" :label="attribute.attributeName">
                <el-select v-model="attribute.value" placeholder="请选择值" :disabled="operation==='查看'">
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
          <el-button size="small" @click="closeDialog('modelAttrForm')">关闭</el-button>
          <el-button v-if="operation!=='查看'" size="small" type="primary" @click="submitModelForm('modelAttrForm')">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deleteModel, editModelAttribute, info, searchModel } from '@/api/model'
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
      },
      operation: ''
    }
  },
  computed: {
    displayedHeaders: function() {
      return this.headers.filter(header => {
        return header.displayed
      })
    },
    displayedAttributeViews: function() {
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
      this.showFilters = false
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
        this.showFilters = false
      }
    },
    handleClose(id) {
      for (let i = 0; i < this.probe.attributes.length; i++) {
        if (this.probe.attributes[i].id === id) {
          this.probe.attributes.splice(i, 1)
          break
        }
      }
      this.query()
    },
    handleClickTag(attributeId, val, values) {
      for (let i = 0; i < this.probe.attributes.length; i++) {
        if (this.probe.attributes[i].id === attributeId) {
          this.probe.attributes.splice(i, 1)
          break
        }
      }
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
      this.list = []
      this.probe.attributes = []
      this.attributeViews = []
      this.showFilters = false
    },
    handleCurrentChange(val) {
      this.pageable.page = val - 1
      this.query()
    },
    handleSizeChange(val) {
      this.pageable.size = val
      this.query()
    },
    queryById(row) {
      info(row.id)
        .then(res => {
          if (res.code === 0) {
            this.model = res.data
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
          }
        })
    },
    handleView(row) {
      this.queryHeaders()
      this.queryById(row)
      this.dialogFormVisible = true
      this.operation = '查看'
    },
    handleEdit(row) {
      this.queryHeaders()
      this.queryById(row)
      this.dialogFormVisible = true
      this.operation = '编辑'
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
  margin-top: -50px;
  padding-top: 50px;
}

.app-container {
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
}

.right-panel > div:nth-child(3) {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.right-panel > div:nth-child(3) > div:nth-child(1) {
  flex: 1 1 auto;
}

.operation-panel {
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-left: 50px;
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

.filter-panel {
  margin-bottom: 20px;
}

.filter-class {
  font-size: 10px;
  height: 30px;
  display: flex;
  align-items: center;
}

.filter-label {
  width: 80px;
}
</style>
