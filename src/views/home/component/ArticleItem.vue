<template>
  <div>
    <!-- 渲染无图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 0"
      :title="articleInfo.title"
      :label="articleDesc"
      :to="`article/${articleInfo.art_id}`"
    >
    </van-cell>
    <!-- 渲染 1 图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 1"
      :title="articleInfo.title"
      :label="articleDesc"
      :to="`article/${articleInfo.art_id}`"
    >
      <van-image
        width="3rem"
        height="2rem"
        :src="articleInfo.cover.images[0]"
      ></van-image>
    </van-cell>
    <!-- 渲染 3 图片 -->
    <van-cell
      v-if="articleInfo.cover.type === 3"
      :title="articleInfo.title"
      :to="`article/${articleInfo.art_id}`"
    >
      <template #label>
        <div>
          <van-image
            v-for="(item, index) in articleInfo.cover.images"
            :key="index"
            width="3rem"
            height="2rem"
            :src="item"
          ></van-image>
        </div>
        <span>{{ articleDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from "@/utils/dayjs";
export default {
  name: "artitem",
  props: {
    articleInfo: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    articleDesc() {
      const art = this.articleInfo;
      const times = dayjs(art.pubdate).fromNow();
      return `${art.aut_name} ${art.comm_count}评论 ${times}`;
    }
  }
};
</script>

<style lang="less" scoped></style>
