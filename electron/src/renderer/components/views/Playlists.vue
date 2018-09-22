<template>
  <div>
    <div id="playlistBrowser">
      <div class="large-3 columns">
        <div id="playlists">
            <li v-for="playlist of playlists" v-on:click="readPlaylist(playlist)">
            <i class="fa fa-list"></i>
            <span>
              {{playlist.name}}
            </span>
          </li>
          </div>        
        </div>
    </div>
    <div class="large-9 columns">
      <div id="playlistView">
        <li v-for="track of tracks">
          <img v-bind:src="track.coverUrl">
          <span>
            {{track.name}}
          </span>
          <br>
          <span>
            {{track.artist}}
          </span>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
  const {app} = require('electron').remote
  const Path = require('path')
  import fs from 'fs'

  export default {
    name: 'Playlists',
    data() {
      return {
        playlists: [],
        trackPaths: [],
        tracks: []
      }
    },
    methods: {
      readFolder: function (path) {
        this.playlists = []
        fs.readdir(path, (err, playlists) => {
          if (err) throw err
          for (let playlist of playlists) {
            let playlistObj = {path: '', name: ''}          
            playlistObj.name = playlist
            playlistObj.path = Path.join(path, playlist),  
            this.playlists.push(playlistObj) 
            console.log(this.playlists)      
          }
        })
      },
      readPlaylist: function (playlist) {
        this.trackPaths = fs.readFileSync(playlist.path, 'utf8')
        for (let path of this.trackPaths) {
          // Read name, artist, image from list and convert path to data/mp3 via /modules/addSong
        }
      }
    },
    mounted() {
      this.readFolder(app.getPath('userData') + '/playlists/')
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../assets/scss/colors.scss';
  div#playlists {
    h1 {
      font-size: 1.5rem;
    }
    a {
      padding: 1rem;
      display: block;
      * {
        margin-right: 1rem;
      }
      transition: 0.1s;
    }
    a:hover {
      background: $sidebar;
    }
  }
  div#playlistBrowser {
    li {
      padding: 0.5rem;
      list-style-type: none;
      transition: 0.1s;
      * {
        margin-right: 1rem;
      }
      i {
        color: lighten($sidebar, 10%);
      }
      span {
        cursor: pointer;
      }
      span#actions {
        float: right;
      }
    }
    li:hover {
      background: $sidebar;
    }
  }
</style>
