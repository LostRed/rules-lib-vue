<template>
  <div class="fixed-container">
    <div class="app-container">
      <div class="left-panel" style="float: left">
        <el-tree
          :data="tree"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          @node-click="handleTreeNodeClick"
        />
      </div>
      <div class="right-panel">
        <div class="operation-panel">
          <div>
            <el-form ref="queryForm" size="small" :inline="true" :model="probe">
              <el-form-item label="属性名称" prop="attributeName">
                <el-input v-model="probe.attributeName" placeholder="请输入关键字"/>
              </el-form-item>
              <el-form-item label="值类型" prop="valueType">
                <el-select v-model="valueType">
                  <el-option label="全部" value="all"/>
                  <el-option label="单值" value="ONE"/>
                  <el-option label="多值" value="MANY"/>
                </el-select>
              </el-form-item>
              <el-form-item label="是否展示" prop="displayed">
                <el-select v-model="displayed">
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
        <div style="margin-bottom: 20px">
          <el-table :data="list" size="small" border fit highlight-current-row>
            <el-table-column type="index" :index="indexMethod" label="ID" width="100"/>
            <el-table-column prop="displayed" label="是否展示" width="100">
              <template v-slot="scope">
                <el-switch
                  v-model="scope.row.displayed"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="switchDisplayed(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="order" label="顺序" width="100"/>
            <el-table-column prop="valueType" label="值类型" width="100" :formatter="formatValueType"/>
            <el-table-column prop="attributeName" label="属性名称" width="200"/>
            <el-table-column prop="valueList" label="值可选列表" :formatter="formatValueList"/>
            <el-table-column fixed="right" label="操作" width="150">
              <template v-slot="scope">
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
            :page-sizes="[ 10, 15, 20, 50]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
      <el-dialog :title="operation + '属性'" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="attributeForm" size="small" :model="attribute" :rules="rules" label-width="100px">
          <el-form-item label="属性名称" prop="libraryCode" class="property-input">
            <el-input v-model="attribute.attributeName"/>
          </el-form-item>
          <el-form-item label="值类型" prop="valueType" class="property-input">
            <el-select v-model="attribute.valueType" @blur="resetAttributeForm('attributeForm')">
              <el-option label="单值" value="ONE"/>
              <el-option label="多值" value="MANY"/>
            </el-select>
          </el-form-item>
          <el-form-item label="值可选列表" prop="valueList" class="property-input">
            <el-select
              v-model="attribute.valueList"
              multiple
              filterable
              allow-create
              default-first-option
              :disabled="attribute.valueType==='ONE'"
            >
              <el-option v-for="value in attribute.valueList" :key="value" :label="value" :value="value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="顺序" prop="order" class="property-input">
            <el-input-number v-model="attribute.order" :min="0"/>
          </el-form-item>
          <el-form-item label="是否展示" prop="displayed" class="property-input">
            <el-switch v-model="attribute.displayed" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeDialog('attributeForm')">取消</el-button>
          <el-button size="small" type="primary" @click="submitLibraryForm('attributeForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { createAttribute, editAttribute, queryAttribute, switchDisplayed, queryTree } from '@/api/attribute'

export default {
  name: 'Attribute',
  data() {
    const checkValueList = (rule, value, callback) => {
      if (this.attribute.valueType === 'MANY' && (this.attribute.valueList == null || this.attribute.valueList.length === 0)) {
        callback(new Error('请输入值可选列表'))
        return
      }
      callback()
    }
    return {
      tree: [],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      catalogs: [],
      list: [],
      valueType: 'all',
      displayed: 'all',
      probe: {
        id: null,
        attributeName: null,
        valueType: null,
        valueList: null,
        displayed: null,
        order: null,
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
        valueType: 'ONE',
        valueList: null,
        displayed: true,
        order: 0,
        libraryId: null
      },
      rules: {
        attributeName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        valueList: [
          { validator: checkValueList, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    queryTree().then(res => {
      if (res.code === 0) {
        this.tree = res.data
      }
    })
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    formatValueType(row, column, cellValue, index) {
      return cellValue === 'ONE' ? '单值' : '多值'
    },
    formatValueList(row, column, cellValue, index) {
      if (cellValue != null) {
        return cellValue.join()
      }
      return null
    },
    query() {
      this.valueType === 'all' ? this.probe.valueType = null : this.probe.valueType = this.valueType
      this.displayed === 'all' ? this.probe.displayed = null : this.probe.displayed = this.displayed
      const queryParam = {
        probe: this.probe,
        pageable: this.pageable
      }
      queryAttribute(queryParam)
        .then(res => {
          if (res.code === 0) {
            this.list = res.data.content
            this.totalElements = res.data.totalElements
            this.totalPages = res.data.totalPages
          }
        })
    },
    resetQueryForm(formName) {
      this.$refs[formName].resetFields()
      this.valueType = 'all'
      this.displayed = 'all'
    },
    submitQueryForm() {
      if (this.probe.libraryId == null) {
        this.$message('请先选择一个库')
        return
      }
      this.query()
    },
    handleTreeNodeClick(data, node, element) {
      if (node.isLeaf) {
        this.probe.libraryId = node.key
        this.query()
      }
    },
    handleCurrentChange(val) {
      this.pageable.page = val - 1
      this.query()
    },
    handleSizeChange(val) {
      this.pageable.size = val
      this.query()
    },
    handleEdit(row) {
      this.attribute.id = row.id
      this.attribute.attributeName = row.attributeName
      this.attribute.valueType = row.valueType
      this.attribute.valueList = row.valueList
      this.attribute.displayed = row.displayed
      this.attribute.order = row.order
      this.attribute.libraryId = this.probe.libraryId
      this.dialogFormVisible = true
      this.operation = '编辑'
    },
    handleCreate() {
      if (this.probe.libraryId == null) {
        this.$message('请先选择一个库')
        return
      }
      this.attribute = {}
      this.attribute.libraryId = this.probe.libraryId
      this.attribute.valueType = 'ONE'
      this.attribute.displayed = true
      this.attribute.order = 0
      this.dialogFormVisible = true
      this.operation = '创建'
    },
    resetAttributeForm(formName) {
      if (this.attribute.valueType === 'MANY') {
        return
      }
      this.$refs[formName].resetFields()
      this.attribute.valueList = null
    },
    switchDisplayed(row) {
      switchDisplayed({ probe: row.id })
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    submitLibraryForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.operation === '编辑') {
            editAttribute(this.attribute)
              .then(res => {
                if (res.code === 0) {
                  this.$message.success('修改成功')
                  this.query()
                }
              })
          } else {
            createAttribute(this.attribute)
              .then(res => {
                if (res.code === 0) {
                  this.$message.success('创建成功')
                  this.query()
                }
              })
          }
          this.dialogFormVisible = false
        }
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

.app-container > div:nth-child(2) {
  flex: 1 1 auto;
}

.left-panel {
  min-width: 200px;
  margin-right: 20px;
}

.right-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
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
