import Vue from "vue";
import Vuex from "vuex";
import { getToken, setToken } from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // number: 0
    // user: JSON.parse(localStorage.getItem('HEIMA_TOUTIAO_TOKEN')) || {}
    // user: storage.get('HEIMA_TOUTIAO_TOKEN')
    user: getToken() || {}
  },
  mutations: {
    // setNumber (state, payload) {
    //   console.log(payload)
    //   state.number++
    // }
    setUser(state, payload) {
      state.user = payload;
      // localStorage.setItem('HEIMA_TOUTIAO_TOKEN', JSON.stringify(payload))
      // storage.set('HEIMA_TOUTIAO_TOKEN', payload)
      setToken(payload);
    }
  },
  actions: {},
  modules: {}
});
