<template>
  <div class="menu-edit">
       <!-- 将编辑功能封装了单独组件 ./components/CreateOrEdit.vue中 -->
      <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './component/CreateOrEdit.vue'
export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
