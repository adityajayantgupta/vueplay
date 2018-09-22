<template>
  <div class="container">
    <div class="row" id="tracks">
      <h1 class="category-title">
        SONGS
      </h1>
      <ul class="results">
        <div class="result" v-for="track in tracks">
          <div class="row result-item" v-on:click="getStream(track.name, track.artist, track.image[0]['#text'])">
            <div class="large-1 columns">
              <img class="cover" v-bind:src="track.image[2]['#text']">
            </div>
            <div class="large-11 columns">
              <div class="details">
                <div class="name">{{track.name}}</div>
                <div class="artist">{{track.artist}}</div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
    <div class="row" id="albums">
      <h1 class="category-title">
        ALBUMS
      </h1>
      <ul class="results">
        <div class="result" v-for="album in albums">
          <div class="row result-item">
            <div class="large-1 columns">
              <img class="cover" v-bind:src="album.image[1]['#text']">
            </div>
            <div class="large-11 columns">
              <div class="details">
                <div class="name">{{album.name}}</div>
                <div class="artist">{{album.artist}}</div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
    <div class="row" id="artists">
      <h1 class="category-title">
        ARTISTS
      </h1>
      <ul class="results">
        <div class="result" v-for="artist in artists">
          <div class="row result-item">
            <div class="large-1 columns">
              <img class="cover" v-bind:src="artist.image[1]['#text']">
            </div>
            <div class="large-11 columns">
              <div class="details">
                <div class="name">{{artist.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import router from '@/router'
  import axios from 'axios'
  import store from '@/vuex/store'
  import * as ytSearch from 'youtube-search'
  import credentials from '@/assets/credentials.json'
  export default {
    name: 'Search',
    props: {
      searchString: {
        type: String
      }
    },
    data() {
      return {
        tracks: [],
        albums: [],
        artists: [],
        params: ['track', 'album', 'artist']
      }
    },
    watch: {
      '$route.params.searchString': function (id) {
        this.search()
      }
    },
    created() {
      this.search()
    },
    methods: {
      search: function() {
        let string = this.searchString
        let params = this.params
        for (let i in params) {
          axios.get(`http://ws.audioscrobbler.com/2.0/?method=${params[i]}.search&format=json&limit=10&api_key=${credentials.apikey}&${params[i]}=${string}`)
          .then (response => {
            this[params[i] + 's'] = response.data.results[params[i] + 'matches'][params[i]]
          })
          .catch(e => console.log(e))
        }
        /* SAME AS - 
        axios.get('http://ws.audioscrobbler.com/2.0/?method=track.search&format=json&limit=5&api_key=' + credentials.apikey + '&track=' + string)
        .then (response => {
          this.tracks = response.data.results.trackmatches.track.artist
        })
        .catch(e => console.log(e))
        */
      },
      getStream: function(trackName, trackArtist, trackCoverUrl) {
        let streamUrl = ''
        let trackObj = {
          url: '',
          name: '',
          artist: '',
          coverUrl: ''
        }
        let currentqueue = []
        let doesAlreadyExist = false
        const opts = {
          maxResults: 1,
          key: credentials.ytApiKey
        };
        ytSearch(trackName, opts, function(err, res) {
          if (err) {
            console.log(err)
          }
          /*
          try {
            youtubeStream(requestUrl).pipe('/sound.mp3')
          } catch (exception) {
            console.log(exception)
          }
          var authOptions = {
            method: 'POST',
            url: 'https://savedeo.p.mashape.com/download',
            data: 'url=https://www.youtube.com/watch?v=' + res[0].id,
            headers: {
              'X-Mashape-Key': 'bXMBiVwkfMmshtne9Cg7BLknM5kYp1HpFsFjsnGTLISbXYLDF3',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            json: true
          };
          axios(authOptions).then(result => {
            for (let i in result.body.formats) {
              let streamObj = result.body.formats[i]
              if (result.body.formats[i].format_id === '251') {
                streamUrl = streamObj.url
                break
              }
            }
          })
          */
          let streamUrl = 'http://youtube.com/watch?v=' + res[0].id
          trackObj.url = streamUrl
          trackObj.name = trackName
          trackObj.artist = trackArtist
          trackObj.coverUrl = trackCoverUrl

          currentqueue = store.state.queue
          if (currentqueue.length > 0) {
            for (let i in currentqueue) {
              if (streamUrl === currentqueue[i].url) { 
                doesAlreadyExist = true
                break               
              }
            }
          }          
          if (!doesAlreadyExist) {
            store.commit('push', trackObj)
            console.log(store.state.queue)
          } else {
            console.log('Already Exists')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $background: #1F1F2E;
  $grey: #8A8A8A;
  .row, .columns {
    margin: 0;
    padding: 0;
  }
  .row {
    max-width: auto;
  }
  * {
    transition: 0.2s;
  }
  ul.results {
    padding-left: 0rem;
  }
  div.result-item {
    padding: 1rem;
  }
  div.result-item:hover {
    background-color: lighten($background, 10%);
  }
  h1.category-title {
    font-weight: 300;
  }
  div.details {
    padding-left: 1rem;
    div.artist {
      font-size: 0.85rem;
      color: $grey;
    }
  }
</style>