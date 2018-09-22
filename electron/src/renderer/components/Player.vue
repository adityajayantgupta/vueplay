<template>
  <div id="container">
    <div class="large-3 columns">
      <div class="small-4 columns">
        <img v-bind:src="queue[currentTrackIndex].image" class="cover">
      </div>
      <div class="small-8 columns">
        <div class="track-name">{{queue[currentTrackIndex].name}}</div><div class="track-artist">{{queue[currentTrackIndex].artist}}</div>
      </div>
    </div>
    <div class="large-2 columns">
      <div id="playbackControls">
        <span class="large-1 columns blank"></span>
        <a class="large-2 columns btn" v-on:click="shuffle()"><i class="fa fa-random"></i></a>
        <a class="large-2 columns btn active" v-on:click="playPrev()"><i class="fa fa-backward"></i></a>
        <a class="large-2 columns btn active" v-on:click="togglePlayPause()">
          <i v-if="!isPlaying" class="fa fa-play"></i>
          <i v-else class="fa fa-pause"></i>
        </a>
        <a class="large-2 columns btn active" v-on:click="playNext()"><i class="fa fa-forward"></i></a>
        <a class="large-2 columns btn" v-on:click="loop()"><i v-bind:class="{'active': isLooping}" class="fa fa-repeat"></i></a>
        <span class="large-1 columns blank"></span>
      </div>
    </div>
    <div id="seekbar-container" class="large-5 columns">
      <div class="large-2 columns">{{currentTime.mins}}:{{currentTime.secs}}</div>
      <div class="large-8 columns">
        <input class="slider" type="range" v-bind:value="currentTime.total" v-bind:max="duration.total" v-on:change="seekTime($event)">
      </div>
      <div class="large-2 columns">{{duration.mins}}:{{duration.secs}}</div>
    </div>
    <div id="volume-container" class="large-2 columns">
      <div class="large-2 columns">
        <i v-if="!player.volume" class="fa fa-volume-off"></i>
        <i v-else class="fa fa-volume-up"></i>
      </div>
      <div class="large-10 columns">
        <input id="volume" class="slider" type="range" min=0 max=1 step=0.01 value='1' v-on:change="updateVolume($event)">
      </div>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import store from '@/vuex/store'
  import 'font-awesome/css/font-awesome.css'
  //import youtubedl from 'youtube-dl'

  export default {
    computed: {
      queue: function () {
        if (store.state.queue.length < 1) {
          return this.tmpTrackObj
        }
        return store.state.queue
      }
    },
    watch: {
      queue: {
        handler: function (updatedQueue) {
          if (this.hasBeenInitialised) {
            // If the song gets removed while playing
            if (updatedQueue[0].url !== this.player.src){
              this.stop()
              this.player.src = this.queue[0].url
              this.isPlaying = false
            }
          } else if (!this.hasBeenInitialised) {
            this.init()
          }
        }
      }
    },
    data() {
      return {
        player: null,
        currentTrackIndex: 0,
        duration: {mins: '0', secs: '00', total: 0},
        currentTime: {mins: '0', secs: '00', total: 0},
        isPlaying: false,
        isLooping: false,
        hasBeenInitialised: false,
        tmpTrackObj: [{
          url: '',
          name: 'Nothing in queue',
          artist: '',
          coverUrl: '',
          isTemp: true
        }]
      }
    },
    methods: {
      init: function () {  
        /*
          var video = youtubedl(queue[0].url,
            // Optional arguments passed to youtube-dl.            
            ['--extract-audio'],
            // Additional options can be given for calling `child_process.execFile()`.
            { cwd: __dirname })
          
          // Will be called when the download starts.
          video.on('info', function(info) {
            console.log('Download started')
            console.log('filename: ' + info._filename)
            console.log('size: ' + info.size)
          })
          
          video.pipe(fs.createWriteStream('audio_.mp3'))
        */
        this.player = new Audio(this.queue[0].url)
        if (this.queue[0].isTemp) {
          this.duration = {mins: '0', secs: '00', total: 0}
        } else this.calcTrackDuration()
        this.player.addEventListener('timeupdate', this.updateCurrentTime, false)
        this.player.addEventListener('loadedmetadata', this.calcTrackDuration, false)
        this.player.addEventListener('ended', this.playNext, false)
      },
      play: function () {
        this.player.play()
        this.isPlaying = true
      },
      pause: function () {
        this.player.pause()
        this.isPlaying = false
      },
      stop: function () {
        this.player.pause()
        this.player.currentTime = 0
        this.isPlaying = false
      },
      togglePlayPause: function () {
        if (!this.queue[0].isTemp) {
          if (!this.hasBeenInitialised) {
            this.init()
            this.play()
            this.hasBeenInitialised = true
          }
          else if (this.hasBeenInitialised) {
            if (!this.isPlaying) {
              this.play()
            } else if (this.isPlaying) {
              this.pause()
            }
          }
        }
      },
      shuffle: function () {
        store.commit('shuffle')
        console.log(this.queue)
      },
      playPrev: function () {
        let prevTrack = this.queue[this.currentTrackIndex - 1]
        if (!prevTrack) {
          this.stop()
          this.player.currentTime = 0
          this.play()
        } else {
          this.stop()
          this.player.src = prevTrack.url
          this.currentTrackIndex -= 1
          this.play()
        }
      },
      playNext: function () {
        let nextTrack = this.queue[this.currentTrackIndex + 1]
        if (!nextTrack) {
          this.stop()
          this.player.src = this.queue[0].url
          this.currentTrackIndex = 0
          this.play()
          this.isPlaying = true
        } else {
          this.stop()
          this.player.src = nextTrack.url
          this.currentTrackIndex += 1
          this.play()
          this.isPlaying = true
        }
      },
      loop: function () {
        if (!this.isLooping) {
          this.player.loop = true
          this.isLooping = true
        } else {
          this.player.loop = false
          this.isLooping = false
        }
      },
      calcTrackDuration: function () {
        const DURATION = this.player.duration.toFixed(0)
        const SEPARATED_DURATION = this.separateTime(DURATION)
        this.duration.mins = SEPARATED_DURATION.mins < 10 ? '0' + SEPARATED_DURATION.mins : SEPARATED_DURATION.mins
        this.duration.secs = SEPARATED_DURATION.secs < 10 ? '0' + SEPARATED_DURATION.secs : SEPARATED_DURATION.secs
        this.duration.total = DURATION
      },
      updateCurrentTime: function () {
        const CURRENT_TIME = this.player.currentTime.toFixed(0)
        const SEPARATED_CURRENT_TIME = this.separateTime(CURRENT_TIME)
        this.currentTime.mins = SEPARATED_CURRENT_TIME.mins < 10 ? '0' + SEPARATED_CURRENT_TIME.mins : SEPARATED_CURRENT_TIME.mins
        this.currentTime.secs = SEPARATED_CURRENT_TIME.secs < 10 ? '0' + SEPARATED_CURRENT_TIME.secs : SEPARATED_CURRENT_TIME.secs
        this.currentTime.total = CURRENT_TIME
      },
      separateTime: function (time) {
        let separatedTime = {mins: 0, secs: 0}
        separatedTime.mins = Math.floor(time / 60)
        separatedTime.secs = Math.floor(time - (separatedTime.mins * 60))
        return separatedTime
      },
      seekTime: function (event) {
        this.player.currentTime = event.target.value
      },
      updateVolume: function (event) {
        this.player.volume = event.target.value
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/colors.scss';

  div#container {
    height: 10vh;
    width: 100vw;
    padding: 1rem;
    overflow: hidden;
    background: lighten($background, 10%);
    color: white;
    display: flex;
    align-items: center;
  }

  div#playbackControls {
    a.btn {
      color: $grey;
    }
    a.btn:hover, a.btn:active {
      color: white;
    }
    a.active {
      color: white;
    }
  }

  div#seekbar-container, div#volumne-container {
    display: flex;
    align-items: center;
  }

  input.slider {
    width: 100%;
    -webkit-appearance: none;
    cursor: pointer;
    overflow: hidden;
  }
  input.slider:focus {
    outline: none;
  }
  input.slider::-webkit-slider-runnable-track {
    height: 0.5rem;
    background: lighten($background, 5%);
  }
  input.slider::-webkit-slider-thumb {
   /* -webkit-appearance: none;
    height: 0.5rem;
    color: lighten($background, 20%);*/
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 10rem;
    background: lighten($background, 50%);
    box-shadow: -100vw 0 0 100vw lighten($background, 50%);
    cursor: pointer;
    -webkit-appearance: none;
  }
</style>