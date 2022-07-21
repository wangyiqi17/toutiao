<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '99.8%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道 -->
      <div class="my-channel">
        <!-- 频道标题 -->
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="edit-btn"
            @click="isEdit = !isEdit"
          >
            {{ isEdit ? "完成" : "编辑" }}
          </van-button>
        </van-cell>
        <!-- 我的频道 -->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="(item, index) in myChannels"
            :key="item.id"
            :text="item.name"
            :class="{ 'active-channel': item.name === '推荐' }"
            @click="onCliickMyChannel(item, index)"
          >
            <template #icon>
              <van-icon v-show="isEdit && item.name !== '推荐'" name="cross" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->
      <div class="recommend-channel">
        <!-- 推荐频道的标题 -->
        <van-cell title="推荐频道"></van-cell>
        <!-- 推荐频道 -->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from "@/api/channels";
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created() {
    this.getAllChannels();
  },
  data() {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    };
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    onCliickMyChannel(channel, index) {
      // 边缘情况的判断
      if (this.isEdit && channel.name !== "推荐") {
        // 删除
        this.$emit("del-mychannel", channel.id);
      }
      if (!this.isEdit) {
        // 切换
        this.isShow = false; // 关闭弹框

        this.$emit("change-active", index);
      }
    },
    addMyChannel(myChannel) {
      this.$emit("add-my-channel", { ...myChannel });
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((item) => {
        return !this.myChannels.find((i) => i.id === item.id);
        // const result = this.myChannels.find((i) => i.id === item.id)
        // if (result) {
        //   return false
        // } else {
        //   return true
        // }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.active-channel {
  :deep(.van-grid-item__text) {
    color: red;
  }
}
.popupMain {
  padding-top: 100px;
  // 按钮样式
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 00.02667rem solid red;
  }
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          width: 0.35rem;
          height: 0.35rem;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.32rem;
          &::before {
            font-size: 14px;
            transform: translate(0, -30%);
          }
        }
      }
    }
  }
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
