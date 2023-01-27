const path = require("path")
const fs = require("fs")
const util = require("util")

const randomFile = (dir, callback) => {
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err)
    const checkRandom = () => {
      if (!files.length) {
        return callback(null, undefined)
      }
      const randomIndex = Math.floor(Math.random() * files.length)
      const file = files[randomIndex]
      fs.stat(path.join(dir, file), (err, stats) => {
        if (err) return callback(err)
        if (stats.isFile()) {
          return callback(null, file)
        }
        files.splice(randomIndex, 1)
        checkRandom()
      })
    }
    checkRandom()
  })
}
const listFolders = (dir, callback) => {
  console.log(dir)
  fs.readdir(dir, (err, files) => {
    if (err) { callback(err) }
    else if (!files.length) {
      callback(new Error('Empty folder'))
    }
    else {
      let statLeft = files.length
      const folders = []
      files.forEach((name)=>{
        fs.stat(path.join(dir, name), (err, stats) => {
          if (stats.isDirectory()) {
            folders.push(name)
          }
          statLeft--
          if(statLeft === 0) {
            callback(null, folders)
          }
        })
      })
    }
  })
}

const listFiles = (dir, callback) => {  
  fs.readdir(dir, (err, files) => {
    if (err) { callback(err) }
    else if (!files.length) {
      callback(new Error('No file in folder '+dir))
    }
    else {
      let statLeft = files.length
      const result = []
      files.forEach((name)=>{
        fs.stat(path.join(dir, name), (err, stats) => {
          if (!stats.isDirectory()) {
            result.push(name)
          }
          statLeft--
          if(statLeft === 0) {
            callback(null, result)
          }
        })
      })
    }
  })
}

module.exports = { getRandomFile: util.promisify(randomFile), listFolders: util.promisify(listFolders), listFiles: util.promisify(listFiles) }