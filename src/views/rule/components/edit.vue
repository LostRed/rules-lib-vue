<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <el-page-header :content="operation+'规则'" @back="back"/>
      </div>
      <el-row type="flex" justify="center" style="margin-top: 50px">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
          <el-form ref="ruleInfoForm" size="small" :model="ruleInfo" :rules="rules" label-width="120px">
            <el-form-item label="规则编号" prop="ruleCode" class="property-input">
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
            <el-form-item label="规则描述" prop="description" class="property-input">
              <el-input v-model="ruleInfo.description"/>
            </el-form-item>
            <el-form-item prop="parameterExp" class="property-input">
              <template slot="label">
                <span>参数表达式</span>
                <el-tooltip class="item" effect="dark" content="领域对象内的参数">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp">生成表达式</el-button>
              <el-input v-model="ruleInfo.parameterExp" type="textarea"/>
            </el-form-item>
            <el-form-item prop="conditionExp" class="property-input">
              <template slot="label">
                <span>条件表达式</span>
                <el-tooltip class="item" effect="dark" content="规则是否执行的条件">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp">生成表达式</el-button>
              <el-input v-model="ruleInfo.conditionExp" type="textarea"/>
            </el-form-item>
            <el-form-item prop="predicateExp" class="property-input">
              <template slot="label">
                <span>断定表达式</span>
                <el-tooltip class="item" effect="dark" content="判断参数是否符合预期">
                  <i class="el-icon-question"/>
                </el-tooltip>
              </template>
              <el-button type="text" @click="handleExp">生成表达式</el-button>
              <el-input v-model="ruleInfo.predicateExp" type="textarea"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { queryEnum } from '@/api/system'

export default {
  name: 'EditRule',
  data() {
    return {
      operation: '',
      grades: {
        ILLEGAL: '违规',
        SUSPECTED: '可疑'
      },
      businessTypes: {},
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
    queryEnum({ probe: 'businessType' })
      .then(res => {
        this.businessTypes = res.data
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
    handleExp() {
      this.$router.push({
        name: 'Expression'
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
