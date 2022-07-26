<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <!-- /导航栏 -->

    <div style="padding: 10px">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user";

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      message: this.value,
      localName: ""
    };
  },
  // 也可以在声明个变量，通过created 将传递过来的value值进行传递
  created() {
    this.localName = this.value;
  },
  methods: {
    async onClickRight() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0
      });
      try {
        if (this.localName.trim() === "") return this.$toast("请输入昵称");
        await updateUser({
          name: this.localName
        });
        this.$emit("input", this.localName);
        this.$emit("close");
        this.$toast("更新成功");
      } catch (err) {
        console.dir(err);
        if (err.response && err.response.status === 409) {
          return this.$toast.success("用户名已存在");
        }
        this.$toast("更新失败");
      }
    }
  }
};
</script>

<style scoped lang="less">
.van-popup {
  background: #f5f7f9;
}
</style>
