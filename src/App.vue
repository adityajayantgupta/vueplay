<template>
  <div id="app">
    <main>
      <div id="sidebar" class="large-2 columns">
        <div class="row">
          <ul id="links">
            <li>
              <router-link to="/"><i class="fa fa-globe"></i>DISCOVER</router-link>
            </li>
            <li>
              <router-link to="/Artists"><i class="fa fa-users"></i>ARTISTS</router-link>
            </li>
            <li>
              <router-link to="/Songs"><i class="fa fa-music"></i>SONGS</router-link>
            </li>
            <li>
              <router-link to="/Playlists"><i class="fa fa-list"></i>PLAYLISTS</router-link>
            </li>
            <li>
              <router-link to="/Offline"><i class="fa fa-desktop"></i>OFFLINE</router-link>
            </li>
          </ul>
        </div>
        <div class="row">
          <queue></queue>
        </div>
      </div>
      <div id="search">
        <input id="searchInput" type="text" placeholder="Search" v-model="searchString" v-on:keyup.enter="initSearch()"/><span id="searchBtnContainer">
          <a id="searchBtn">
            <i class="fa fa-search"></i>
          </a>
        </span>
      </div>
      <keep-alive>
        <router-view id="content" class="large-10 columns"></router-view>
      </keep-alive>
      
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import queue from './components/Queue'
import 'font-awesome/css/font-awesome.css'
import 'foundation.css/build/grid.css'
import colors from '@/assets/colors.json'

export default {
  name: "app",
  components: {
    queue
  },
  data() {
    return {
      searchString: ''
    }
  },
  computed: {
    queue: function () {
      return store.state.queue
    },
    streamUrls: function() {
      let urls = []
      for (let i in store.state.queue) {
        urls.push(store.state.queue[i].url)
      }
      return urls
    }
  },
  methods: {
    initSearch: function() {
      if (this.searchString) {
        this.$router.push({name: 'Search', params: {searchString: this.searchString}})
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './src/assets/fonts/Roboto-Regular.ttf';
  $background: #1F1F2E;
  $sidebar: #2D2D44;
  $inactive: #8A8A8A;

  .row, .columns {
    margin: 0;
    padding: 0;
  }

  * {
    transition: 0.2s;
  }

  h1, p, div, {
    font-family: 'Roboto', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: lighten($background, 10%);
    border-radius: 5rem;
  }

  div#app {
    background-color: $background;
    background-repeat: repeat-y;
  }

  div#sidebar { 
    height: 100vh;
    padding-top: 4rem;
    background-color: $sidebar;
    color: white;
    ul#links {
      list-style-type: none;
      li {
        margin: 1rem -1rem;
        a {
          text-decoration: none;
          font-size: 0.85rem;
          letter-spacing: 2px;
          i {
            margin-right: 1rem;
          }
        }
        a, a:visited {
          outline: none;
          color: $inactive;
        }
        a:hover, a:active {
          outline: none;
          color: white;
        }
       
      }
      li.router-link-exact-active {
        color: white;
      }
    }  
  }
  div#search {
    padding: 1rem;
    margin-left: 18%;
    width: 60vw;
    background: transparent;
  }
  input#searchInput {
    width: 90%;
    padding: 0.75rem;
    padding-left: 1rem;
    border: 1px solid transparent;
    border-top-left-radius: 5rem;
    border-bottom-left-radius: 5rem;
    background-color: lighten($background, 10%);
    color: white;
  }
  input#searchInput:focus {
    outline: none;
  }
  span#searchBtnContainer {
    padding: 0.75rem;
    padding-right: 1rem;
    background-color: lighten($background, 10%);
    color: white;
    border-top-right-radius: 5rem;
    border-bottom-right-radius: 5rem;
    vertical-align: middle;
  }
  div#content {
    height: 80vh;
    overflow-y: scroll;
    margin: 1rem 0;
    padding-left: 2rem;
    background-color: $background;
    color: white;
  }
</style>

