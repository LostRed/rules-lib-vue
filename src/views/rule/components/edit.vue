<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <el-page-header :content="operation+'规则'" @back="back"/>
      </div>
      <el-row type="flex" justify="center" style="margin-top: 50px">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
          <el-form ref="ruleInfoForm" size="small" :model="ruleInfo" :rules="rules" label-width="120px">
            <el-form-item label="规则编号" prop="ruleCode">
              <el-input v-model="ruleInfo.ruleCode" maxlength="50" show-word-limit/>
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
              <el-select v-model="ruleInfo.businessType" placeholder="请选择业务类型">
                <el-option
                  v-for="(businessType,key) in businessTypes"
                  :key="key"
                  :label="businessType"
                  :value="key"
                  @change="ruleInfo.businessType = key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="严重等级" prop="grade">
              <el-select v-model="ruleInfo.grade" placeholder="请选择严重等级">
                <el-option
                  v-for="(grade,key) in grades"
                  :key="key"
                  :label="grade"
                  :value="key"
                  @change="ruleInfo.grade = key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="规则描述" prop="description">
              <el-input v-model="ruleInfo.description"/>
            </el-form-item>
            <el-form-item label="是否必须启用">
              <el-switch v-model="ruleInfo.required"/>
            </el-form-item>
            <el-form-item prop="parameterExp">
              <template slot="label">
                <span>参数表达式</span>
                <el-tooltip class="item" effect="dark" content="获取领域对象内的参数，当满足断定表达式后会记录该参数的值">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp('参数表达式')">生成表达式</el-button>
              <el-input v-model="ruleInfo.parameterExp" disabled/>
            </el-form-item>
            <el-form-item prop="conditionExp">
              <template slot="label">
                <span>条件表达式</span>
                <el-tooltip class="item" effect="dark" content="满足该表达式时，规则才会执行">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp('条件表达式')">生成表达式</el-button>
              <el-input v-model="ruleInfo.conditionExp" disabled/>
            </el-form-item>
            <el-form-item prop="predicateExp">
              <template slot="label">
                <span>断定表达式</span>
                <el-tooltip class="item" effect="dark" content="满足该表达式时，将认为该领域对象是违规的">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp('断定表达式')">生成表达式</el-button>
              <el-input v-model="ruleInfo.predicateExp" disabled/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('ruleInfoForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      :title="expressionType"
      :visible.sync="drawer"
    >
      <expression @generation="generateExpression"/>
    </el-drawer>
  </div>
</template>

<script>

import Expression from '@/views/rule/components/expression'
import { createRule, existsRule } from '@/api/rule'
import { getAllEngineBusinessType } from '@/api/rulesEngine'
import { queryEnum } from '@/api/system'

export default {
  name: 'EditRule',
  components: {
    Expression
  },
  data() {
    const checkRuleCode = (rule, value, callback) => {
      existsRule(value)
        .then(res => {
          if (res.code === 0 && res.data) {
            callback(new Error('该规则编号已存在'))
          }
          callback()
        })
    }
    return {
      expressionType: '',
      drawer: false,
      operation: '',
      grades: {},
      businessTypes: {},
      ruleInfo: {
        ruleCode: null,
        description: null,
        businessType: null,
        grade: 'ILLEGAL',
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
          { min: 1, max: 50, message: '长度在1到50个字符', trigger: 'blur' },
          { validator: checkRuleCode, trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'blur' }
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
    getAllEngineBusinessType()
      .then(res => {
        this.businessTypes = res.data
      })
    queryEnum({ probe: 'ruleGrade' })
      .then(res => {
        this.grades = res.data
      })
    if (this.$route.params.ruleInfo != null) {
      this.ruleInfo = this.$route.params.ruleInfo
    }
    this.operation = this.$route.params.operation == null ? '' : this.$route.params.operation
  },
  methods: {
    back() {
      this.$router.push({
        name: 'Rule'
      })
    },
    handleExp(type) {
      this.expressionType = type
      this.drawer = true
    },
    generateExpression(val) {
      switch (this.expressionType) {
        case '参数表达式':
          this.ruleInfo.parameterExp = val
          break
        case '条件表达式':
          this.ruleInfo.conditionExp = val
          break
        case '断定表达式':
          this.ruleInfo.predicateExp = val
          break
      }
      this.drawer = false
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operation === '创建') {
            createRule(this.ruleInfo)
              .then(() => {
                this.$message.success('创建成功')
                this.$router.push({
                  name: 'Rule'
                })
              })
          }
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

.operation-panel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
