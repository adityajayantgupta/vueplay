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
      <search></search>
      <keep-alive>
        <router-view id="content" class="large-10 columns"></router-view>
      </keep-alive>
      <player></player>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import router from './router'
import store from './vuex/store'
import player from './components/Player'
import queue from './components/Queue'
import search from './components/Search'
import 'font-awesome/css/font-awesome.css'
import 'foundation.css/build/grid.css'

export default {
  name: 'app',
  components: {
    player,
    queue,
    search
  },
  computed: {
    streamUrls: function() {
      let urls = []
      for (let i in store.state.queue) {
        urls.push(store.state.queue[i].url)
      }
      return urls
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './src/renderer/assets/fonts/Roboto-Regular.ttf';
  @import './src/renderer/assets/scss/colors.scss';

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
    height: 90vh;
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
          color: $grey;
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
  div#content {
    height: 80vh;
    overflow-y: scroll;
    padding-left: 2rem;
    background-color: $background;
    color: white;
  }
</style>

