import fs from 'fs'
import dataurl from 'dataurl'
import id3 from 'id3js'
const fallbackIcon = require('@/assets/music.svg')

function convertSong (path) {
  const songPromise = new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) { reject(err) }
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }))
    })
  })
  return songPromise
}
function truncate (string, limit) {
  if (limit > string.length - 1) return
  string = string.split('')
  if (string.length >= limit) {
    string.splice(limit, string.length - 1)
    string = string.join('')
    string += '...'
  }
  return string
}
export default function getTrackObj (file) {
  let trackObj = {url: '', name: '', artist: '', coverUrl: '', path: ''}
  convertSong(file.path).then(dataUrl => {
    id3({ file: file.path, type: id3.OPEN_LOCAL }, (err, tags) => {
      if (err) throw err
      if (tags.title) {
        tags.title = truncate(tags.title, 15)
      }
      trackObj.url = dataUrl
      trackObj.name = tags.title || file.name
      trackObj.artist = tags.artist || 'Unknown artist'
      trackObj.coverUrl = fallbackIcon
      trackObj.path = file.path

      // RETURN TRACK OBJ
    /*
      if (this.queue.length > 0) {
        for (let track of this.queue) {
          if (trackObj.url === track.url) {
            doesTrackAlreadyExist = true
            break
          }
        }
      }
      doesTrackAlreadyExist ? console.log('Already Exists') : store.commit('push', trackObj)
    */
    })
    .then(() => {
      return trackObj
    })
  })
}
