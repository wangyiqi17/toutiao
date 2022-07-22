<template>
  <van-icon
    :color="value === 1 ? 'red' : ''"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onLike"
    :loading="loading"
  />
</template>

<script>
import { deleteLike, addLike } from "@/api/article";
export default {
  data() {
    return {
      loading: false
    };
  },

  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },

  created() {},

  methods: {
    async onLike() {
      this.loading = true;
      try {
        let status = -1;
        if (this.value === 1) {
          await deleteLike(this.articleId);
        } else {
          await addLike(this.articleId);
          status = 1;
        }
        this.$emit("input", status);
        this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败");
      }
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="less"></style>
