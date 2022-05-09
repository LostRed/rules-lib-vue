<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <el-page-header content="表达式" @back="back"/>
      </div>
      <el-row type="flex" justify="center" :gutter="21">
        <el-col :xs="8" :sm="7" :md="6" :lg="6" :xl="5">
          <el-card>
            <div slot="header" class="clearfix">
              <span>领域</span>
            </div>
            <el-form size="small">
              <el-form-item label="领域">
                <el-select v-model="className" placeholder="请选择领域" @change="queryProperties">
                  <el-option
                    v-for="domain in domains"
                    :key="domain.className"
                    :label="domain.description"
                    :value="domain.className"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="领域参数">
                <el-tag
                  v-for="property in properties"
                  :key="property.propertyName"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(property.propertyName)"
                >{{ property.propertyName }}
                </el-tag>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :xs="8" :sm="7" :md="6" :lg="5" :xl="5">
          <el-card>
            <div slot="header" class="clearfix">
              <span>片段</span>
            </div>
            <el-form size="small">
              <el-form-item v-if="parameters.length!==0" label="参数片段">
                <el-tag
                  v-for="item in libraries"
                  :key="item.segment"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(item.segment)"
                >{{ item.segment }}
                </el-tag>
              </el-form-item>
              <el-form-item v-if="operators.length!==0" label="运算符片段">
                <el-tag
                  v-for="item in operators"
                  :key="item.segment"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(item.segment)"
                >{{ item.segment }}
                </el-tag>
              </el-form-item>
              <el-form-item v-if="functions.length!==0" label="函数片段">
                <el-tag
                  v-for="item in functions"
                  :key="item.segment"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(item.segment)"
                >{{ item.segment }}
                </el-tag>
              </el-form-item>
              <el-form-item v-if="others.length!==0" label="其它片段">
                <el-tag
                  v-for="item in others"
                  :key="item.segment"
                  size="mini"
                  class="tag"
                  @click="handleClickTag(item.segment)"
                >{{ item.segment }}
                </el-tag>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :xs="8" :sm="7" :md="6" :lg="5" :xl="5">
          <el-card>
            <div slot="header" class="clearfix">
              <span>库</span>
            </div>
            <el-form size="small">
              <el-form-item v-if="libraries.length!==0" label="库">
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
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 20px" :gutter="21">
        <el-col :xs="24" :sm="21" :md="18" :lg="16" :xl="15">
          <el-card>
            <div slot="header" class="clearfix">
              <span>表达式</span>
            </div>
            <el-form size="small">
              <el-form-item label="表达式预览">
                <el-input type="textarea" :rows="5" :value="expression" @input="changValue"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit(type,expression)">生成</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import { queryByClassName, queryDomain } from '@/api/domain'
import { querySegment } from '@/api/segment'
import { queryModelLibrary } from '@/api/library'

export default {
  name: 'Expression',
  data() {
    return {
      parameters: [],
      operators: [],
      functions: [],
      others: [],
      libraries: [],
      className: null,
      domains: [],
      properties: [],
      type: null,
      expression: ''
    }
  },
  created() {
    this.type = this.$route.params.type
    queryDomain({ probe: {}})
      .then(res => {
        if (res.code === 0) {
          this.domains = res.data
        }
      })
    querySegment({ probe: { segmentType: 'PARAMETER' }, pageable: null })
      .then(res => {
        this.parameters = res.data.content
      })
    querySegment({ probe: { segmentType: 'OPERATOR' }, pageable: null })
      .then(res => {
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
        console.log(res.data)
        this.libraries = res.data
      })
  },
  methods: {
    queryProperties(val) {
      this.className = val
      queryByClassName(this.className)
        .then(res => {
          if (res.code === 0) {
            this.properties = res.data.domainProperties
          }
        })
    },
    back() {
      this.$router.push({
        name: 'EditRule'
      })
    },
    handleClickTag(val) {
      this.expression += val
    },
    changValue(val) {
      this.expression = val
    },
    onSubmit(type, expression) {
      this.$router.push({
        name: 'EditRule',
        params: {
          type: type,
          expression: expression
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

.tag {
  margin-right: 5px;
}

.tag:hover {
  cursor: pointer;
}
</style>
