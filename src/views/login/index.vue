<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" @click-left="backToPrePage">
      <template #left>
        <van-icon slot="left" name="cross" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="form" class="form" @submit="login">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rule="mobileRules"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rule="codeRules"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isShowCountDown"
            :time="6 * 1000"
            @finish="isShowCountDown = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="mini"
            type="default"
            @click="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
    <!-- <h1>{{$store.state.number}}</h1>
    <button @click="increment">点击加一</button> -->
  </div>
</template>

<script>
import { login, sendCode } from "@/api/user";
import { mobileRules, codeRules } from "./rules";

export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      mobileRules,
      codeRules,
      isShowCountDown: false,
      user: {
        mobile: "", // 手机号
        code: "" // 验证码
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async login() {
      // 1. 获取表单数据
      const user = this.user;

      // TODO: 2. 表单验证
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true
      });
      // 3. 提交表单请求登录
      try {
        const res = await login(user);
        this.$store.commit("setUser", res.data.data);
        this.$toast.success("登录成功");
        this.$router.push("/profile");
        // console.log('登录成功', res)
      } catch (err) {
        this.$toast.fail("登录失败");
        console.log(err);
        // if (err.response.status === 400) {
        //   console.log('手机号或验证码错误')
        // } else {
        //   console.log('登录失败，请稍后重试', err)
        // }
        const status = err.response.status;
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(err.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('登录错误，请刷新~')
        //     break
        //   default:
        //     this.$toast.fail('登录错误，请刷新~')
        //     break
        // }
        // 优化
        let message = "登录错误，请刷新~";
        if (status === 400) {
          message = err.response.data.message;
        }
        this.$toast.fail(message);
      }

      // 4. 根据请求响应结果处理后续操作
    },
    backToPrePage() {
      this.$router.back();
    },
    async sendCode() {
      try {
        await this.$refs.form.validate("mobile");
        await sendCode(this.mobile);
        this.isShowCountDown = true;
      } catch (error) {
        if (!error.response) {
          this.$toast.fail("手机号格式不正确");
        } else {
          const status = error.response.status;
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message);
          }
        }
      }
    }
    // increment () {
    //   this.$store.commit('setNumber', 1)
    // }
  }
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
