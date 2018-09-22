<template>
  <div class="container">
    <div class="row">
      <div class="large-4 columns">
        <img v-bind:src="artistInfo.image[3]['#text']" alt="Artist Cover Image">
      </div>
      <div id="artist-info-wrapper" class="large-8 columns">
        <h1 id="artist-name">{{artistInfo.name}}</h1>
        <div id="actions">
          <a class="large-4 columns">
            <i class="fa fa-plus"></i>
          </a>
          <a class="large-4 columns">
            <i class="fa fa-play"></i>
          </a>
        </div>
        <div id="tags" class="large-12 columns">
          <a class="tag large-2 columns" v-for="tag of tagArray">
            <span>
              {{tag.name}}
            </span>            
          </a>
        </div>
      </div>
    </div>
    <div id="artist-bio-wrapper" class="row">
      <div id="bio">{{artistInfo.bio.summary}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  import * as credentials from '@/assets/credentials.json' 
  export default {
    name: 'ArtistInfo',
    props: {
      artistName: {
        type: String
      }
    },
    data() {
      return {
        artistInfo: {},
        tagArray: []
      }
    },
    watch: {
      '$route.params.artistName': function (id) {
        this.fetchArtistInfo()
      }
    },
    methods: {
      fetchArtistInfo: function () {
        axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&format=json&artist=' + this.artistName + '&api_key=' + credentials.apikey)
        .then (response => {
          console.log(response)
          this.artistInfo = response.data.artist  
          let bio = this.artistInfo.bio.summary.split('<')  
          bio.splice(bio.length-2, 2)
          this.artistInfo.bio.summary = bio[0]
          this.tagArray = this.artistInfo.tags.tag
        })
      }
    },
    mounted() {
      this.fetchArtistInfo()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/colors.scss';
  div.container {
    padding: 2rem;
  }
  div#artist-info-wrapper {
    width: 25%;
    float: left;
    h1#artist-name {
      margin-bottom: 0;
    }
    div#actions {
      margin: 1rem auto;
    }
    div#tags {
      a {
        background: lighten($background, 5%);
      }
    }
  }
  div#artist-bio-wrapper {
    padding: 2rem 1rem;
  }
</style>
