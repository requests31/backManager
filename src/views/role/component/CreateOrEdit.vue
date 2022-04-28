<template>
  <div class="create-or-edit">
    <el-form class="demo-form-inline" ref="form">
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrUpdate, getRoleId } from '@/services/role'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRoleId()
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    async loadRoleId () {
      const { data } = await getRoleId(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    // 添加角色
    async onSubmit () {
      const { data } = await saveOrUpdate(this.role)
      if (data.code === '000000') {
        // 添加成功将事件传递给父组件
        this.$emit('success')
        // 清空表单内容
        this.role = {}
      }
    },
    // 取消事件
    onCancel () {
      this.$emit('cancel')
      this.role = {}
    }
  }
}
</script>

<style>

</style>
