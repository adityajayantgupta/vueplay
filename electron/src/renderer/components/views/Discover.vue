<template>
  <div>
    <div class="row">
      <h1 class="title">
        Popular Tracks
      </h1>
      <div id="popularTracks">
        <div class="large-2 columns track" v-for="track in popularTracks" v-on:click="viewTrackDetails(track)">  
          <img class="cover" v-bind:src="track.image"></img>
          <div class="track-details">
            <span class="track-name">{{track.name}}</span>
            <span class="track-artist">{{track.artist}}</span>
          </div>     
        </div>
      </div>
    </div>
    <div class="row">
      <h1 class="title">
        Popular Artists
      </h1>
      <div id="popularArtists">
        <div class="large-2 columns artist" v-for="artist in popularArtists" v-on:click="viewArtistDetails(artist)">  
          <img class="cover" v-bind:src="artist.image[2]['#text']"></img>
          <div class="artist-details">
            <span class="artist-name">{{artist.name}}</span>
          </div>     
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as credentials from '@/assets/credentials.json'
  export default {
    name: 'Discover',
    data() {
      return {
        popularTracks: [],
        popularArtists: []
      }
    },
    beforeCreate() {
      axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&format=json&limit=5&api_key=' + credentials.apikey)
      .then (response => {
        console.log(response)
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
              this.popularTracks.push(JSON.parse(JSON.stringify(trackObj)))
            })
            .catch(e => console.log(e))
        }
      })
      .catch(e => console.log(e))

      axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopArtists&format=json&limit=5&api_key=' + credentials.apikey)
      .then (response => {
        this.popularArtists = response.data.artists.artist
      })
      .catch(e => console.log(e))
    },
    methods: {
      viewTrackDetails: function (track) {
        this.$router.push({name: 'TrackInfo', params: {trackName: track.name, trackArtist: track.artist}})
      },
      viewArtistDetails: function (artist) {
        this.$router.push({name: 'ArtistInfo', params: {artistName: artist.name}})
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

  * {
    transition: 0.2s;
  }

  h1.title {
    font-weight: 300;
  }
  div#popularTracks, div#popularArtists {
    div.track:last-child, div.artist:last-child {
      float: left;    // Foundation overwrite
    }
    div.track:hover, div.artist:hover {
      transform: translateY(-5px);
    }
    span {
      display: block;
      font-size: 1.2rem;
    }
    span.track-name, span.artist-name {
      margin: 0;
      margin-bottom: -5px;
      font-size: 1rem;
    }
    span.track-artist {
      font-size: 0.85rem;
      color: $grey;
    }
    img.cover {
      height: 8rem;
      margin: 1rem;
      margin-left: 0;
    }
  }
  div#popularArtists {
    text-align: center;
    div.artist {
      margin-right: 1rem;
    }
    img.cover {
      margin-right: 0;
      border-radius: 50%;
    }
  }
</style>