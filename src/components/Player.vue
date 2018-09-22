<template>
  <div id="container">
    <div class="large-3 columns">
      <div class="small-4 columns">
        <img src="" class="cover">
      </div>
      <div class="small-8 columns">
        <span class="track-name"></span><span class="track-artist"></span>
      </div>
    </div>
    <div class="large-4 columns">
      <div id="playerControls">   
        <a v-on:click="play()">Play</a>
        <a v-on:click="pause()">Pause</a>
      </div>
    </div>
    <div class="large-3 columns"></div>
    <div class="large-2 columns"></div>
  </div>
</template>

<script>/*
  import Howler from 'howler'
  import youtubeStream from 'youtube-audio-stream'

  export default {
    computed: {
      queue: function() {
        return store.state.queue
      }
    },
    methods: {
      init: function() {
        let stream = youtubeStream(queue[0].url)
        if (queue.length > 0) {
          const player = new Howl({
            src: ['...'],
            html5: true,
            onend: function() {
              console.log('Finished!');
            }
          });
        }
      },
      play: function() {
        player.play()
      }
    }
  }
*/
</script>