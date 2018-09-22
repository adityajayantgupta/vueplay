<template>
  <div>
    <div class="row">
      <h1 class="title">
        Song
      </h1>
      <div id="songs">
        <div class="large-2 columns song" v-for="song in songs">  
          <img class="cover" v-bind:src="song.image">
          <div class="song-details">
            <span class="song-name">{{song.name}}</span>
          </div>     
        </div>
      </div>      
    </div>
    <div id="more" class="row"><a class="btn" v-on:click="loadFurther()">MORE</a></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as credentials from '@/assets/credentials.json' 
  export default {
    name: 'Songs',
    data() {
      return {
        songs: [],
        pageCount: 1
      }
    },
    methods: {
      loadFurther: function () {
        this.pageCount++
        axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&format=json&page=' + this.pageCount + '&api_key=' + credentials.apikey)
        .then (response => {
          for (let i in response.data.tracks.track) {
            let _song = response.data.tracks.track[i]
            console.log(_song)
            this.songs.push(_song)
          }
        })
        .catch(e => console.log(e))        
        console.log(this.songs)
      }
    },
    beforeCreate() {
      axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&format=json&api_key=' + credentials.apikey)
      .then (response => {
        let matches = response.data.tracks.track
        let trackObj = {name: '', artist: '', image: ''}
        for (let j = 0; j < matches.length; j++) {
          axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&format=json&api_key=${credentials.apikey}&artist=${matches[j].artist.name}&track=${matches[j].name}`)                
            .then (response => {
              console.log(response)
              let responseInfo = response.data.track
              trackObj.name = responseInfo.name
              trackObj.artist = responseInfo.artist.name
              trackObj.image = responseInfo.album.image[2]['#text']
              this.songs.push(JSON.parse(JSON.stringify(trackObj)))
            })
            .catch(e => console.log(e))
        }
      })
      .catch(e => console.log(e))
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/colors.scss';

  .row, .columns {
    margin: 0;
    padding: 1rem 0;
  }

  * {
    transition: 0.2s;
  }

  h1.title {
    font-weight: 300;
  }
  div#songs {
    div.song:last-child {
      float: left;    // Foundation overwrite
    }
    div.song {
      overflow-y: hidden
    }
     div.song:hover {
      transform: translateY(-5px);
    }
    span {
      display: block;
      font-size: 1.2rem;
    }
    span.song-name {
      margin: 0;
      margin-bottom: -5px;
      font-size: 1rem;
      word-wrap: wrap;
    }
    img.cover {
      height: 8rem;
      margin: 1rem;
      margin-left: 0;
    }
  }
  div#songs {
    text-align: center;
    img.cover {
      margin-right: 0;
      border-radius: 50%;
    }
  }
  div#more {
    text-align: center;
    a {
      display: inline-block;
      padding: 0.5rem 1rem;
      border: 1px solid;
      border-radius: 5rem;
      background-color: $background;
      color: white;
    }
    a:hover {
      background-color: white;
      color: $background;
    }
  }
</style>