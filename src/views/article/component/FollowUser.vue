<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    v-if="!isFollowed"
    size="small"
    icon="plus"
    :loading="isFollowLoading"
    @click="follow"
    >关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    round
    :loading="isFollowLoading"
    size="small"
    @click="follow"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
export default {
  name: "follow-user",
  data() {
    return {
      isFollowLoading: false
    };
  },

  props: {
    isFollowed: {
      required: true
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  model: {
    prop: "isFollowed",
    event: "update"
  },

  created() {},

  methods: {
    // 关注用户
    async follow() {
      this.isFollowLoading = true;
      try {
        // 如果已关注，则取消关注
        if (this.isFollowed) {
          await deleteFollow(this.user_id);
        } else {
          // 否则添加关注
          await addFollow(this.user_id);
        }

        // 更新视图
        this.$emit("update", !this.isFollowed);
      } catch (err) {
        let message = "操作失败，请重试";
        if (err.response && err.response.status === 400) {
          message = "你不能关注你自己";
        }
        this.$toast.fail(message);
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false;
    }
  }
};
</script>

<style scoped lang="less"></style>
