<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate }}
          </div>
          <!-- <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            v-if="article.is_followed"
            loading:followLoading
            >关注</van-button
          >
          <van-button
            class="follow-btn"
            round
            size="small"
            v-else
            loading:followLoading
            >已关注</van-button
          > -->
          <follow-user
            v-model="article.is_followed"
            :user_id="article.aut_id"
          />
        </van-cell>
        <!-- @update-follow="article.is_followed = $event"
        :is_followed="article.is_followed" -->

        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" info="123" color="#777" />
          <collect-article
            :article-id="article.art_id"
            v-model="article.is_collected"
          />

          <likeArticle
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArtcileInfo" class="retry-btn"
          >点击重试</van-button
        >
      </div>

      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById, getArticleInfo } from "@/api/article";
// import { ImagePreview } from "vant";
// import { addFollow, deleteFollow } from "@/api/user";
import FollowUser from "./component/FollowUser.vue";
import CollectArticle from "./component/CollectArticle.vue";
import likeArticle from "./component/likeArticle.vue";

export default {
  name: "ArticlePage",
  components: {
    FollowUser,
    CollectArticle,
    likeArticle
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情
      isLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticleInfo();
  },
  mounted() {},
  methods: {
    // previewImg() {
    //   const contentEl = this.$refs.contentRef;
    //   const allImg = contentEl.querySelectorAll("img");
    //   console.log(allImg);
    //   const images = [];
    //   allImg.forEach((element, index) => {
    //     images.push(element.src);
    //     element.onclick = () => {
    //       ImagePreview({
    //         images,
    //         startPosition: index
    //       });
    //     };
    //   });
    // },
    async loadArticleInfo() {
      this.isLoading = true;
      try {
        // 随机错误
        // thorw Error()
        const { data } = await getArticleInfo(this.articleId);
        this.article = data.data;
        // setTimeout(() => {
        //   this.previewImg();
        // }, 10);
      } catch (err) {
        // 加载失败 404
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        this.$toast("获取失败");
      }
      // 加载完成
      this.isLoading = false;
    },
    async loadArticle() {
      try {
        const { data } = await getArticleById(this.articleId);
        this.article = data.data;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    // async onFollow() {
    //   this.followLoading = true;
    //   // 开启按钮的 loading 状态
    //   this.isFollowLoading = true;

    //   try {
    //     // 如果已关注，则取消关注
    //     const authorId = this.article.aut_id;
    //     if (this.article.is_followed) {
    //       await deleteFollow(authorId);
    //     } else {
    //       // 否则添加关注
    //       await addFollow(authorId);
    //     }

    //     // 更新视图
    //     this.article.is_followed = !this.article.is_followed;
    //   } catch (err) {
    //     console.log(err);
    //     this.$toast.fail("操作失败");
    //   }

    //   // 关闭按钮的 loading 状态
    //   this.isFollowLoading = false;
    //   this.followLoading = false;
    // }
  }
};
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
