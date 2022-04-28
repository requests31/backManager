<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
      ref="menu-tree"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      default-expand-all
      show-checkbox
      @node-click="handleNodeClick"
      :default-checked-keys="checkedkeys"
    ></el-tree>
    <div style="margin: 20px">
      <el-button @click="onReset">清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadMenuList()
    this.loadRoleMenu()
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedkeys: []
    }
  },
  methods: {
    // 自己封装的用于数据筛选的方法（筛选出被选中菜单选项的ID）
    getCheckedKeys (menus) {
      // 遍历数据（将没有存在子节点的 node 排除，对子节点列表进行筛选）
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 存在子节点了继续进行选中状态检测
          return this.getCheckedKeys(menu.subMenuList)
        }
        this.checkedkeys = [...this.checkedkeys, menu.id]
      })
    },
    async loadRoleMenu () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    // 给角色分配菜单
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    // 获取菜单列表
    async loadMenuList () {
      const { data } = await getMenuList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style>

</style>
