<template>
  <div class="course-section">
    <el-button type="text" @click="$router.push({ name: 'course'})">返回</el-button>
    <el-button
      type="primary"
      style="float:right"
      @click="onCreate"
    >添加阶段</el-button>
    <el-card style="margin-top:20px">
      <el-tree
        :data="sections"
        :props="defaultProps"
        @node-click="handleNodeClick"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
        v-loading="isLoading"
        :expand-on-click-node="false"
      >
      <div class="inner" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName">
          <el-button @click="handleEditCourse(data)">编辑</el-button>
          <el-button>添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <span v-else>
          <el-button>编辑</el-button>
          <el-button
            @click="$router.push({
              name: 'course-video',
              params: {
                courseId
              },
              query: {
                lessonId: data.id
              }
            })"
          >上传视频</el-button>
          <el-button>状态</el-button>
        </span>
      </div>
      </el-tree>
      <el-dialog
        :title="isEdit ? '编辑课程' : '添加阶段'"
        :visible.sync="dialogVisible"
        width="30%">
        <create-or-edit-section
          @success="onSuccess"
          @cancel="dialogVisible = false"
          :is-edit="isEdit"
          :course-id="courseId"
          :sectionId="sectionId"
        ></create-or-edit-section>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getSectionById, saveOrUpdateSection, saveOrUpdate } from '@/services/course-section'
import CreateOrEditSection from './components/CreateOrEditSection.vue'
export default {
  components: { CreateOrEditSection },
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false,
      isEdit: false,
      sectionId: '',
      dialogVisible: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    handleClose (done) {
      done()
    },
    // 拖拽完成时触发事件
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      try {
        this.isLoading = true
        // 由于有很多章节与课时，需要给章节和课时进行最新的排序的请求
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 判断当前是章节还是课时，再给对应接口发送请求即可
          if (draggingNode.data.sectionId) {
            // 课时接口处理
            return saveOrUpdate({
              id: item.data.id,
              orderNum: index
            })
          } else {
            // 章节接口处理
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      } finally {
        this.isLoading = false
      }
    },
    // 拖拽验证规则
    handleAllowDrop (draggingNode, dropNode, type) {
      // 规则一、只能同级移动，type不能为空
      // 规则二、课时不能移动到其他章节中
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async loadSection () {
      const { data } = await getSectionById(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    // 监听子组件添加状态
    onSuccess () {
      // 隐藏对话框
      this.dialogVisible = false
      // 刷新列表
      this.loadSection()
      if (this.isEdit) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('添加成功')
      }
    },
    // 编辑课程
    handleEditCourse (rowData) {
      this.isEdit = true
      this.dialogVisible = true
      this.sectionId = rowData.id
    },
    // 添加课程
    onCreate () {
      this.dialogVisible = true
      this.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  flex: 1;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  justify-content: space-between;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
