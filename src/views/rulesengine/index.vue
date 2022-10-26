<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-page-header :content="businessTypes[businessType]+'规则'" @back="back"/>
      <div style="margin-top: 20px">
        <el-row :gutter="20">
          <draggable v-model="rules" group="people" @end="orderRules()">
            <el-col v-for="item in rules" :key="item.ruleCode" :span="6">
              <div>
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="title">
                    <div style="display: flex;align-items: center">
                      <div style="padding-top: 2px;padding-right: 2px">
                        {{ item.ruleCode }}
                      </div>
                      <div>
                        <el-tag size="mini" :type="item.grade==='ILLEGAL'?'danger':'warning'">
                          {{ grades[item.grade] }}
                        </el-tag>
                      </div>
                    </div>
                    <div>
                      <span>{{ item.order }}</span>
                    </div>
                  </div>
                  <div class="text item">
                    <div style="line-height: 24px">
                      {{ item.description }}
                    </div>
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
        .then(() => {
          queryRuleInfosByBusinessType(this.businessType)
            .then(res => {
              this.rules = res.data
            })
        })
        .catch(() => {
          queryRuleInfosByBusinessType(this.businessType)
            .then(res => {
              this.rules = res.data
            })
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
  min-height: 180px;
}
</style>
