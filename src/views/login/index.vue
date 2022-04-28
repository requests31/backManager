<template>
    <div class="login">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="top"
      >
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :loading='isLoginLoader'
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
// import request from '@/utils/request'
// import qs from 'qs'
import { login } from '@/services/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
        ]
      },
      isLoginLoader: false
    }
  },
  methods: {
    // 登录功能
    async onSubmit () {
      try {
        // 1、校验成功后的功能（提示）
        await this.$refs.form.validate()
        this.isLoginLoader = true
        // 2、发送请求
        // const { data } = await request({
        // method: 'POST',
        // url: '/front/user/login',
        // urlencoded格式：名=值&名=值
        // data: qs.stringify(this.form)
        // data: {
        //   phone: this.form.phone,
        //   password: this.form.password
        // }
        // })
        const { data } = await login(this.form)
        this.isLoginLoader = false
        // 3、响应数据
        if (data.state === 1) {
          this.$message.success('恭喜你，登录成功')
          // 将登录用户的信息存储到vuex中
          this.$store.commit('setUser', data.content)
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error(data.message)
        }
      } catch (error) {
        // 校验失败后的功能（提示）
        console.log('没有通过效验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-form{
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .el-button{
      width: 100%;
    }
  }
}
</style>
