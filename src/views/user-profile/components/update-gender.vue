<template>
  <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    :default-index="value"
    @cancel="$emit('close')"
    @change="onChange"
    @confirm="onConfirm"
  />
</template>

<script>
import { updateUser } from "@/api/user";
export default {
  data() {
    return {
      columns: ["男", "女"],
      gender: this.value
    };
  },

  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onChange(picker, value, index) {
      this.gender = index;
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0
      });
      try {
        await updateUser({
          gender: this.gender
        });
        this.$emit("input", this.gender);
        this.$emit("close");
        this.$toast.success("更新成功");
      } catch (err) {
        this.$toast("更新失败");
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
