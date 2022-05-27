<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="目录" prop="libraryId">
              <el-select v-model="probe.catalogId" placeholder="请选择目录" @change="handleSelectChange">
                <el-option
                  v-for="catalog in catalogs"
                  :key="catalog.id"
                  :label="catalog.catalogName"
                  :value="catalog.id"
                >
                  <span style="float: left">{{ catalog.catalogName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ catalog.description }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库名称" prop="libraryName">
              <el-input v-model="probe.libraryName" placeholder="请输入关键字"/>
            </el-form-item>
            <el-form-item label="库描述" prop="description">
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
      <div style="margin-bottom: 20px">
        <el-table v-loading="loading" :data="list" size="small" stripe fit highlight-current-row height="100%">
          <template slot="empty">
            <el-empty description="暂无数据"/>
          </template>
          <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
          <el-table-column prop="libraryCode" label="库编号" width="300"/>
          <el-table-column prop="libraryName" label="库名称" width="300"/>
          <el-table-column prop="description" label="库描述" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="100">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleEnter(scope.row)">进入</el-button>
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
          :page-sizes="[ 10, 15, 20, 50]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <el-dialog :title="operation + '库'" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="libraryForm" size="small" :model="library" :rules="rules" label-width="100px">
          <el-form-item label="库编号" prop="libraryCode" class="property-input">
            <el-input v-model="library.libraryCode" :disabled="operation === '编辑'"/>
          </el-form-item>
          <el-form-item label="库名称" prop="libraryName" class="property-input">
            <el-input v-model="library.libraryName" maxlength="50" show-word-limit/>
          </el-form-item>
          <el-form-item label="库描述" prop="description" class="property-input">
            <el-input v-model="library.description" maxlength="50" show-word-limit/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('libraryForm')">关闭</el-button>
          <el-button size="small" type="primary" @click="submitLibraryForm('libraryForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryCatalog } from '@/api/catalog'
import { createLibrary, editLibrary, existsLibrary, queryLibrary } from '@/api/library'

export default {
  name: 'Library',
  data() {
    const checkLibraryCode = (rule, value, callback) => {
      if (this.operation === '编辑' && value != null) {
        callback()
        return
      }
      existsLibrary(value)
        .then(res => {
          if (res.code === 0 && res.data) {
            callback(new Error('该库编号已存在'))
          }
          callback()
        })
    }
    return {
      loading: false,
      catalogs: [],
      list: [],
      probe: {
        id: null,
        libraryName: null,
        description: null,
        catalogId: null
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      operation: '',
      library: {
        libraryCode: null,
        libraryName: null,
        description: null,
        catalogId: null,
        catalogName: null
      },
      rules: {
        libraryCode: [
          { required: true, message: '请输入库编号', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/, message: '请输入非中文字符', trigger: 'blur'
          },
          { validator: checkLibraryCode, trigger: 'blur' }
        ],
        libraryName: [
          { required: true, message: '请输入库名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入库描述', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryCatalog({})
      .then(res => {
        this.catalogs = res.data.content
      })
    this.probe.catalogId = this.$route.params.catalogId
    if (this.probe.catalogId != null) {
      this.query()
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    query() {
      this.loading = true
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      queryLibrary(queryParam)
        .then(res => {
          this.list = res.data.content
          this.totalElements = res.data.totalElements
          this.totalPages = res.data.totalPages
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    submitQueryForm() {
      if (this.probe.catalogId == null) {
        this.$message('请先选择一个目录')
        return
      }
      this.query()
    },
    resetQueryForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleSelectChange() {
      this.pageable.page = 0
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
      this.$message('当前库: ' + row.libraryName)
      this.$router.push({
        name: 'Model',
        params: {
          catalogId: this.probe.catalogId,
          libraryId: row.id
        }
      })
    },
    handleEdit(row) {
      this.library.id = row.id
      this.library.libraryCode = row.libraryCode
      this.library.libraryName = row.libraryName
      this.library.description = row.description
      this.library.catalogId = this.probe.catalogId
      this.dialogFormVisible = true
      this.operation = '编辑'
    },
    handleCreate() {
      if (this.probe.catalogId == null) {
        this.$message('请先选择一个目录')
        return
      }
      this.library = {}
      this.library.catalogId = this.probe.catalogId
      this.dialogFormVisible = true
      this.operation = '创建'
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitLibraryForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operation === '编辑') {
            editLibrary(this.library)
              .then(() => {
                this.$message.success('修改成功')
                this.query()
              })
          } else {
            createLibrary(this.library)
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
