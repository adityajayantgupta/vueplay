import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queue: []
  },
  mutations: {
    push: (state, url) => state.queue.push(url),
    remove: (state, url) => {
      let index = state.queue.indexOf(url)
      state.queue.splice(index, 1)
    }
  }
})
