/**
 * 用户相关请求模块
 */
import request from "@/utils/request";
import store from "@/store";

export const login = (data) => {
  return request({
    method: "POST",
    url: "/v1_0/authorizations",
    data
  });
};

export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  });
};

export const getUserInfo = () => {
  return request({
    url: "/v1_0/user",
    headers: {
      Authorization: `Bearer ${store.state.user.token}`
    }
  });
};

/**
 * 添加关注
 */
export const addFollow = (userId) => {
  return request({
    method: "POST",
    url: "/v1_0/user/followings",
    data: {
      target: userId
    }
  });
};

/**
 * 取消关注
 */
export const deleteFollow = (userId) => {
  return request({
    method: "DELETE",
    url: `/v1_0/user/followings/${userId}`
  });
};
