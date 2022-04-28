<template>
  <div class="edit">
    <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'EditIndex',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
