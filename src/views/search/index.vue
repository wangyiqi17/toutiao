<template>
    <div>
    <form action="/">
  <van-search
    v-model="keywords"
    show-action
    placeholder="请输入搜索关键词"
    @search="onSearch"
    @cancel="backToPrePage"
    @focus="visibleSearchSuggestion"
    background="#3296fa"
    class="search"
  ></van-search>
    <!-- <SearchHistory></SearchHistory>
    <SearchResult></SearchResult>
    <SearchSuggestion></SearchSuggestion> -->

</form>
<!-- 动态的根据情况显示或隐藏搜索历史，搜索记录，搜索结果 -->
<component :is="componentName" :keywords="keywords"></component>
    </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  data () {
    return {
      keywords: '',
      isShowSearchResult: false // 控制搜索结果的显示或隐藏
    }
  },
  computed: {
    componentName () {
    // 搜索历史：搜索框没有值或者是空字符串
    // 搜索结果: isShowSearchResult=true
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  // 注册自定义标签
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },

  methods: {
    // 搜索功能
    onSearch () {
      console.log('正在搜索')
      this.isShowSearchResult = true
    },
    // 点击取消
    backToPrePage () {
      this.$router.go(-1)
    },
    // 显示搜索建议
    visibleSearchSuggestion () {
    // 如果keywords没有值显示搜索历史
    // 如果keywords有值显示搜索建议
      this.isShowSearchResult = false
    }
  }
}
</script>

<style lang="less" scoped>
.search {
[role="button"] {
color: #fff;
}
}
</style>
