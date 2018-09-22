<template>
  <div id="queue-container">
    <h1 id="title">
      QUEUE
    </h1>
    <div id="queue">
      <div class="item row" v-for="track in queue">
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
  import store from '@/vuex/store'
  export default {
    computed: {
      queue: function() {
        return store.state.queue
      }
    }
  }
</script>

<style lang="scss" scoped>
  $background: #1F1F2E;
  $sidebar: #2D2D44;
  $inactive: #8A8A8A;

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

  div#queue-container {
    text-align: center;
    margin: 1rem 0;
    h1#title {
      font-size: 0.85rem;
      font-weight: normal;
    }
    div#queue {
      height: 15rem;
      overflow-y: scroll;
      list-style-type: none;
      div.item {
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
            color: $inactive;
          }
        }
      }
    }
  }  
</style>
