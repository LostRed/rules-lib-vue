<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="片段类型" prop="segmentType">
              <el-select v-model="probe.segmentType" placeholder="请选择业务类型" @change="handleSelectChange">
                <el-option
                  v-for="(segmentType,key) in segmentTypes"
                  :key="key"
                  :label="segmentType"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="片段描述" prop="description">
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
        <el-table :data="list" size="small" stripe fit highlight-current-row height="100%">
          <el-table-column type="index" :index="indexMethod" label="#" width="100"/>
          <el-table-column prop="segment" label="片段" width="300">
            <template v-slot="scope">
              <el-tag size="mini">{{ scope.row.segment }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="片段描述" width="300"/>
          <el-table-column prop="segmentType" label="片段类型" width="100" :formatter="formatSegmentType"/>
          <el-table-column prop="tips" label="提示" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="100">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="handleDelete(scope.row)">
                <el-button slot="reference" type="text" size="small" style="color: #F56C6C" @click="deterDialog($event)">删除</el-button>
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
          :page-sizes="[ 10, 15, 20, 50]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
      <el-dialog :title="operation + '片段'" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="segmentInfoForm" size="small" :model="segmentInfo" :rules="rules" label-width="100px">
          <el-form-item label="片段" prop="segment" class="property-input">
            <el-input v-model="segmentInfo.segment"/>
          </el-form-item>
          <el-form-item label="片段描述" prop="description" class="property-input">
            <el-input v-model="segmentInfo.description"/>
          </el-form-item>
          <el-form-item label="片段类型" prop="segmentType">
            <el-select v-model="segmentInfo.segmentType" placeholder="请选择片段类型">
              <el-option
                v-for="(segmentType,key) in segmentTypes"
                :key="key"
                :label="segmentType"
                :value="key"
                @change="segmentInfo.segmentType = key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="片段提示" prop="tips" class="property-input">
            <el-input v-model="segmentInfo.tips"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('segmentInfoForm')">关闭</el-button>
          <el-button size="small" type="primary" @click="submitSegmentInfoForm('segmentInfoForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryEnum } from '@/api/system'
import { createSegment, deleteSegment, editSegment, querySegment } from '@/api/segment'

export default {
  name: 'Segment',
  data() {
    return {
      segmentTypes: [],
      list: [],
      probe: {
        id: null,
        segment: null,
        segmentType: null,
        description: null,
        tips: null
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      operation: '',
      segmentInfo: {
        segment: null,
        segmentType: null,
        description: null,
        tips: null
      },
      rules: {
        segment: [
          { required: true, message: '请输入片段', trigger: 'blur' }
        ],
        segmentType: [
          { required: true, message: '请输入片段类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入片段描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryEnum({ probe: 'segmentType' })
      .then(res => {
        this.segmentTypes = res.data
      })
    this.query()
  },
  methods: {
    indexMethod(index) {
      return this.pageable.size * this.pageable.page + index + 1
    },
    formatSegmentType(row, column, cellValue) {
      return this.segmentTypes[cellValue]
    },
    query() {
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      querySegment(queryParam)
        .then(res => {
          this.list = res.data.content
          this.totalElements = res.data.totalElements
          this.totalPages = res.data.totalPages
        })
    },
    submitQueryForm() {
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
    handleEdit(row) {
      this.segmentInfo.id = row.id
      this.segmentInfo.segment = row.segment
      this.segmentInfo.segmentType = row.segmentType
      this.segmentInfo.description = row.description
      this.segmentInfo.tips = row.tips
      this.dialogFormVisible = true
      this.operation = '编辑'
    },
    handleCreate() {
      this.segmentInfo = {}
      this.dialogFormVisible = true
      this.operation = '创建'
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitSegmentInfoForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operation === '编辑') {
            editSegment(this.segmentInfo)
              .then(() => {
                this.$message.success('修改成功')
                this.query()
              })
          } else {
            createSegment(this.segmentInfo)
              .then(() => {
                this.$message.success('创建成功')
                this.query()
              })
          }
          this.dialogFormVisible = false
        }
      })
    },
    deterDialog(e) {
      e.stopPropagation()
    },
    handleDelete(row) {
      deleteSegment(row.id)
        .then(() => {
          this.$message.success('删除成功')
          if (this.totalElements % this.pageable.size === 1 && this.pageable.page > 0) {
            this.pageable.page--
          }
          this.query()
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
