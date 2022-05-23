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
              <el-form-item>
                <div class="pagination">
                  <el-pagination
                    layout="total, sizes, prev, pager, next"
                    :total="totalElements"
                    :current-page="pageable.page + 1"
                    :page-size="pageable.size"
                    :page-sizes="[8, 16, 32, 64]"
                    :pager-count="5"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex">
            <el-popconfirm title="确定清空吗？" style="margin-right: 10px" @confirm="handleClear()">
              <el-button
                slot="reference"
                :disabled="probe.libraryId==null"
                type="danger"
                size="small"
              >
                清空
              </el-button>
            </el-popconfirm>
            <el-button :disabled="probe.libraryId==null" type="success" size="small" @click="handleCreate()">
              创建
            </el-button>
            <el-upload
              ref="upload"
              action=""
              accept=".xls,.xlsx"
              :limit="1"
              :file-list="fileList"
              :on-change="handleImport"
              :auto-upload="false"
              :show-file-list="false"
              :disabled="probe.libraryId==null"
              style="margin-left: 10px"
            >
              <el-button
                slot="trigger"
                :disabled="probe.libraryId==null"
                size="small"
                type="primary"
              >导入
              </el-button>
            </el-upload>
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
        <div v-loading="loading" v-if="probe.libraryId!=null">
          <el-empty v-if="list.length===0" description="暂无数据"/>
          <el-row :gutter="20">
            <el-col v-for="item in list" :key="item.id" :span="6">
              <div @click="handleView(item)">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="title">
                    <div>
                      <span>{{ item.code }}</span>
                    </div>
                    <div>
                      <el-button size="small" type="text" @click="handleEdit(item,$event)">编辑</el-button>
                      <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="handleDelete(item)">
                        <el-button slot="reference" type="text" size="small" @click="deterDialog($event)">删除</el-button>
                      </el-popconfirm>
                    </div>
                  </div>
                  <div class="text item">
                    {{ item.keyword }}
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-dialog :title="operation+'模型'" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="模型代码">
                <el-input v-model="model.code" class="property-input" :disabled="operation==='查看'"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型关键词">
                <el-input v-model="model.keyword" class="property-input" :disabled="operation==='查看'"/>
              </el-form-item>
            </el-col>
          </el-row>
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
import { clearModelByLibrary, deleteModel, editModel, importModel, info, searchModel } from '@/api/model'
import { queryTree, queryByLibrary } from '@/api/attribute'

export default {
  name: 'Model',
  data() {
    return {
      loading: false,
      fileList: [],
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
        size: 16,
        orders: {
          code: true
        }
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
      this.tree = res.data
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
          this.headers = res.data
        })
    },
    handleTreeNodeClick(data, node) {
      if (node.isLeaf) {
        this.probe.libraryId = node.key
        this.queryHeaders()
        this.list = []
        this.pageable.page = 0
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
    handleClickTag(attributeId, val) {
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
      this.loading = true
      const searchParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      searchModel(searchParam)
        .then(res => {
          this.attributes = []
          this.list = res.data.modelViews
          this.attributeViews = res.data.attributeViews
          this.totalElements = res.data.totalElements
          this.totalPages = res.data.totalPages
          this.loading = false
        })
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
        })
    },
    deterDialog(e) {
      e.stopPropagation()
    },
    handleView(row) {
      this.queryHeaders()
      this.queryById(row)
      this.dialogFormVisible = true
      this.operation = '查看'
    },
    handleEdit(row, e) {
      e.stopPropagation()
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
    handleImport(file) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入模型，请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const formData = new FormData()
      formData.append('file', file.raw)
      importModel(this.probe.libraryId, formData)
        .then(res => {
          this.$message.success('成功导入' + res.data.count + '条数据，耗时' + res.data.time + '秒')
          this.$refs.upload.clearFiles()
          this.query()
          loading.close()
        })
        .catch(() => {
          this.$refs.upload.clearFiles()
          loading.close()
        })
    },
    handleClear() {
      const loading = this.$loading({
        lock: true,
        text: '正在清除模型，请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      clearModelByLibrary(this.probe.libraryId)
        .then(() => {
          this.$message.success('操作成功')
          this.query()
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
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
        .then(() => {
          this.$message.success('删除成功')
          if (this.totalElements % this.pageable.size === 1 && this.pageable.page > 0) {
            this.pageable.page--
          }
          this.query()
        })
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitModelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editModel(this.model)
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

.left-panel {
  min-width: 200px;
  margin-right: 20px;
}

.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.operation-panel {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.box-card {
  height: 160px;
  min-width: 200px;
  margin-bottom: 20px;
}

.box-card:hover {
  cursor: pointer;
}
</style>
