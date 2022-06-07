<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <el-page-header content="创建模型" @back="back"/>
      </div>
      <el-row type="flex" justify="center" style="margin-top: 50px">
        <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
          <div class="top-panel">
            <el-steps :active="active" align-center>
              <el-step title="编辑基本属性" description="编辑该模型的基本属性，这些属性将作为检索时的关键字"/>
              <el-step title="编辑自定义属性" description="编辑该模型的自定义属性，这些属性将作为检索时的过滤条件"/>
              <el-step title="确认" description="确认无误后，点击完成"/>
            </el-steps>
          </div>
          <div class="bottom-panel">
            <div v-if="active===0" class="step">
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
            <div v-if="active===1" class="step">
              <el-form ref="modelAttrForm" size="small" :model="model" label-width="100px">
                <el-row>
                  <el-empty v-if="model.attributes.length===0" description="无自定义属性"/>
                  <el-col v-for="attribute in model.attributes" :key="attribute.id" :span="12">
                    <el-form-item
                      v-if="attribute.valueList==null||attribute.length===0"
                      :label="attribute.attributeName"
                    >
                      <el-input v-model="attribute.value" class="property-input"/>
                    </el-form-item>
                    <el-form-item
                      v-if="attribute.valueList!=null&&attribute.length!==0"
                      :label="attribute.attributeName"
                    >
                      <el-select
                        v-if="attribute.valueType==='ONE'"
                        v-model="attribute.value"
                        placeholder="请选择值"
                      >
                        <el-option
                          v-for="value in attribute.valueList"
                          :key="value"
                          :label="value"
                          :value="value"
                          @change="attribute.value=value"
                        />
                      </el-select>
                      <el-select
                        v-if="attribute.valueType==='MANY'"
                        v-model="attribute.value"
                        multiple
                        placeholder="请选择值"
                      >
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
            <div v-if="active===2" class="step">
              <el-form ref="modelForm" size="small" :model="model" label-width="100px">
                <el-form-item label="模型编号" prop="code">
                  <el-input v-model="model.code" disabled class="property-input"/>
                </el-form-item>
                <el-form-item label="模型关键词" prop="keyword">
                  <el-input v-model="model.keyword" disabled class="property-input"/>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="active===3">
              <el-result v-if="isSuccess" icon="success" title="成功提示" sub-title="模型创建成功！请选择继续或返回模型界面">
                <template slot="extra">
                  <el-button type="primary" size="small" @click="once">继续</el-button>
                  <el-button size="small" @click="back">返回</el-button>
                </template>
              </el-result>
              <el-result v-if="!isSuccess" icon="error" title="错误提示" sub-title="模型创建失败！请选择继续或返回模型界面">
                <template slot="extra">
                  <el-button type="primary" size="small" @click="once">继续</el-button>
                  <el-button size="small" @click="back">返回</el-button>
                </template>
              </el-result>
            </div>
            <div v-if="active!==3" class="button-panel" style="margin-top: 50px">
              <el-button :disabled="active===0" size="small" @click="prev">上一步</el-button>
              <el-button :disabled="model.libraryId==null" size="small" @click="next">{{ nextButtonName }}</el-button>
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
      existsModel({ code: value, libraryId: this.model.libraryId })
        .then(res => {
          if (res.code === 0 && res.data) {
            callback(new Error('该模型编号已存在'))
          }
          callback()
        })
    }
    return {
      isSuccess: false,
      active: 0,
      nextButtonName: '下一步',
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
    this.model.libraryId = this.$route.params.libraryId
    if (this.model.libraryId == null) {
      this.$message.warning('未选择库，无法查询到自定义属性')
      return
    }
    queryByLibrary({ probe: this.model.libraryId })
      .then(res => {
        console.log(res.data)
        this.model.attributes = res.data
      })
  },
  methods: {
    back() {
      this.$router.push({
        name: 'Model',
        params: {
          libraryId: this.model.libraryId
        }
      })
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
          if (this.active === 2) {
            this.nextButtonName = '完成'
          } else {
            this.nextButtonName = '下一步'
          }
        }
      }
      if (this.active === 0) {
        this.$refs['modelPropForm'].validate(next)
      } else if (this.active === 2) {
        createModel(this.model)
          .then(() => {
            this.$message.success('创建成功')
            this.isSuccess = true
            next(true)
          })
      } else {
        next(true)
      }
    },
    once() {
      this.active = 0
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
  padding: 50px 30px 30px 30px;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);
}

.step {
  padding: 20px;
}

.property-input {
  width: 90%;
}

.button-panel {
  display: flex;
  justify-content: flex-end;
}
</style>
