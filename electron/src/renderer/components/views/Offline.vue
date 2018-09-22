<template>
  <div>
    <div id="fileBrowser">
      <div class="large-3 columns">
        <div id="shortcuts">
          <div id="userFolders">
            <h1 class="title">
              Your Folders
            </h1>
            <a v-on:click="loadShortcut('home')"><i class="fa fa-user"></i>Home</a>
            <a v-on:click="loadShortcut('desktop')"><i class="fa fa-desktop"></i>Desktop</a>
            <a v-on:click="loadShortcut('music')"><i class="fa fa-music"></i>Music</a>
            <a v-on:click="loadShortcut('downloads')"><i class="fa fa-download"></i>Downloads</a>
          </div>
          <div id="drives">
            <h1 class="title">
              Drives
            </h1>
            <a v-for="drive in mountedDrives" v-on:click="readFolder(`${drive.mountPoint}/`)"><i class="fa fa-hdd"></i>{{drive.name}}</a>
          </div>         
        </div>
      </div>
      <div class="large-9 columns">
        <div id="folderView">
          <li v-on:click="upOneLevel()">
            <span>              
              <i class="fa fa-arrow-up"></i>Up one level              
            </span>
          </li>
          <li v-for="file of files">
            <i v-bind:class="file.icon"></i>
            <span v-on:click="readFolder(`${file.path}/`)">
              {{file.name}}
            </span>
            <span id="actions" v-if="file.isPlayable">
              <i class="fa fa-plus-circle" v-on:click="addSongToQueue(file)"></i>
              <i class="fa fa-list"></i>
              <i class="fa fa-play" v-on:click="playSong(file)"></i>
            </span>
          </li>
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
  const {app} = require('electron').remote
  import fs from 'fs'

  import drivelist from 'drivelist'
  import path from 'path'
  import Jimp from 'jimp'
  import store from '@/vuex/store'
  import getTrackObj from '@/modules/getTrackObj.js'
  import 'font-awesome/css/font-awesome.css'
  export default {
    name: "Offline",
    data() {
      return {
        files: [],
        mountedDrives: [],
        audioExtensions: ['.aac','.aiff','.amr','ape','.au','.awb','.dct','.dss','.dvf','.flac','.gsm','.iklax','.ivs','.m4a','.m4b','.m4p','.mmf','.mp3','.mpc','.msv','.ogg,','.oga,','.mogg','.opus','.ra,','.rm','.raw','.sln','.tta','.vox','.wav','.webm','.wma','.wv'],
        Path: path, // To prevent shadowing of path in readFolder()
        currentPath: ''
      }
    },
    computed: {
      queue: function () {
        return store.state.queue
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init: function () {
        drivelist.list((error, drives) => {
          if (error) {
            throw error
          }       
          for (let drive of drives) {
            for (let mountPoint of drive.mountpoints) {
              let driveObj = {name: '', mountPoint: ''}
              // Due to difference in mountpoint structures of Windows as compared to Unix
              if (process.platform !== 'win32') {
                // If mountpoint is not root, split it, else keep it
                let nameArr = mountPoint.path === '/' ? ['File System'] : mountPoint.path.split('/')
                driveObj.name = nameArr[nameArr.length-1]
                driveObj.mountPoint = mountPoint.path  
              } else {
                driveObj.name = mountPoint.path
                driveObj.path = mountPoint.path
              }               
              this.mountedDrives.push(driveObj)
            }
          }
        })
        this.readFolder('/')
      },
      readFolder: function (path) {
        this.currentPath = path
        this.files = []
        fs.readdir(path, (err, files) => {
          if (err) throw err
          const isAudioFile = (file) => { 
            for (let extension of this.audioExtensions) {                
              if (this.Path.extname(file) === extension) {
                return true
                break
              }                
            }
            return false
          }
          for (let file of files) {
            let fileObj = {path: '', name: '', icon: '', isPlayable: false}  
            fs.stat(path + file, (err, stats) => {
              if (err) throw err
              if (stats.isDirectory()) { 
                let fileNameArray = file.split('')
                // Exclude hidden folders
                if (fileNameArray[0] !== '.') {
                  fileObj.name = file
                  fileObj.path = this.Path.join(path, file)
                  fileObj.icon = 'fa fa-folder-open'      
                  this.files.push(fileObj)
                }
              } else if (isAudioFile(file)) {
                  fileObj.name = file
                  fileObj.path = this.Path.join(path, file),
                  fileObj.icon = 'fa fa-music'   
                  fileObj.isPlayable = true               
                  this.files.push(fileObj)
              }              
            })
          }
        })   
      },
      upOneLevel: function () {
        let path = this.Path.join(this.currentPath, '../')
        this.readFolder(path)
      },
      loadShortcut: function (name) {
        this.readFolder(app.getPath(name) + '/')
      },
      addSongToQueue: function (file) {
       let trackObj = getTrackObj(file.path) 
       let doesTrackAlreadyExist = false
       if (this.queue.length > 0) {
          for (let track of this.queue) {
            if (trackObj.url === track.url) {
              doesTrackAlreadyExist = true
              break
            }
          }
        }
        doesTrackAlreadyExist ? console.log('Already Exists') : store.commit('push', trackObj) 
      },
      playSong: function (file) {
        let trackObj = getTrackObj(file)        
        store.commit('overwrite', trackObj)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/colors.scss';
  div#shortcuts {
    h1 {
      font-size: 1.5rem;
    }
    a {
      padding: 1rem;
      display: block;
      * {
        margin-right: 1rem;
      }
      transition: 0.1s;
    }
    a:hover {
      background: $sidebar;
    }
  }
  div#fileBrowser {
    li {
      padding: 0.5rem;
      list-style-type: none;
      transition: 0.1s;
      * {
        margin-right: 1rem;
      }
      i {
        color: lighten($sidebar, 10%);
      }
      span {
        cursor: pointer;
      }
      span#actions {
        float: right;
      }
    }
    li:hover {
      background: $sidebar;
    }
  }
</style>
