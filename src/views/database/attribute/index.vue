<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="left-panel">
        <el-tree :data="tree" :props="defaultProps" default-expand-all @node-click="handleNodeClick"/>
      </div>
      <div class="right-panel">
        <div class="operation-panel">
          <div>
            <el-form ref="queryForm" size="small" :inline="true" :model="probe">
              <el-form-item label="属性名称" prop="attributeName">
                <el-input v-model="probe.attributeName" placeholder="请输入关键字"/>
              </el-form-item>
              <el-form-item label="值类型" prop="valueType">
                <el-select v-model="probe.valueType" placeholder="请选择值类型">
                  <el-option label="全部" value="all"/>
                  <el-option label="单值" value="ONE"/>
                  <el-option label="多值" value="MANY"/>
                </el-select>
              </el-form-item>
              <el-form-item label="是否展示" prop="displayed">
                <el-select v-model="probe.displayed" placeholder="请选择值类型">
                  <el-option label="全部" value="all"/>
                  <el-option label="是" value="true"/>
                  <el-option label="否" value="false"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitQueryForm()">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetQueryForm('queryForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button type="success" size="small" @click="handleCreate()">创建</el-button>
          </div>
        </div>
        <div style="margin-bottom: 17px">
          <el-table :data="list" size="small" border fit highlight-current-row>
            <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
            <el-table-column prop="attributeName" label="属性名称"/>
            <el-table-column prop="valueType" label="值类型"/>
            <el-table-column prop="valueList" label="值可选列表"/>
            <el-table-column prop="sequence" label="顺序" width="100"/>
            <el-table-column prop="displayed" label="是否展示" width="100"/>
            <el-table-column fixed="right" label="操作" width="150">
              <template v-slot="scope">
                <el-button type="text" size="small" @click="handleEnter(scope.row)">进入</el-button>
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalElements"
            :current-page="pageable.page + 1"
            :page-size="pageable.size"
            :page-sizes="[1, 5, 10, 20, 50, 100]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tree } from '@/api/attribute'

export default {
  name: 'Attribute',
  data() {
    return {
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      catalogs: [],
      list: [],
      probe: {
        id: null,
        attributeName: null,
        valueType: 'all',
        valueList: null,
        displayed: 'all',
        sequence: null,
        libraryId: null
      },
      pageable: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      totalPages: 0,
      dialogFormVisible: false,
      operation: '',
      attribute: {
        id: null,
        attributeName: null,
        valueType: null,
        valueList: null,
        displayed: null,
        sequence: null,
        libraryId: null
      }
    }
  },
  created() {
    this.queryTree()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    queryTree() {
      tree().then(res => {
        if (res.code === 0) {
          this.tree = res.data
        }
      })
    },
    handleNodeClick(data) {
      console.log(data)
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
}

.app-container > div:nth-child(2) {
  flex: 1 1 auto;
}

.left-panel {
  width: 12%;
  min-width: 200px;
  margin-right: 20px;
}

.right-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.right-panel > div:nth-child(2) {
  flex: 1 1 auto;
}

.operation-panel {
  display: flex;
  justify-content: space-between;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.property-input {
  width: 90%;
}

</style>
