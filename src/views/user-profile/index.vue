<template>
  <div class="user-profile">
    <input type="file" hidden ref="file" @change="inputChange" />
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
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

    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        @update-photo="user.photo = $event"
        @close="isUpdatePhotoShow = false"
        :img="img"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import updateName from "./components/update-name.vue";
import updateGender from "./components/update-gender.vue";
import updateBirthday from "./components/update-birthday.vue";
import updatePhoto from "./components/update-photo.vue";
export default {
  name: "userProfile",
  data() {
    return {
      user: {},
      isShowUpdateName: false,
      isShowUpdateGender: false,
      isShowUpdateBirthday: false,
      isUpdatePhotoShow: false
    };
  },
  components: {
    updateName,
    updateGender,
    updateBirthday,
    updatePhoto
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
    },
    inputChange() {
      // 获取上传文件
      const file = this.$refs.file.files[0];
      this.img = window.URL.createObjectURL(file);
      this.isUpdatePhotoShow = true;
      // 同一张图片，change事件不会触发
      this.$refs.file.value = "";
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
