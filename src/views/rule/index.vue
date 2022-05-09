<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="规则编号" prop="ruleCode">
              <el-input v-model="probe.ruleCode" placeholder="请输入关键字"/>
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
              <el-select v-model="probe.businessType" placeholder="请选择业务类型">
                <el-option
                  v-for="(businessType,key) in businessTypes"
                  :key="key"
                  :label="businessType"
                  :value="key"
                  @change="probe.businessType = key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="严重等级" prop="grade">
              <el-select v-model="probe.grade" placeholder="请选择严重等级">
                <el-option
                  v-for="(grade,key) in grades"
                  :key="key"
                  :label="grade"
                  :value="key"
                  @change="probe.grade = key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="规则描述" prop="description">
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
          <el-table-column prop="ruleCode" label="规则编号" width="150"/>
          <el-table-column prop="businessType" label="业务类型" width="100" :formatter="formatBusinessType"/>
          <el-table-column prop="grade" label="严重等级" width="100" :formatter="formatGrade"/>
          <el-table-column prop="order" label="执行顺序" width="100"/>
          <el-table-column prop="description" label="规则描述" show-overflow-tooltip/>
          <el-table-column prop="required" label="是否必须启用" width="100">
            <template v-slot="scope">
              <el-switch v-model="scope.row.required" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="是否启用" width="100">
            <template v-slot="scope">
              <el-switch v-model="scope.row.enabled" @change="switchEnabled(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
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
      <el-dialog title="查看规则" :visible.sync="dialogFormVisible">
        <div style="padding-left: 50px;padding-right: 50px">
          <el-descriptions ref="ruleInfoForm" :model="ruleInfo" :column="1">
            <el-descriptions-item label="规则编号">{{ ruleInfo.ruleCode }}</el-descriptions-item>
            <el-descriptions-item label="业务类型">{{ ruleInfo.businessType }}</el-descriptions-item>
            <el-descriptions-item label="严重等级">{{ ruleInfo.grade }}</el-descriptions-item>
            <el-descriptions-item label="规则描述">{{ ruleInfo.description }}</el-descriptions-item>
            <el-descriptions-item label="参数表达式">
              <el-tag size="small">{{ ruleInfo.parameterExp }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="条件表达式">
              <el-tag size="small"> {{ ruleInfo.conditionExp }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="断定表达式">
              <el-tag size="small"> {{ ruleInfo.predicateExp }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('ruleInfoForm')">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { queryRule, queryRuleByRuleCode, switchRuleEnabled } from '@/api/rule'
import { queryEnum } from '@/api/system'

export default {
  name: 'Rule',
  data() {
    return {
      grades: {
        ILLEGAL: '违规',
        SUSPECTED: '可疑'
      },
      businessTypes: {},
      list: [],
      probe: {
        ruleCode: null
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      ruleInfo: {
        ruleCode: null,
        description: null,
        businessType: null,
        grade: '违规',
        order: 0,
        required: false,
        enabled: false,
        parameterExp: null,
        conditionExp: null,
        predicateExp: null
      },
      rules: {
        ruleCode: [
          { required: true, message: '请输入规则编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入规则描述', trigger: 'blur' }
        ],
        parameterExp: [
          { required: true, message: '请输入参数表达式', trigger: 'blur' }
        ],
        conditionExp: [
          { required: true, message: '请输入条件表达式', trigger: 'blur' }
        ],
        predicateExp: [
          { required: true, message: '请输入断定表达式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryEnum({ probe: 'businessType' })
      .then(res => {
        this.businessTypes = res.data
      })
    this.query()
  },
  methods: {
    formatBusinessType(row, column, cellValue, index) {
      return this.businessTypes[cellValue]
    },
    formatGrade(row, column, cellValue, index) {
      return this.grades[cellValue]
    },
    query() {
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      queryRule(queryParam)
        .then(res => {
          if (res.code === 0) {
            this.list = res.data.content
            console.log(this.list)
            this.totalElements = res.data.totalElements
            this.totalPages = res.data.totalPages
          }
        })
    },
    submitQueryForm() {
      this.query()
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
    handleView(row) {
      queryRuleByRuleCode({ probe: row.ruleCode })
        .then(res => {
          if (res.code === 0) {
            this.ruleInfo = res.data
            this.ruleInfo.businessType = this.businessTypes[this.ruleInfo.businessType]
            this.ruleInfo.grade = this.grades[this.ruleInfo.grade]
            this.dialogFormVisible = true
          }
        })
    },
    handleEdit(row) {
      queryRuleByRuleCode({ probe: row.ruleCode })
        .then(res => {
          if (res.code === 0) {
            const ruleInfo = res.data
            this.$router.push({
              name: 'EditRule',
              params: {
                ruleInfo: ruleInfo,
                operation: '编辑'
              }
            })
          }
        })
    },
    handleCreate() {
      this.$router.push({
        name: 'EditRule',
        params: {
          operation: '创建'
        }
      })
    },
    switchEnabled(row) {
      switchRuleEnabled(row.businessType, row.ruleCode)
        .then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功')
          }
        })
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
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
</style>
