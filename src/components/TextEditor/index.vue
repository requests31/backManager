<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { upload } from '@/services/course'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      // 用于标记是否加载完毕
      isLoaded: false
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建富文本编辑器之前，进行事件设置
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await upload(fd)
        console.log(data)
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(data.data.name)
      }
      editor.create()
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (this.isLoaded === false) {
        this.editor.txt.html(this.value)
      }
    }
  }
}
</script>

<style>

</style>
