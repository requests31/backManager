<template>
  <div class="course-edit">
    <create-or-edit :isEdit="true" :courseId="courseId"></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    CreateOrEdit
  }
}
</script>

<style>

</style>
