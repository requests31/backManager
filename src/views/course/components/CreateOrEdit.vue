<template>
  <div class="create-or-edit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="activeSteps" simple>
          <el-step
            v-for="item in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeSteps = item.id - 1"
          ></el-step>
        </el-steps>
      </div>
      <el-form :label-position="labelPosition" label-width="80px" :model="courses">
        <div v-show="activeSteps === 0">
          <span>基本信息</span>
          <el-form-item label="名称" required>
            <el-input v-model="courses.courseName"></el-input>
          </el-form-item>
          <el-form-item label="简介" required>
            <el-input v-model="courses.brief"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名" required>
            <el-input v-model="courses.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介" required>
            <el-input v-model="courses.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程概述" required>
            <el-input
              style="width: 49%;min-width:300px;margin-right: 15px"
              placeholder="概述1"
              v-model="courses.previewFirstField"
            >
            <template slot="append">{{courses.previewFirstField.length}}/20</template>
            </el-input>
            <el-input
              style="width: 49%;min-width: 300px"
              placeholder="概述2"
              v-model="courses.previewSecondField"
            >
            <template slot="append">{{courses.previewSecondField.length}}/20</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课程排序" required>
            <el-input-number
              v-model="courses.sortNum"
              controls-position="right"
              :min="1"
              :max="10"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeSteps === 1">
          <!-- 封装上传图片组件 -->
          <course-image
            v-model="courses.courseListImg"
            label="课程封面"
            :limit="3"
          ></course-image>
          <course-image
            v-model="courses.courseImgUrl"
            label="解锁封面"
          ></course-image>
        </div>
        <div v-show="activeSteps === 2">
          <el-form-item label="售卖价格" required>
            <el-input
              type="Number"
              :min="0"
              v-model="courses.discounts">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              v-model="courses.price"
              type="Number"
              :min="0"
            >
            <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              v-model="courses.sales"
              type="Number"
              :min="0"
            >
            <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="courses.discountsTag"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeSteps === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="courses.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="courses.activityCourse">
            <el-form-item label="开始时间">
            <el-date-picker
              v-model="courses.activityCourseDTO.beginTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
            <el-date-picker
              v-model="courses.activityCourseDTO.endTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model="courses.activityCourseDTO.amount"
                type="Number"
                :min="0"
              >
              <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                v-model="courses.activityCourseDTO.stock"
                type="Number"
                :min="0"
              >
              <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeSteps === 4">
          <el-form-item>
            <!-- <el-input
              type="textarea"
              v-model="courses.courseDescriptionMarkDown"
            ></el-input> -->
            <text-editor v-model="courses.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="课程是否上架">
            <el-switch
              v-model="courses.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeSteps !== steps.length -1">
          <el-button type="primary" @click="activeSteps++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  data () {
    return {
      activeSteps: 0,
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-picture' },
        { id: 3, title: '销售信息', icon: 'el-icon-edit' },
        { id: 4, title: '秒杀活动', icon: 'el-icon-edit' },
        { id: 5, title: '课程详情', icon: 'el-icon-edit' }
      ],
      labelPosition: 'right',
      courses: {
        // 课程名称
        courseName: '',
        // 简介
        brief: '',
        teacherDTO: {
          courseId: 0,
          // 讲师姓名
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          // 讲师简介
          description: ''
        },
        // 课程详情
        courseDescriptionMarkDown: '<h3>默认内容</h3>',
        // 商品原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面
        courseListImg: '',
        // 解锁封面
        courseImgUrl: '',
        sortNum: 0,
        // 课程概述1
        previewFirstField: '',
        // 课程概述2
        previewSecondField: '',
        // 上架状态
        status: 0,
        // 销量
        sales: 0,
        // 参与秒杀的课程
        activityCourse: false,
        activityCourseDTO: {
          courseId: 0,
          // 秒杀活动开始时间
          beginTime: '',
          // 秒杀活动结束时间
          endTime: '',
          // 秒杀价
          amount: 0,
          // 库存
          stock: 0
        },
        autoOnlineTime: ''
      },
      num: 1,
      value1: '',
      imageUrl: ''
    }
  },
  methods: {
    // 编辑功能
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        this.courses = data.data
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            courseId: 0,
            // 秒杀活动开始时间
            beginTime: '',
            // 秒杀活动结束时间
            endTime: '',
            // 秒杀价
            amount: 0,
            // 库存
            stock: 0
          }
        }
      }
    },
    // 新增功能
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.courses)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}成功`)
        this.$router.push({
          name: 'course'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
