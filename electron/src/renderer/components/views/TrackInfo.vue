<template>
  <div class="container">
    <div class="row">
      <div class="large-4 columns">
        <img v-bind:src="trackInfo.album.image[3]['#text']" alt="Album Cover">
      </div>
      <div id="track-info-wrapper" class="large-8 columns">
        <h1 id="track-name">{{trackInfo.name}}</h1>
        <div id="track-artist-album">
          <a id="track-artist">{{trackInfo.artist.name}}</a> | <a id="track-album">{{trackInfo.album.title}}</a>
        </div>
        <div id="actions">
          <a class="large-4 columns">
            <i class="fa fa-plus"></i>
          </a>
          <a class="large-4 columns">
            <i class="fa fa-play"></i>
          </a>
          <a class="large-4 columns">
            <i class="fa fa-arrow-down"></i>
          </a>
        </div>
      </div>
    </div>
    <div id="track-wiki-wrapper" class="row">
      <div id="wiki">{{trackInfo.wiki.summary}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  import * as credentials from '@/assets/credentials.json' 
  export default {
    name: 'TrackInfo',
    props: {
      trackName: {
        type: String
      },
      trackArtist: {
        type: String
      }
    },
    data() {
      return {
        trackInfo: [],
        trackObj: {
          url: '',
          name: '',
          artist: '',
          coverUrl: '',
        }
      }
    },
    watch: {
      '$route.params.trackName': function (id) {
        this.fetchTrackInfo()
      }
    },
    methods: {
      fetchTrackInfo: function () {
        axios.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&format=json&track=' + this.trackName + '&artist=' + this.trackArtist + '&api_key=' + credentials.apikey)
        .then (response => {
          console.log(response)
          this.trackInfo = response.data.track  
          let wiki = this.trackInfo.wiki.summary.split('<')  
          wiki.splice(wiki.length-2, 2)
          this.trackInfo.wiki.summary = wiki[0]
        })
      }
    },
    mounted() {
      this.fetchTrackInfo()
    }
  }
</script>

<style lang="scss" scoped>
  div.container {
    padding: 2rem;
  }
  div#track-info-wrapper {
    width: 25%;
    float: left;
    h1#track-name {
      margin-bottom: 0;
    }
    div#actions {
      margin: 1rem auto;
    }
  }
  div#track-wiki-wrapper {
    padding: 2rem 1rem;
  }
</style>
