<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="目录" prop="modelId">
              <el-select v-model="probe.catalogId" placeholder="请选择目录">
                <el-option
                  v-for="catalog in libraries"
                  :key="catalog.id"
                  :label="catalog.description"
                  :value="catalog.id"
                  @change="probe.catalogId = catalog.id"
                >
                  <span style="float: left">{{ catalog.description }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ catalog.catalogName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模型名称" prop="modelName">
              <el-input v-model="probe.modelName" placeholder="请输入关键字"/>
            </el-form-item>
            <el-form-item label="模型描述" prop="description">
              <el-input v-model="probe.description" placeholder="请输入关键字"/>
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
      <div style="margin-bottom: 17px">
        <el-table :data="list" size="small" border fit highlight-current-row>
          <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
          <el-table-column prop="catalogName" label="目录名称" width="300"/>
          <el-table-column prop="modelName" label="模型名称" width="300"/>
          <el-table-column prop="description" label="模型描述" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="150">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleEnter(scope.row)">进入</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
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
      <el-dialog :title="operation + '模型'" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="modelForm" size="small" :model="model" :rules="rules" label-width="100px">
          <el-form-item label="模型名称" prop="modelName" class="property-input">
            <el-input v-model="model.modelName"/>
          </el-form-item>
          <el-form-item label="模型描述" prop="description" class="property-input">
            <el-input v-model="model.description"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('modelForm')">取消</el-button>
          <el-button size="small" type="primary" @click="submitModelForm('modelForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryCatalog } from '@/api/catalog'
import { queryLibrary } from '@/api/library'
import { createModel, editModel, queryModel } from '@/api/model'

export default {
  name: 'Model',
  data() {
    return {
      libraries: [],
      list: [],
      probe: {
        id: null,
        code: null,
        keyword: null,
        attributes: [],
        libraryId: null
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      operation: '',
      model: {
        libraryId: null,
        code: null,
        keyword: null,
        attributeEntries: null
      },
      rules: {
        modelName: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入模型描述', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryCatalog({})
    queryLibrary({})
      .then(res => {
        this.libraries = res.data.content
      })
    this.probe.catalogId = this.$router.history.current.query.catalogId
    if (this.probe.catalogId != null) {
      this.query()
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    query() {
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      queryModel(queryParam)
        .then(res => {
          this.list = res.data.content
          this.totalElements = res.data.totalElements
          this.totalPages = res.data.totalPages
        })
    },
    submitQueryForm() {
      if (this.probe.catalogId != null) {
        this.query()
      } else {
        this.$message('请先选择一个目录')
      }
    },
    resetQueryForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleCurrentChange(val) {
      this.pageable.page = val - 1
      this.query()
    },
    handleSizeChange(val) {
      this.pageable.size = val
      this.query()
    },
    handleEnter(row) {
      this.$message(row.id.toString())
    },
    handleEdit(row) {
      this.model.id = row.id
      this.model.modelName = row.modelName
      this.model.description = row.description
      this.dialogFormVisible = true
      this.operation = '编辑'
    },
    handleCreate() {
      this.model = {}
      this.dialogFormVisible = true
      this.operation = '创建'
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitModelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operation === '修改') {
            editModel(this.model)
              .then(() => {
                this.$message.success('修改成功')
                this.query()
              })
          } else {
            createModel(this.model)
              .then(() => {
                this.$message.success('创建成功')
                this.query()
              })
          }
          this.dialogFormVisible = false
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
