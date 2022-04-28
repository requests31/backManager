// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/style/variables.scss";`
      }
    }
  }
}