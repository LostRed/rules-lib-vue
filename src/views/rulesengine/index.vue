<template>
  <div class="fixed-container">
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form>
            <el-form-item label="输入">
              <el-input type="textarea" :value="input" class="textarea" @input="changValue"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <div class="button-panel">
            <div>
              <el-button size="small" @click="evaluate">评估</el-button>
            </div>
            <div>
              <el-button size="small" @click="execute">执行</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <el-form>
            <el-form-item label="输出">
              <el-input type="textarea" :value="output" class="textarea"/>
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
  name: 'RulesEngine',
  data() {
    return {
      businessType: '',
      input: `{
        "businessType": "${this.businessType}",
        "id": "",
        "className": "",
        "input": {

        }\n}`,
      output: ''
    }
  },
  created() {
    this.businessType = this.$route.params.businessType
  },
  methods: {
    changValue(val) {
      this.input = val
    },
    evaluate() {
      const data = JSON.parse(this.input)
      evaluate(data)
        .then(res => {
          this.output = JSON.stringify(res.data)
        })
    },
    execute() {
      console.log(this.input)
      const data = JSON.parse(this.input)
      execute(data)
        .then(res => {
          this.output = JSON.stringify(res.data)
        })
    }
  }
}
</script>

<style scoped>
.fixed-container {
  background: #97a8be;
  height: 100vh;
  margin-top: -50px;
  padding-top: 50px;
}

.button-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.textarea {
  background: #20a0ff;
  height: 200px;
}
</style>
