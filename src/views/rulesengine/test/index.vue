<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-page-header :content="title" @back="back"/>
      <el-row align="middle" type="flex" justify="center" :gutter="20" style="margin-top: 20px;height: 100%">
        <el-col :span="10" style="height: 100%">
          <el-form style="height: 100%">
            <el-form-item label="输入">
              <el-input
                type="textarea"
                :value="input"
                :rows="25"
                class="resizeNone"
                @input="changValue"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" style="height: 100%">
          <div class="button-panel">
            <div style="margin-bottom: 20px">
              <el-button size="small" @click="evaluate">评估</el-button>
            </div>
            <div>
              <el-button size="small" @click="execute">执行</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10" style="height: 100%">
          <el-form style="height: 100%">
            <el-form-item label="输出" style="height: 100%">
              <el-input
                type="textarea"
                :value="output"
                :rows="25"
                class="resizeNone"
                readonly
              />
            </el-form-item>
          </el-form>
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
        className: '',
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
    this.input = JSON.stringify(this.param, null, '    ')
  },
  methods: {
    back() {
      this.$router.push('/')
    },
    changValue(val) {
      this.input = val
    },
    evaluate() {
      const data = JSON.parse(this.input)
      evaluate(data)
        .then(res => {
          this.output = JSON.stringify(res.data, null, '    ')
        })
    },
    execute() {
      const data = JSON.parse(this.input)
      execute(data)
        .then(res => {
          this.output = JSON.stringify(res.data, null, '    ')
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

.button-panel {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
