<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- progress组件 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="percentage"
        :width="178"
        :status="percentage === 100 ? 'success' : undefined"
      ></el-progress>
      <!-- upload组件 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
      <!-- 预览图片显示位置 -->
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { upload } from '@/services/course'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    // 限制上传文件大小，默认为2M
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 上传文件进度百分比
      percentage: 0,
      // 是否显示上传进度
      isUploading: false
    }
  },
  methods: {
    // 自定义上传
    async handleUpload (option) {
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      // 发送上传请求
      const { data } = await upload(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        this.isUploading = false
        this.percentage = 0
      }
    },
    // 上传成功时的回调
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传前的回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
