<template>
  <div class="course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
      </div>
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        ref="form-inline"
      >
        <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="formInline.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button
              @click="onReset"
            >重置</el-button>
            <el-button
              @click="onSubmit"
              type="primary"
              :disabled="isLoading"
            >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>查询结果：</span>
        <el-button
          style="float: right;margin-top:-10px"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push({
            name: 'course-create'
          })"
        >添加课程</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitch(scope.row)"
              :disabled="scope.row.isDisabled"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="formInline.currentPage"
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourse, changeStatus } from '@/services/course'
export default {
  name: 'CourseList',
  data () {
    return {
      formInline: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      tableData: [],
      value: 1,
      totalCount: 0,
      isLoading: false
    //   isDisabled: false
    }
  },
  created () {
    // 加载课程
    this.loadCourse()
  },
  methods: {
    // 上下架
    async handleSwitch (course) {
      course.isDisabled = true
      const { data } = await changeStatus({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        course.isDisabled = false
      }
    },
    // 分页
    handleSizeChange (val) {
      this.formInline.pageSize = val
      this.formInline.currentPage = 1
      this.loadCourse()
    },
    handleCurrentChange (val) {
      this.formInline.currentPage = val
      this.loadCourse()
    },
    // 分页查询课程信息
    async loadCourse () {
      this.isLoading = true
      const { data } = await getQueryCourse(this.formInline)
      console.log(data)
      if (data.code === '000000') {
        //  更改状态
        data.data.records.forEach(item => {
          item.isDisabled = false
        })
        this.tableData = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    // 模糊搜索
    onSubmit () {
      this.formInline.currentPage = 1
      this.loadCourse()
    },
    // 重置
    onReset () {
      this.$refs['form-inline'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
