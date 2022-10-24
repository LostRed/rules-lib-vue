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
          <template slot="empty">
            <el-empty description="暂无数据"/>
          </template>
          <el-table-column prop="ruleCode" label="规则编号" width="150"/>
          <el-table-column prop="businessType" label="业务类型" width="150">
            <template v-slot="scope">
              <el-tag size="mini">{{ businessTypes[scope.row.businessType] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="严重等级" width="100">
            <template v-slot="scope">
              <el-tag size="mini" :type="scope.row.grade==='ILLEGAL'?'danger':'warning'">
                {{ grades[scope.row.grade] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="order" label="执行顺序" width="100"/>
          <el-table-column prop="description" label="规则描述" show-overflow-tooltip/>
          <el-table-column prop="required" label="是否必须启用" width="100">
            <template v-slot="scope">
              <el-switch v-model="scope.row.required" disabled/>
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
              <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="handleDelete(scope.row)">
                <el-button slot="reference" type="text" size="small" style="color: #F56C6C">删除</el-button>
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
      <el-dialog title="查看规则" :visible.sync="dialogFormVisible">
        <div style="padding-left: 50px;padding-right: 50px">
          <el-descriptions ref="ruleInfoForm" :model="ruleInfo" :column="1">
            <el-descriptions-item label="规则编号">{{ ruleInfo.ruleCode }}</el-descriptions-item>
            <el-descriptions-item label="业务类型">
              <el-tag size="mini">{{ ruleInfo.businessType }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="严重等级">
              <el-tag size="mini" :type="ruleInfo.grade==='ILLEGAL'?'danger':'warning'">
                {{ ruleInfo.grade }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="规则描述">{{ ruleInfo.description }}</el-descriptions-item>
            <el-descriptions-item label="参数表达式">
              <el-tag size="small" type="info">{{ ruleInfo.parameterExp }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="条件表达式">
              <el-tag size="small" type="info"> {{ ruleInfo.conditionExp }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="断定表达式">
              <el-tag size="small" type="info"> {{ ruleInfo.predicateExp }}</el-tag>
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
import { destroyRule, queryRule, queryRuleByRuleCode } from '@/api/rule'
import { switchRuleEnabled } from '@/api/rulesEngine'
import { queryEnum } from '@/api/system'

export default {
  name: 'Rule',
  data() {
    return {
      grades: {},
      businessTypes: {},
      list: [],
      probe: {
        ruleCode: null,
        businessType: null,
        grade: null
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
        grade: null,
        order: 0,
        required: false,
        enabled: false,
        parameterExp: null,
        conditionExp: null,
        predicateExp: null
      }
    }
  },
  created() {
    queryEnum({ probe: 'businessType' })
      .then(res => {
        this.businessTypes = res.data
      })
    queryEnum({ probe: 'ruleGrade' })
      .then(res => {
        this.grades = res.data
      })
    this.query()
  },
  methods: {
    query() {
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      queryRule(queryParam)
        .then(res => {
          this.list = res.data.content
          this.totalElements = res.data.totalElements
          this.totalPages = res.data.totalPages
        })
    },
    submitQueryForm() {
      this.pageable.page = 1
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
          this.ruleInfo = res.data
          this.ruleInfo.businessType = this.businessTypes[this.ruleInfo.businessType]
          this.ruleInfo.grade = this.grades[this.ruleInfo.grade]
          this.dialogFormVisible = true
        })
    },
    handleDelete(row) {
      destroyRule(row.businessType, row.ruleCode)
        .then(() => {
          this.$message.success('删除成功')
          if (this.totalElements % this.pageable.size === 1 && this.pageable.page > 0) {
            this.pageable.page--
          }
          this.query()
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
        .catch(() => {
          this.query()
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
