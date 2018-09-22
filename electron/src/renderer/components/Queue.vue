<template>
  <div id="queue-container">
    <h1 id="title">
      QUEUE
    </h1>
    <i class="fa" v-bind:class="{'fa-chevron-down': !isDialogOpen, 'fa-chevron-up': isDialogOpen}" v-on:click="showSaveDialog()"></i>
    <div id="save-dialog" v-bind:class="{'active': isDialogOpen}">
        <input type="text" placeholder="Name your playlist" v-model="playlistName">
        <a v-on:click="savePlaylist()">Save</a>
    </div>
    <div id="queue">     
      <div class="item row" v-for="track in queue">
        <span id="removeTrackBtn" v-on:click="removeTrack(track)">X</span>
        <div class="small-1 columns blank">&nbsp;</div>
        <div class="small-2 columns cover">
          <img v-bind:src="track.coverUrl" />
        </div>
        <div class="small-8 columns track-details">
          <span class="track-name">
            {{track.name}}
          </span>
          <span class="track-artist">
            {{track.artist}}
          </span>
        </div>
        <div class="small-1 columns blank">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  const {app} = require('electron').remote
  import store from '@/vuex/store'
  export default {
    computed: {
      queue: function () {
        return store.state.queue
      }
    },
    data() {
      return {
        isDialogOpen: false,
        savedSuccess: false,
        playlistName: ''
      }
    },
    watch: {
      playlistName: {
        handler: function (updatedName) {
          if (this.playlistName !== updatedName) this.resetState()
        }
      }
    },
    methods: {
      removeTrack: function (track) {
        store.commit('remove', track)
      },
      showSaveDialog() {
        this.isDialogOpen = !this.isDialogOpen
      },
      savePlaylist: function () {
        const path = app.getPath("userData")
        const filePath = path + '/playlists/' + this.playlistName
        let trackPathsArray = []
        for (let track of this.queue) {
          let trackObj = {
            name: track.name,
            artist: track.artist,
            image: track.image
          }
          trackPathsArray.push(trackObj)
        }
        fs.writeFile(filePath, JSON.stringify(trackPathsArray), (err) => {
          if (!err) this.savedSuccess = true
          else throw err
        })
      },
      resetState: function () {
        this.isDialogOpen = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/colors.scss';

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

  span#removeTrackBtn {
    position: absolute;
    right: 0.5rem;
    z-index: 2;
    font-stretch: 1rem;
    color: transparent;
  }
  span#removeTrackBtn:hover {
    color: white;
    cursor: pointer;
  }


  div#queue-container {
    text-align: center;
    margin: 1rem 0;
    h1, i {
      display: inline;
      padding: 0 0.5rem;
    }
    h1#title {
      font-size: 0.85rem;
      font-weight: normal;
    }
    div#queue {
      height: 15rem;
      overflow-y: scroll;
      list-style-type: none;
      div.item {
        position: relative;
        margin: 1rem auto;
        img {
          margin: 0.3rem;
        }
        div.track-details {
          padding-left: 1rem;
          text-align: left;
          span.track-name {
            display: block;
            font-size: 0.9rem;
          }
          span.track-artist {
            display: block;
            font-size: 0.8rem;
            color: $grey;
          }
        }
      }
      div.item:hover {
        cursor: default;
        span#removeTrackBtn {
          color: white;
        }
      }
    }
  }  
  
  div#save-dialog {
    height: 0;
    overflow: hidden;
    * {
      margin: 0.5rem 0.25rem;
    }
    input {
      width: 50%;
      appearance: none;
      border: none;
      padding: 0.5rem;
      border-radius: 15rem;
      background: darken($background, 10%);
      color: white;
    }
    input:focus {
      outline: none;
    }
    a {
      padding: 0.5rem 1rem;
      border-radius: 15rem;
      background: darken($background, 10%);
      color: white;
      font-size: 0.75rem;
      cursor: pointer;
    }
    a:hover {
      background: lighten($background, 15%);
      color: white;
    }
    a#saved {
      background: white;
      color: $background;
    }
    a#saved:hover {
      background: white;
      color: $background;
      cursor: none;
    }
  }
  div.active {
    height: 3rem !important;
  }
</style>
