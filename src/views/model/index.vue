<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="库" prop="libraryId">
              <el-cascader
                v-model="selectedOptions"
                :options="options"
                :props="defaultProps"
                placeholder="请选择库"
                @change="handleChange"
              />
            </el-form-item>
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
          </el-form>
        </div>
        <div>
          <el-button type="success" size="small" @click="handleCreate()">创建</el-button>
        </div>
      </div>
      <div v-if="probe.libraryId!=null" style="margin-bottom: 20px">
        <el-table :data="list" size="small" border fit highlight-current-row>
          <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
          <el-table-column prop="code" label="模型编号" width="100"/>
          <el-table-column prop="keyword" label="模型关键词" show-overflow-tooltip width="300"/>
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
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-dialog title="编辑模型" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
          <el-row>
            <el-col v-for="attribute in model.attributes" :key="attribute.id" :span="12">
              <el-form-item v-if="attribute.valueType==='ONE'" :label="attribute.attributeName">
                <el-input v-model="attribute.value" class="property-input"/>
              </el-form-item>
              <el-form-item v-if="attribute.valueType==='MANY'" :label="attribute.attributeName">
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
import { deleteModel, editModel, searchModel } from '@/api/model'
import { queryTree, queryByLibrary } from '@/api/attribute'

export default {
  name: 'Model',
  data() {
    return {
      selectedOptions: [],
      headers: [],
      options: [],
      defaultProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },
      libraries: [],
      list: [],
      probe: {
        id: null,
        code: null,
        keyword: null,
        libraryId: null
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
    displayedHeaders: () => {
      return this.headers.filter(header => {
        return header.displayed
      })
    }
  },
  created() {
    queryTree().then(res => {
      if (res.code === 0) {
        this.options = res.data
      }
    })
  },
  methods: {
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
    handleChange(selectedOptions) {
      this.probe.libraryId = selectedOptions.slice(-1)[0]
      this.queryHeaders()
      this.list = null
    },
    query() {
      const searchParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      searchModel(searchParam)
        .then(res => {
          if (res.code === 0) {
            this.list = res.data.modelViews
            this.totalElements = res.data.totalElements
            this.totalPages = res.data.totalPages
            this.formatAllAttributes()
            console.log(this.list)
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
    setValue() {
      for (let i = 0; i < this.model.attributeEntries.length; i++) {
        const id = this.model.attributeEntries[i].id
        for (let j = 0; j < this.model.attributes.length; j++) {
          if (this.model.attributes[j].attributeId === id) {
            this.model.attributeEntries[i].value = this.model.attributes[j].value
            break
          }
        }
      }
      this.model.attributes = null
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
      console.log(this.model)
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
          options: this.options
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
  height: 100vh;
  margin-top: -50px;
  padding-top: 50px;
}

.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-container > div:nth-child(2) {
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
</style>
