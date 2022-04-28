<template>
  <div class="create">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="菜单名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model="form.href"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单">
                <el-select v-model="form.parentId" placeholder="请选择上级菜单">
                <el-option
                  label="无上级菜单"
                  :value="-1"
                ></el-option>
                <el-option
                  v-for="item in parentMenuList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
             <el-form-item label="前端图标">
                <el-input v-model="form.icon"></el-input>
            </el-form-item>
             <el-form-item label="是否显示">
                <el-radio-group v-model="form.shown">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序">
                 <el-input-number v-model="form.orderNum" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button v-if="!isEdit" >重置</el-button>
            </el-form-item>
            </el-form>
      </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, saveOrUpdate } from '@/services/menu'
export default {
  name: 'MenuCreate',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      parentMenuList: []
    }
  },
  // 加载上级菜单信息
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
      if (data.code === '000000') {
        this.$message.success('添加成功')
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      // 请求菜单数据（上级菜单数据）
      // 检测是否存在路由参数id，并进行对应处理
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 将上级菜单数据保存，进行数据绑定
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据menuInfo，如果存在，更新给form
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
