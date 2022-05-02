<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-button size="small" @click="back">返回</el-button>
        </div>
      </div>
      <el-row type="flex" justify="center">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
          <div class="top-panel">
            <el-steps :active="active" align-center>
              <el-step title="选择库" description="选择该模型的库原型"/>
              <el-step title="编辑基本属性" description="编辑该模型的基本属性，这些属性将作为检索时的关键字"/>
              <el-step title="编辑自定义属性" description="编辑该模型的自定义属性，这些属性将作为检索时的过滤条件"/>
            </el-steps>
          </div>
          <div class="bottom-panel">
            <div style="margin-bottom: 50px">
              <el-button :disabled="active===0" size="small" @click="prev">上一步</el-button>
              <el-button size="small" @click="next">{{ nextButtonName }}</el-button>
            </div>
            <div v-if="active===0" class="step">
              <el-form
                ref="libraryForm"
                size="small"
                :model="model"
                label-width="100px"
                :rules="rules"
              >
                <el-form-item label="库" prop="libraryId">
                  <el-cascader
                    v-model="selectedOptions"
                    :options="options"
                    :props="defaultProps"
                    placeholder="请选择库"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-form>
            </div>
            <div v-if="active===1" class="step">
              <el-form
                ref="modelPropForm"
                size="small"
                :model="model"
                label-width="100px"
                :rules="rules"
              >
                <el-form-item label="模型编号" prop="code">
                  <el-input v-model="model.code" placeholder="请输入关键字" class="property-input"/>
                </el-form-item>
                <el-form-item label="模型关键词" prop="keyword">
                  <el-input v-model="model.keyword" placeholder="请输入关键字" class="property-input"/>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="active===2" class="step">
              <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
                <el-row>
                  <el-col v-for="attribute in model.attributes" :key="attribute.id" :span="12">
                    <el-form-item v-if="attribute.valueType==='ONE'" :label="attribute.attributeName">
                      <el-input v-model="attribute.value" class="property-input"/>
                    </el-form-item>
                    <el-form-item v-if="attribute.valueType==='MANY'" :label="attribute.attributeName">
                      <el-select v-model="attribute.value" placeholder="请选择值">
                        <el-option
                          v-for="value in attribute.valueList"
                          :key="value"
                          :label="value"
                          :value="value"
                          @change="attribute.value=value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-if="active===3" class="step">
              <el-form ref="modelForm" size="small" :model="model" label-width="100px">
                <el-form-item label="库" prop="libraryId">
                  <el-cascader
                    v-model="selectedOptions"
                    :options="options"
                    :props="defaultProps"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="模型编号" prop="code">
                  <el-input v-model="model.code" :disabled="true" class="property-input"/>
                </el-form-item>
                <el-form-item label="模型关键词" prop="keyword">
                  <el-input v-model="model.keyword" :disabled="true" class="property-input"/>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { queryByLibrary } from '@/api/attribute'
import { createModel, existsModel } from '@/api/model'

export default {
  name: 'CreateModel',
  data() {
    const checkModelCode = (rule, value, callback) => {
      existsModel({ probe: value })
        .then(res => {
          if (res.code === 0 && res.data) {
            callback(new Error('该模型编号已存在'))
          }
          callback()
        })
    }
    return {
      active: 0,
      nextButtonName: '下一步',
      selectedOptions: [],
      options: [],
      defaultProps: {
        value: 'id',
        label: 'label',
        children: 'children'
      },
      model: {
        libraryId: null,
        libraryName: null,
        code: null,
        keyword: null,
        attributes: []
      },
      rules: {
        libraryId: [
          { required: true, message: '请选择库', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入模型编号', trigger: 'blur' },
          { validator: checkModelCode, trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入模型关键词', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.options = this.$route.params.options
  },
  methods: {
    back() {
      this.$router.push({ name: 'Model' })
    },
    prev() {
      if (this.active-- < 1) {
        this.active = 1
      }
      if (this.active === 3) {
        this.nextButtonName = '完成'
      } else {
        this.nextButtonName = '下一步'
      }
    },
    valid() {
      const formName = null
      if (this.active === 0) {
        this.$refs[formName].validate(valid => valid)
      }
    },
    next() {
      const next = valid => {
        if (valid) {
          if (this.active++ > 2) {
            this.active = 0
          }
          switch (this.active) {
            case 0:
              this.nextButtonName = '下一步'
              break
            case 1:
              this.nextButtonName = '下一步'
              break
            case 2:
              this.nextButtonName = '下一步'
              break
            default:
              this.nextButtonName = '完成'
          }
        }
      }
      if (this.active === 0) {
        this.$refs['libraryForm'].validate(next)
      } else if (this.active === 1) {
        this.$refs['modelPropForm'].validate(next)
        queryByLibrary({ probe: this.model.libraryId })
          .then(res => {
            if (res.code === 0) {
              console.log(res.data)
              this.model.attributes = res.data
            }
          })
      } else if (this.active === 3) {
        createModel(this.model)
          .then(res => {
            if (res.code === 0) {
              this.$message.success('创建成功')
              next(true)
            }
          })
      } else {
        next(true)
      }
    },
    handleChange(selectedOptions) {
      this.model.libraryId = selectedOptions.slice(-1)[0]
      this.$message('模型库id为' + this.model.libraryId)
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

.top-panel {
  margin-bottom: 50px;
}

.bottom-panel {
  padding: 50px;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);
}

.step {
  padding-bottom: 20px;
}

.property-input {
  width: 90%;
}
</style>
