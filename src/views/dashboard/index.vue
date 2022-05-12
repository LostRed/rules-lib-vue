<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-divider content-position="left">规则引擎</el-divider>
      <el-row :gutter="20">
        <el-col v-for="item in rulesEngines" :key="item.id" :span="6">
          <div @click="handleEnter(item.businessType)">
            <el-card class="box-card">
              <div slot="header" class="title">
                <div>
                  <span>{{ businessTypes[item.businessType] }}</span>
                </div>
              </div>
              <div class="text item">
                规则数量: {{ item.ruleCount }}
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left">监控</el-divider>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllEngineView } from '@/api/rulesEngine'
import { queryEnum } from '@/api/system'

export default {
  name: 'Dashboard',
  data() {
    return {
      businessTypes: {},
      rulesEngines: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    queryEnum({ probe: 'businessType' })
      .then(res => {
        this.businessTypes = res.data
      })
    getAllEngineView()
      .then(res => {
        this.rulesEngines = res.data
      })
  },
  methods: {
    handleEnter(businessType) {
      console.log(businessType)
      this.$router.push({
        name: 'RulesEngine',
        params: {
          businessType: businessType
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
  height: 160px;
  min-width: 200px;
  margin-bottom: 20px;
  transition: all .25s;
}

.box-card:hover {
  cursor: pointer;
  position: relative;
  top: -3px;
  left: -3px;
}
</style>
