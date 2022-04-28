<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="formInline"
          ref="form-inline"
        >
        <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formInline.phone"
              placeholder="请输入手机号"
        ></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="formInline.rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button
              @click="handleOnReset"
            >重置</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
            >查询</el-button>
        </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="user"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          label="头像"
          width="180">
          <template slot-scope="scope">
            <img width="30" :src="scope.row.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
          <template slot-scope="scope">
             <span>{{scope.row.createTime | dataFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleforbidUser(scope.row)"
            >
          </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleSelectRole(scope.row)"
              type="text"
              size="small">
              分配角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <!-- 下拉菜单组件位置 -->
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getRoleInfo, getAllocateUserRoles, getUserRoles } from '@/services/role'
export default {
  name: 'UserList',
  created () {
    this.loadUserPages()
  },
  data () {
    return {
      formInline: {
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      user: [],
      dialogVisible: false,
      // 角色列表
      roles: [],
      // 角色选中的ID
      roleIdList: [],
      // 当前用户ID
      currentUserId: null
    }
  },
  methods: {
    //   获取分页用户信息
    async loadUserPages () {
      const { rangeDate } = this.formInline
      if (rangeDate && rangeDate.length) {
        this.formInline.startCreateTime = rangeDate[0]
        this.formInline.endCreateTime = rangeDate[1]
      } else {
        this.formInline.startCreateTime = ''
        this.formInline.endCreateTime = ''
      }
      const { data } = await getUserPages(this.formInline)
      this.user = data.data.records
    },
    // 重置
    handleOnReset () {
      this.$refs['form-inline'].resetFields()
    },
    // 模糊搜索
    onSubmit () {
      this.loadUserPages()
    },
    // 封禁用户
    async handleforbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    // 分配角色
    async handleSelectRole (userInfo) {
      this.currentUserId = userInfo.id
      console.log(this.currentUserId)
      // 显示分配角色对话框
      this.dialogVisible = true
      // 请求所有角色列表数据
      const { data } = await getRoleInfo()
      if (data.code === '000000') {
        this.roles = data.data
      }

      // 请求当前用户的已分配角色信息
      const { data: data2 } = await getUserRoles(userInfo.id)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    // 关闭对话框
    handleClose (done) {
      done()
    },
    // 保存分配
    async handleSubmit () {
      const { data } = await getAllocateUserRoles({
        userId: this.currentUserId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    }
  },
  filters: {
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
