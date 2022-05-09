<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <el-page-header content="表达式" @back="back"/>
      </div>
      <el-row type="flex" justify="center" style="margin-top: 50px">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
          <el-form size="small">
            <el-form-item label="领域" class="property-input">
              <el-select v-model="className" placeholder="请选择领域">
                <el-option
                  v-for="domain in domains"
                  :key="domain.className"
                  :label="domain.description"
                  :value="domain.description"
                  @change="queryProperties"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="领域参数" prop="ruleCode" class="property-input">
              <el-tag
                v-for="property in properties"
                :key="property.id"
                size="mini"
                style="margin-right: 5px"
              >{{ property.value }}
              </el-tag>
            </el-form-item>
            <el-form-item label="预览">
              <el-input type="textarea" :value="expression"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">生成</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { queryByClassName, queryDomain } from '@/api/domain'

export default {
  name: 'Expression',
  data() {
    return {
      className: null,
      domains: [],
      properties: [],
      expression: ''
    }
  },
  created() {
    queryDomain({ probe: {} })
      .then(res => {
        if (res.code === 0) {
          this.domains = res.data
        }
      })
  },
  methods: {
    queryProperties() {
      console.log('查询')
      queryByClassName(this.className)
        .then(res => {
          if (res.code === 0) {
            console.log(res.data)
            this.properties = res.data
          }
        })
    },
    back() {
      this.$router.push({
        name: 'EditRule'
      })
    },
    onSubmit() {
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
