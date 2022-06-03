<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="operation-panel">
        <div>
          <el-form ref="queryForm" size="small" :inline="true" :model="probe">
            <el-form-item label="领域" prop="libraryId">
              <el-select
                v-model="probe.className"
                class="domain-select"
                placeholder="请选择领域"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="item in domains"
                  :key="item.className"
                  :label="item.className"
                  :value="item.className"
                >
                  {{ item.className }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="领域描述" prop="description">
              <el-input v-model="domain.description"/>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="saveDescription()">保存描述</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="margin-bottom: 20px">
        <el-table v-loading="loading" :data="properties" size="small" stripe fit highlight-current-row height="100%">
          <template slot="empty">
            <el-empty description="暂无数据"/>
          </template>
          <el-table-column type="index" :index="indexMethod" label="#" width="50"/>
          <el-table-column prop="nested" label="是否内嵌类型" width="100">
            <template v-slot="scope">
              <el-switch v-model="scope.row.nested" :disabled="true"/>
            </template>
          </el-table-column>
          <el-table-column prop="propertyName" label="字段名称" width="200"/>
          <el-table-column prop="propertyType" label="字段类型" width="300"/>
          <el-table-column prop="description" label="字段描述" show-overflow-tooltip>
            <template v-slot="scope">
              <el-input
                v-if="editingProperty.propertyName===scope.row.propertyName"
                v-model="scope.row.description"
                size="mini"
              />
              <span v-if="editingProperty.propertyName!==scope.row.propertyName">
                {{ scope.row.description }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template v-slot="scope">
              <el-button
                v-if="editingProperty.propertyName!==scope.row.propertyName"
                type="text"
                size="small"
                @click="handleEdit(scope.row)"
              >修改描述
              </el-button>
              <el-button
                v-if="editingProperty.propertyName===scope.row.propertyName"
                type="text"
                size="small"
                @click="editSubmit(scope.row)"
              >保存
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { editDomainDesc, editPropertyDesc, queryDomain } from '@/api/domain'

export default {
  name: 'Domain',
  data() {
    return {
      loading: false,
      domains: [],
      probe: {
        className: null,
        description: null,
        domainProperties: []
      },
      domain: {
        className: null,
        description: null
      },
      editingProperty: {
        propertyType: null,
        propertyName: null,
        nested: false,
        description: null
      },
      properties: []
    }
  },
  created() {
    this.query()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    query() {
      this.loading = true
      const queryParam = {
        probe: this.probe
      }
      queryDomain(queryParam)
        .then(res => {
          console.log(res.data)
          this.domains = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveDescription() {
      editDomainDesc(this.domain.className, this.domain.description)
        .then(() => {
          this.$message.success('保存成功')
        })
    },
    handleSelectChange() {
      const domain = this.domains.find(item => item.className === this.probe.className)
      this.domain = domain
      this.properties = domain.domainProperties
    },
    handleEdit(row) {
      this.editingProperty.propertyName = row.propertyName
      this.editingProperty.description = row.description
    },
    editSubmit(row) {
      editPropertyDesc(this.domain.className, row.propertyName, row.description)
        .then(() => {
          this.$message.success('保存成功')
          this.editingProperty.propertyName = null
        })
        .catch(() => {
          this.editingProperty.propertyName = null
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
  display: flex;
  flex-direction: column;
}

.app-container > div:nth-child(2) {
  flex: 1 1 auto;
}

.operation-panel {
  display: flex;
  justify-content: space-between;
}

.domain-select {
  width: 500px;
}
</style>
