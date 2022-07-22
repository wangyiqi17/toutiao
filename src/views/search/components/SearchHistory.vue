<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow">
        <span @click="$emit('clear-search-history')" style="margin-right: 10px"
          >全部删除</span
        >
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>

    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onHistoryClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  data() {
    return { isDeleteShow: false };
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  created() {
    // console.log(this.searchHistories)
  },
  methods: {
    onHistoryClick(item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.$emit("searchFn", index);
      } else {
        // 否则执行搜索操作
        this.$emit("search", item);
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
