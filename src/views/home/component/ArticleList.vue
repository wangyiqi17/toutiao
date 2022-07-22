<template>
  <div>
    <van-pull-refresh
      v-model="refreshLoading"
      @refresh="loadNextPage"
      success-text="刷新成功~ ~ ~"
    >
      <van-list
        @load="loadNextPage"
        offset="1"
        :immediate-check="false"
        v-model="loading"
        :finished="isFinished"
        :error.sync="error"
        error-text="出错了，请重新加载！"
        finished-text="没有更多了~ ~ ~"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleId="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from "@/api/news";
import ArticleItem from "./ArticleItem.vue";
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticleList();
  },
  data() {
    return {
      articles: [],
      pre_timestamp: "",
      loading: false,
      isFinished: false,
      error: false,
      refreshLoading: false
    };
  },
  components: {
    ArticleItem
  },
  methods: {
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date());
        // 保存第一次的页码
        this.pre_timestamp = data.data.pre_timestamp;
        this.articles = data.data.results;
        // console.log(this.articles)
      } catch (error) {
        // 获取状态码
        const status = error.response.status;
        if (status === 400) {
          throw new Error(error.response.data.message);
        } else {
          this.$toast.fail("获取文章列表失败，请重新刷新");
        }
      }
    },
    // 加载下一页频道数据
    async loadNextPage() {
      try {
        // if (Math.random() < 0.7) {
        //   throw new Error('错误了')
        // }
        const { data } = await getArticleList(this.id, this.pre_timestamp);
        if (!data.data.pre_timestamp) {
          this.isFinished = true;
        }
        // 将第n页的数据，放在 articles
        if (this.refreshLoading) {
          this.articles.unshift(...data.data.results);
        } else {
          this.articles.push(...data.data.results);
        }
        // 更新页数
        this.pre_timestamp = data.data.pre_timestamp;
        // loading设置为false
        this.loading = false;
      } catch (error) {
        this.error = true;
      } finally {
        this.loading = false;
        this.refreshLoading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
