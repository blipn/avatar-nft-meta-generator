const fs = require('fs')
const { initialize, generate } = require('../core/generateAvatar')

const dataFile = `../../${process.argv[2] || 'blimps_data'}.json`
const data = require(dataFile)
const outputDir = './output/'

initialize().then(()=>{
  if (!fs.existsSync(outputDir)){
    console.log('Creating output directory...')
    fs.mkdirSync(outputDir)
  }
  const queue = data.map((e, id) => {
    return new Promise(async (resolve, reject) => {
      let attributes = []
      for (const [key, value] of Object.entries(JSON.parse(Buffer.from(e, 'base64').toString('utf8')))) {
        attributes.push({"trait_type":key,"value":value})
      }
      const data = {
        "name": `Blimp n°${id}`,
        "description": "This is an awesome Blimp", 
        "image": await generate(e),
        "attributes": attributes
      }
      fs.appendFile(outputDir + id + '.json', JSON.stringify(data), function (err) {
        if (err) reject()
        resolve(id)
      })
    })
  })

  Promise.all(queue).then(()=>{
    console.log('Done!')
  })
})
