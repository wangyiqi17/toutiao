<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      @click="isShowUpdateName = true"
      :value="user.name"
      is-link
    />

    <van-cell
      title="性别"
      @click="isShowUpdateGender = true"
      :value="user.gender ? '女' : '男'"
      is-link
    />
    <van-cell
      title="生日"
      @click="isShowUpdateBirthday = true"
      :value="user.birthday || '1977-00-00'"
      is-link
    />

    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isShowUpdateName"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isShowUpdateName"
        v-model="user.name"
        @close="isShowUpdateName = false"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->

    <!-- 编辑性别弹层 -->
    <van-popup v-model="isShowUpdateGender" position="bottom">
      <update-gender
        v-if="isShowUpdateGender"
        v-model="user.gender"
        @close="isShowUpdateGender = false"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->

    <!-- 编辑生日弹层 -->
    <van-popup v-model="isShowUpdateBirthday" position="bottom">
      <update-birthday
        v-if="isShowUpdateBirthday"
        @close="isShowUpdateBirthday = false"
        v-model="user.birthday"
      />
    </van-popup>

    <!-- 编辑生日弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import updateName from "./components/update-name.vue";
import updateGender from "./components/update-gender.vue";
import updateBirthday from "./components/update-birthday.vue";
export default {
  name: "userProfile",
  data() {
    return {
      user: {},
      isShowUpdateName: false,
      isShowUpdateGender: false,
      isShowUpdateBirthday: false
    };
  },
  components: {
    updateName,
    updateGender,
    updateBirthday
  },

  created() {
    this.loadProfile();
  },

  methods: {
    async loadProfile() {
      try {
        const res = await getUserProfile();
        this.user = res.data.data;
      } catch (err) {
        this.$toast("获取数据失败");
      }
    }
  }
};
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
