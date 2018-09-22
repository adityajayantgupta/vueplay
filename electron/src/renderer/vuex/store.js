import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queue: []
  },
  mutations: {
    push: (state, track) => {
      state.queue.push(track)
    },
    remove: (state, track) => {
      let index = state.queue.indexOf(track)
      state.queue.splice(index, 1)
    },
    overwrite: (state, track) => {
      state.queue = []
      state.queue.push(track)
    },
    shuffle: (state) => {
      let array = state.queue
      let counter = array.length
      while (counter > 0) {
        let index = Math.floor(Math.random() * counter)
        counter--
        let temp = array[counter]
        array[counter] = array[index]
        array[index] = temp
      }
      state.queue = array
    }
  }
})
