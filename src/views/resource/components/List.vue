<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
          <el-form-item label="资源名称" prop="name">
              <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
              <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option
                v-for="item in resourceCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button @click="onReset">重置</el-button>
              <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="$router.push({name: 'resource-create'})">
    添加
      </el-button>
      <el-button>资源分类</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
            type="index"
            label="编号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="资源名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="url"
            label="资源路径"
            width="180">
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column label="添加时间">
        <template slot-scope="scope">
            <span>{{ scope.row.updatedTime | dataFormat }}</span>
        </template>
        </el-table-column>
        <el-table-column
            label="操作">
            <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- @size-change：当前页、@current-change：每页显示条数、 :current-page：默认显示页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, deleteResource, getCategoryInfo } from '@/services/resources'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      tableData: [],
      totalCount: 0,
      resourceCategories: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadCategory()
  },
  methods: {
    // 点击重置
    onReset () {
      this.$refs.form.resetFields()
      // this.form.name = ''
      // this.form.url = ''
      // this.form.categoryId = ''
    },
    // 点击查询按钮
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    // 查询分类资源列表
    async loadCategory () {
      const { data } = await getCategoryInfo()
      console.log(data)
      this.resourceCategories = data.data
    },
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    },
    async loadResources () {
      this.isLoading = true
      // 开始加载数据
      const { data } = await getResourcePages(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    handleEdit (rowDate) {
      this.$router.push({
        name: 'resource-edit',
        params: {
          id: rowDate.id
        }
      })
    },
    async handleDelete (rowData) {
      this.$confirm('确定删除吗?', '错误提示')
        .then(async () => {
          const { data } = await deleteResource(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            this.loadResources()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
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
