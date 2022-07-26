<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
    >
      <van-cell
        class="comment-item"
        @load="onLoad"
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @click-reply="onReplyShow"
      >
        <van-image
          slot="icon"
          class="avatar"
          round
          fit="cover"
          :src="comment.aut_photo"
        />
        <div slot="title" class="title-wrap">
          <div class="user-name">{{ comment.aut_name }}</div>
          <van-button
            class="like-btn"
            :class="{ liked: comment.is_liking }"
            :loading="commentLoading"
            :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
            @click="onCommentLike"
            >{{ comment.like_count || "赞" }}</van-button
          >
        </div>

        <div slot="label">
          <p class="comment-content">{{ comment.content }}</p>
          <div class="bottom-info">
            <span class="comment-pubdate">{{ comment.pubdate }}</span>
            <button @click-reply="onReplyShow">
              回复 {{ comment.reply_count }}
            </button>
          </div>
        </div>
      </van-cell>

      <van-popup v-model="isReplyShow" position="bottom" style="height: 80%">
        <CommentReply
          @click-close="isReplyShow = false"
          :comment="currentComment"
        ></CommentReply>
      </van-popup>
    </van-list>
    <!-- 评论列表 -->
    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field v-model="inputComment" clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info" @click="onAddComment"
          >发布</van-button
        >
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments, addCommentLike, deleteCommentLike } from "@/api/comment";
// import CommentItem from "./CommentItem.vue";
import CommentReply from "./CommentReply.vue";

export default {
  name: "ArticleComment",
  components: {
    // CommentItem,
    CommentReply
  },
  props: {
    source: {
      type: [Number, String, Object],
      require: true
    },
    comment: {
      type: Object,
      required: true
    },

    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a"
    }
  },
  data() {
    return {
      //   list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      limit: 10,
      inputComment: "",
      message: "",
      currentComment: {},
      commentLoading: false,
      isReplyShow: false
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      try {
        const { data } = await getComments({
          type: "a", // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 每页大小
        });

        console.log(data);

        // 2. 将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);

        // 更新总数据条数
        this.totalCount = data.data.total_count;

        // 3. 将加载更多的 loading 设置为 false
        this.loading = false;

        // 4. 判断是否还有数据
        if (results.length) {
          this.offset = data.data.last_id; // 更新获取下一页数据的页码
        } else {
          this.finished = true; // 没有数据了，关闭加载更多
        }
        this.$emit("onload-success", data.data);
      } catch (error) {
        console.log(error);
      }
    },
    onReplyShow(comment) {
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = comment; // 展示评论回复弹层
      this.isReplyShow = true;
      console.log(this.currentComment);
    },
    async onCommentLike() {
      this.commentLoading = true;
      try {
        // 如果已经赞了则取消点赞
        if (this.comment.is_liking) {
          await deleteCommentLike(this.comment.com_id);
          this.comment.like_count--;
        } else {
          // 如果没有赞，则点赞
          await addCommentLike(this.comment.com_id);
          this.comment.like_count++;
        }
        // 更新视图状态
        this.comment.is_liking = !this.comment.is_liking;
        this.$toast("操作成功");
      } catch (err) {
        console.log(err);
        this.$toast("失败");
      }
      this.commentLoading = false;
    }
    // huifu() {
    //   console.log(111);
    //   this.isReplyShow = true;
    // }
  }
};
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: red;
    }
  }
}
</style>
