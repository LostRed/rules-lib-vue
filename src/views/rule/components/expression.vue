<template>
  <div class="app-container">
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>领域</span>
      </div>
      <el-form size="small">
        <el-form-item label="领域" label-width="60px">
          <el-select v-model="probe.className" placeholder="请选择领域" @change="queryProperties">
            <el-option
              v-for="domain in domains"
              :key="domain.className"
              :label="domain.description"
              :value="domain.className"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领域参数">
          <el-tooltip
            v-for="property in properties"
            :key="property.propertyName"
            :content="property.description"
          >
            <el-tag
              size="mini"
              class="tag"
              @click="handleClickTag(property.propertyName)"
            >
              {{ property.propertyName }}
            </el-tag>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>库</span>
      </div>
      <el-form size="small">
        <el-form-item v-if="libraries.length!==0" label="库" label-width="60px">
          <el-tag
            v-for="library in libraries"
            :key="library"
            size="mini"
            class="tag"
            @click="handleClickTag(library)"
          >{{ library }}
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>片段</span>
      </div>
      <el-form size="small" label-width="60px">
        <el-form-item v-if="parameters.length!==0" label="参数">
          <el-tooltip
            v-for="item in parameters"
            :key="item.segment"
            :content="item.tips==null?item.description:item.description+' [提示：'+item.tips+']'"
          >
            <el-tag size="mini" class="tag" @click="handleClickTag(item.segment)">
              {{ item.segment }}
            </el-tag>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="operators.length!==0" label="运算符">
          <el-tooltip
            v-for="item in operators"
            :key="item.segment"
            :content="item.tips==null?item.description:item.description+' [提示：'+item.tips+']'"
          >
            <el-tag size="mini" class="tag" @click="handleClickTag(item.segment)">
              {{ item.segment }}
            </el-tag>
            {{ item.description }}
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="functions.length!==0" label="函数">
          <el-tooltip
            v-for="item in functions"
            :key="item.segment"
            :content="item.tips==null?item.description:item.description+' [提示：'+item.tips+']'"
          >
            <el-tag size="mini" class="tag" @click="handleClickTag(item.segment)">
              {{ item.segment }}
            </el-tag>
            {{ item.description }}
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="others.length!==0" label="其它">
          <el-tooltip
            v-for="item in others"
            :key="item.segment"
            :content="item.tips==null?item.description:item.description+' [提示：'+item.tips+']'"
          >
            <el-tag size="mini" class="tag" @click="handleClickTag(item.segment)">
              {{ item.segment }}
            </el-tag>
            {{ item.description }}
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card">
      <div slot="header" class="clearfix">
        <span>表达式</span>
      </div>
      <el-form ref="expressionForm" size="small" :rules="rules" :model="probe">
        <el-form-item label="表达式预览" prop="expression">
          <el-input type="textarea" :rows="5" :value="probe.expression" @input="changValue"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="float: right"
            @click="onSubmit('expressionForm')"
          >
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import { queryByClassName, queryDomain } from '@/api/domain'
import { querySegment } from '@/api/segment'
import { queryModelLibrary } from '@/api/library'
import { parseExpression } from '@/api/system'

export default {
  name: 'Expression',
  data() {
    return {
      parameters: [],
      operators: [],
      functions: [],
      others: [],
      libraries: [],
      domains: [],
      properties: [],
      probe: {
        className: null,
        expression: ''
      },
      rules: {
        expression: [
          { required: true, message: '请输入表达式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryDomain({ probe: {}})
      .then(res => {
        this.domains = res.data
      })
    querySegment({ probe: { segmentType: 'PARAMETER' }, pageable: null })
      .then(res => {
        this.parameters = res.data.content
      })
    querySegment({ probe: { segmentType: 'OPERATOR' }, pageable: null })
      .then(res => {
        console.log(res.data.content)
        this.operators = res.data.content
      })
    querySegment({ probe: { segmentType: 'FUNCTION' }, pageable: null })
      .then(res => {
        this.functions = res.data.content
      })
    querySegment({ probe: { segmentType: 'OTHER' }, pageable: null })
      .then(res => {
        this.others = res.data.content
      })
    queryModelLibrary()
      .then(res => {
        this.libraries = res.data
      })
  },
  methods: {
    queryProperties(val) {
      this.probe.className = val
      queryByClassName(this.probe.className)
        .then(res => {
          this.properties = res.data.domainProperties
        })
    },
    back() {
      this.$router.push({
        name: 'EditRule'
      })
    },
    handleClickTag(val) {
      this.probe.expression += val
    },
    changValue(val) {
      this.probe.expression = val
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          parseExpression(this.probe)
            .then(res => {
              console.log(res)
              this.$emit('generation', this.probe.expression)
              this.probe.expression = ''
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container {
}

.app-container > div:nth-child(2) {
  flex: 1 1 auto;
}

.tag {
  margin-right: 5px;
}

.tag:hover {
  cursor: pointer;
}

.card {
  margin-bottom: 20px;
}
</style>
