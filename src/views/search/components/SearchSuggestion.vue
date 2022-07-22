<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="$emit('search', suggestions[index])"
    >
      <template #icon>
        <van-icon name="search" class="search-icon"></van-icon>
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入API
import { getSearchSuggestion } from "@/api";
import { debounce } from "lodash";
export default {
  data() {
    return {
      suggestions: []
    };
  },
  props: {
    // 搜索关键词
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    // 监视属性绑定函数，如果methods里面的话
    keywords: {
      immediate: true,
      // handler 函数  参数1：函数，参数2：防抖时间  返回值：防抖之后的函数，和参数1功能一样
      handler: debounce(function (val) {
        this.getSearchSuggestion(val);
      }, 200)
    }
  },
  methods: {
    // 获取搜索建议,并处理数据
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestion(this.keywords);
        if (res.data.data.options.length === 0) {
          this.$toast.fail("没有搜索建议");
        }
        this.suggestions = res.data.data.options.filter(Boolean);
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    highlightData() {
      // 将搜索的每一项处理
      const reg = new RegExp(this.keywords, "ig");
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      );
    }
  }
};
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
