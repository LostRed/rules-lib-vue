<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-page-header :content="title" @back="back"/>
      <el-row align="middle" type="flex" justify="center" :gutter="20" style="margin-top: 20px;height: 100%">
        <el-col :span="11" style="height: 100%">
          <b-code-editor
            v-model="input"
            :auto-format="true"
            :smart-indent="true"
            theme="idea"
            :indent-unit="2"
            :line-wrap="false"
            height="90%"
          />
        </el-col>
        <el-col :span="2" style="height: 100%">
          <div class="button-panel">
            <div style="margin-bottom: 20px">
              <el-button size="small" @click="evaluate">评估</el-button>
            </div>
            <div>
              <el-button type="primary" size="small" @click="execute">执行</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="11" style="height: 100%">
          <b-code-editor
            v-model="output"
            :lint="false"
            :auto-format="true"
            :smart-indent="true"
            theme="idea"
            :indent-unit="2"
            :line-wrap="false"
            :readonly="true"
            height="90%"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { evaluate, execute } from '@/api/rulesEngine'

export default {
  name: 'Test',
  data() {
    return {
      title: '',
      param: {
        businessType: '',
        id: '',
        input: {}
      },
      input: '',
      output: ''
    }
  },
  created() {
    this.title = this.$route.params.title
    this.param.businessType = this.$route.params.businessType
    this.input = JSON.stringify(this.param, null, '  ')
  },
  methods: {
    back() {
      this.$router.push('/')
    },
    changValue(val) {
      this.input = val
    },
    evaluate() {
      if (!this.isJSON(this.input)) {
        this.$message.error(`json格式错误`)
        return
      }
      const data = JSON.parse(this.input)
      evaluate(data)
        .then(res => {
          this.output = JSON.stringify(res.data, null, '  ')
        })
    },
    execute() {
      if (!this.isJSON(this.input)) {
        this.$message.error(`json格式错误`)
        return
      }
      const data = JSON.parse(this.input)
      execute(data)
        .then(res => {
          this.output = JSON.stringify(res.data, null, '  ')
        })
    },
    isJSON(str) {
      if (typeof str === 'string') {
        try {
          const obj = JSON.parse(str)
          return typeof obj === 'object' && obj
        } catch (e) {
          return false
        }
      } else if (typeof str === 'object' && str) {
        return true
      }
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

.button-panel {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
