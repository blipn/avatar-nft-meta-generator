const fs = require('fs')
const { randomId, initialize } = require('../core/generateAvatar')

const file = `./${process.argv[3] || 'blimps_data'}.json`
const amount = parseInt(process.argv[2]) || 10000

initialize().then(()=>{
  try {
    fs.unlinkSync(file)
  } catch (error) {
    console.log('No such file, creating...')
  } finally {
    initialize(async ()=>{
      const ids = []
      for (let index = 0; index < amount ; index++) {
        let row = await randomId()
        ids.push(row.buffer)
        if(index === amount - 1) {
          fs.appendFile(file, JSON.stringify(ids), function (err) {
            if (err) throw err;
            console.log('File created !')
          })
        }
      }
    })
  }  
})

