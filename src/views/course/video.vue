<template>
  <div class="course-video">
    <el-card>
      <div class="header">
        课程相关信息
      </div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
            <el-button
              type="primary"
              @click="handleUpload"
            >开始上传</el-button>
            <el-button
              type="primary"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId
                }
              })"
            >返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  aliyunImageUploadAddress,
  aliyunVideoUploadAddress,
  aliyunTransCode
  // ailiyunTransCodePercent
} from '@/services/aliyun-upload'
export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 图片上传后的地址，用于视频上传凭证请求
      imageURL: '',
      // 保存上传实例
      uploader: null,
      videoId: null
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      // 将上传的文件添加到上传列表中
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传
      uploader.startUpload()
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          let uploadAddress = null
          // 图片处理
          if (uploadInfo.isImage) {
            const { data } = await aliyunImageUploadAddress()
            if (data.code === '000000') {
              uploadAddress = data.data
              this.imageURL = uploadAddress.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddress({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddress = data.data
              this.videoId = data.data.videoId
              console.log(this.videoId)
            }
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddress.uploadAuth,
            uploadAddress.uploadAddress,
            uploadAddress.videoId || uploadAddress.imageId
          )
          // 此处设置完毕，上传进度开始执行
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          const lessonId = this.$route.query.lessonId
          // 视频转码处理
          const { data } = await aliyunTransCode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          console.log(data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
