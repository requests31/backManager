<template>
  <div class="create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑资源' : '添加资源'}}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资源名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
            <el-input v-model="form.url"></el-input>
        </el-form-item>
            <el-form-item label="描述">
            <el-input v-model="form.description"></el-input>
        </el-form-item>
            <el-form-item label="添加时间">
              <el-col>
                <el-date-picker type="date" placeholder="选择日期"  v-model="form.updatedTime" style="width: 100%;"></el-date-picker>
              </el-col>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdate, getEditResource } from '@/services/resources'
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
        name: '',
        url: '',
        description: '',
        updatedTime: ''
      },
      parentMenuList: []
    }
  },
  created () {
    this.loadResourceInfo()
  },
  methods: {
    // 保存资源信息
    async onSubmit () {
      const { data } = await saveOrUpdate(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.$message.success('添加成功')
        this.$router.push({
          name: 'resource'
        })
      }
    },
    // 编辑资源信息
    async loadResourceInfo () {
      const id = this.$route.params.id || -1
      console.log(id)
      const { data } = await getEditResource(id)
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
