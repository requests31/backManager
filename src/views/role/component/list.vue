<template>
  <div class="role-list">
    <el-card class="box-card">
      <!-- 搜索框部分 -->
      <div slot="header" class="clearfix">
          <h3>筛选搜索</h3>
          <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
            <el-form-item label="输入搜索" prop="name">
                <el-input v-model="form.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onReset">重置</el-button>
                <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            </el-form-item>
          </el-form>
      </div>
      <!-- 表格部分 -->
      <el-button @click="onCreate">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
            type="index"
            label="编号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="角色名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column label="添加时间">
        <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  @click="$router.push({
                    name: 'alloc-menu',
                    params: {
                      roleId: scope.row.id
                    }
                  })"
                >分配菜单</el-button>
                <el-button
                  type="text"
                >分配资源</el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </div>
            </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="isEdit ? '编辑角色' : '添加角色'"
        :visible.sync="dialogVisible"
        width="30%">
        <create-or-edit
          @success="onSuccess"
          @cancel="dialogVisible = false"
          :is-edit="isEdit"
          :role-id="roleId"
        ></create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit.vue'
import { getRolePages, deleteRole } from '@/services/role'
export default {
  components: {
    CreateOrEdit
  },
  name: 'RoleList',
  data () {
    return {
      form: {
        name: ''
      },
      tableData: [],
      isLoading: false,
      // 控制会话框显示
      dialogVisible: false,
      // 判断状态
      isEdit: false,
      roleId: ''
    }
  },
  created () {
    this.loadRolePages()
  },
  methods: {
    onCreate () {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleEdit (row) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = row.id
    },
    // 监听子组件添加状态，成功触发
    onSuccess () {
      // 隐藏对话框
      this.dialogVisible = false
      // 刷新列表
      this.loadRolePages()
      if (this.isEdit) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('添加成功')
      }
    },
    // 模糊搜索
    onSubmit () {
      this.loadRolePages()
    },
    // 重置
    onReset () {
      this.$refs.form.resetFields()
    },
    // 删除角色
    handleDelete (role) {
      this.$confirm(`确定删除角色：${role.name}?`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功!')
          this.loadRolePages()
        })
        .catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('已取消删除')
          }
        })
    },
    // 按条件查询角色
    async loadRolePages () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.isLoading = false
      }
    }
  },
  filters: {
    // 日期过滤器
    dataFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
