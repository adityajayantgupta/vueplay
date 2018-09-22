<template>
  <div class="container">
    <div class="row" id="tracks">
      <h1 class="category-title">
        SONGS
      </h1>
      <ul class="results">
        <div class="result" v-for="track in tracks">
          <div class="row result-item" v-on:click="pushToQueue(track.name, track.artist, track.image)">
            <div class="large-1 columns">
              <img class="cover" v-bind:src="track.image">
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
              <img class="cover" v-bind:src="album.image">
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
              <img class="cover" v-bind:src="artist.image">
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
  import axios from 'axios'
  import * as ytSearch from 'youtube-search'
  import router from '@/router'
  import store from '@/vuex/store'
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
    computed: {
      queue: function () {
        return store.state.queue
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
      search: function () {
        /* Clear stored values and initialize */
        this.tracks = []
        this.albums = []
        this.artists = []
        let string = this.searchString
        let params = this.params
        let trackObj = {name: '', artist: '', image: ''}
        let albumObj = {name: '', artist: '', image: ''}
        let artistObj = {name: '', image: ''}
        for (let i = 0; i < params.length; i++) {
          axios.get(`http://ws.audioscrobbler.com/2.0/?method=${params[i]}.search&format=json&limit=10&api_key=${credentials.apikey}&${params[i]}=${string}`)
          .then (response => {
            let matches = response.data.results[params[i] + 'matches'][params[i]]
            if (params[i] !== 'artist') {
              for (let j = 0; j < matches.length; j++) {
                axios.get(`http://ws.audioscrobbler.com/2.0/?method=${params[i]}.getInfo&format=json&api_key=${credentials.apikey}&artist=${matches[j].artist}&${params[i]}=${matches[j].name}`)                
                  .then (response => {
                    if (params[i] === 'track') {
                      let responseInfo = response.data.track
                      trackObj.name = responseInfo.name
                      trackObj.artist = responseInfo.artist.name
                      trackObj.image = responseInfo.album.image[1]['#text']
                      this.tracks.push(JSON.parse(JSON.stringify(trackObj)))
                      
                    } else if (params[i] === 'album') {
                      let responseInfo = response.data.album
                      albumObj.name = responseInfo.name
                      albumObj.artist = responseInfo.artist.name
                      albumObj.image = responseInfo.image[1]['#text']
                      this.albums.push(JSON.parse(JSON.stringify(albumObj)))
                    }
                  })
                  .catch(e => console.log(e)) 
              }
            } else if (params[i] === 'artist') {
              for (let j = 0; j < matches.length; j++) {
                artistObj.name = matches[j].name
                artistObj.image = matches[j].image[1]['#text']
                this.artists.push(JSON.parse(JSON.stringify(artistObj)))
              }
            }
          })
          .catch(e => console.log(e))
        }
      },
      pushToQueue: function (trackName, trackArtist, trackCoverUrl) {
        let streamUrl = ''
        let trackObj = {
          url: '',
          name: '',
          artist: '',
          coverUrl: ''
        }
        let doesTrackAlreadyExist = false
        const opts = {
          maxResults: 1,
          key: credentials.ytApiKey
        };
        ytSearch(trackName, opts, (err, res) => {
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
          if (this.queue.length > 0) {
            for (let i in this.queue) {
              if (streamUrl === this.queue[i].url) { 
                doesTrackAlreadyExist = true
                break               
              }
            }
          }          
          if (!doesTrackAlreadyExist) {
            store.commit('push', trackObj)
          } else {
            console.log('Already Exists')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>  
  @import '../../assets/scss/colors.scss';
  
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