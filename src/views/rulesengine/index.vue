<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-page-header :content="businessTypes[businessType]+'规则'" @back="back"/>
      <div style="margin-top: 20px">
        <el-row :gutter="20">
          <draggable v-model="rules" group="people" @end="orderRules()">
            <el-col v-for="item in rules" :key="item.ruleCode" :span="12">
              <div>
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="title">
                    <div>
                      <span>{{ item.ruleCode }}</span>
                    </div>
                  </div>
                  <div class="text item">
                    <el-descriptions :column="1">
                      <el-descriptions-item label="业务类型">
                        <el-tag size="mini">{{ businessTypes[item.businessType] }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="严重等级">
                        <el-tag size="mini" :type="item.grade==='ILLEGAL'?'danger':'warning'">
                          {{ grades[item.grade] }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="规则描述">{{ item.description }}</el-descriptions-item>
                      <el-descriptions-item label="执行顺序">{{ item.order }}</el-descriptions-item>
                      <el-descriptions-item label="是否必须启用">
                        <el-switch v-model="item.required" disabled/>
                      </el-descriptions-item>
                      <el-descriptions-item label="参数表达式">
                        <el-tag size="mini" type="info">{{ item.parameterExp }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="条件表达式">
                        <el-tag size="mini" type="info">{{ item.conditionExp }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="断定表达式">
                        <el-tag size="mini" type="info">{{ item.predicateExp }}</el-tag>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </el-card>
              </div>
            </el-col>
          </draggable>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { editRulesOrder, queryRuleInfosByBusinessType } from '@/api/rulesEngine'
import { queryEnum } from '@/api/system'

export default {
  name: 'RulesEngine',
  components: {
    Draggable
  },
  data() {
    return {
      grades: {},
      businessTypes: {},
      businessType: '',
      rules: []
    }
  },
  created() {
    this.businessType = this.$route.params.businessType
    queryEnum({ probe: 'businessType' })
      .then(res => {
        this.businessTypes = res.data
      })
    queryEnum({ probe: 'gradeType' })
      .then(res => {
        this.grades = res.data
      })
    queryRuleInfosByBusinessType(this.businessType)
      .then(res => {
        this.rules = res.data
      })
  },
  methods: {
    back() {
      this.$router.push('/')
    },
    orderRules() {
      editRulesOrder(this.businessType, this.rules.map(e => e.ruleCode))
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
  margin-bottom: 20px;
}
</style>
