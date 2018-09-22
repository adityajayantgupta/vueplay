<template>
  <div>
    <div class="row">
      <h1 class="title">
        Artists
      </h1>
      <div id="artists">
        <div class="large-2 columns artist" v-for="artist in artists">  
          <img class="cover" v-bind:src="artist.image[2]['#text']"></img>
          <div class="artist-details">
            <span class="artist-name">{{artist.name}}</span>
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
    name: 'Discover',
    data() {
      return {
        artists: [],
        pageCount: 1
      }
    },
    methods: {
      loadFurther: function () {
        this.pageCount++
        axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopartists&format=json&page=' + this.pageCount + '&api_key=' + credentials.apikey)
        .then (response => {
          for (let i in response.data.artists.artist) {
            let _artist = response.data.artists.artist[i]
            console.log(_artist)
            this.artists.push(_artist)
          }
        })
        .catch(e => console.log(e))        
        console.log(this.artists)
      }
    },
    beforeCreate() {
      axios.get('http://ws.audioscrobbler.com/2.0/?method=chart.getTopartists&format=json&api_key=' + credentials.apikey)
      .then (response => {
        this.artists = response.data.artists.artist
      })
      .catch(e => console.log(e))
    }
  }
</script>

<style lang="scss" scoped>
  $background: #1F1F2E;
  $grey: #8A8A8A;

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
  div#artists {
    div.artist:last-child {
      float: left;    // Foundation overwrite
    }
    div.artist {
      overflow-y: hidden
    }
     div.artist:hover {
      transform: translateY(-5px);
    }
    span {
      display: block;
      font-size: 1.2rem;
    }
    span.artist-name {
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
  div#artists {
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