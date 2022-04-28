<template>
  <div class="create-or-edit-section">
    <el-form label-position="right" label-width="80px" :model="formLabelAlign">
      <el-form-item label="课程名称" required>
      <!-- <el-input v-model="courseName" :disabled="true"></el-input> -->
      <el-input v-model="courseName"></el-input>
      </el-form-item>
      <el-form-item label="章节名称" required>
      <el-input v-model="formLabelAlign.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="章节描述">
      <el-input v-model="formLabelAlign.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="章节排序">
      <el-input v-model="formLabelAlign.orderNum"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrUpdateSection, getBySectionId } from '@/services/course-section'
import { getCourseById } from '@/services/course'
export default {
  name: 'CreateOrEditSection',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number],
      required: true
    },
    sectionId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      formLabelAlign: {
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: ''
      },
      courseName: ''
    }
  },
  created () {
    this.initCourseId()
    if (this.isEdit) {
      this.handleEditCourse()
    }
  },
  methods: {
    async initCourseId () {
      // 根据id查询课程名称
      const { data: data1 } = await getCourseById(this.courseId)
      if (data1.code === '000000') {
        this.courseName = data1.data.courseName
      }
    },
    // 编辑课程，根据Id获取课程信息
    async handleEditCourse () {
      const { data } = await getBySectionId(this.sectionId)
      if (data.code === '000000') {
        this.formLabelAlign = data.data
      }
    },
    // 点击确定按钮保存修改内容
    async onSubmit () {
      const { data } = await saveOrUpdateSection(this.formLabelAlign)
      if (data.code === '000000') {
        this.$emit('success')
        this.formLabelAlign = {}
      }
    },
    // 取消事件
    onCancel () {
      this.$emit('cancel')
      this.formLabelAlign = {}
    }
  }
}
</script>

<style>

</style>
