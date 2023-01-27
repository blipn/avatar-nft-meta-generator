const { join } = require('path')
const sharp = require('sharp')
const dir = join(__dirname, '../../images/generator/')
const randomColor = require('randomcolor')
const { listFiles, listFolders } = require('../helpers/randomFile')
const WIDTH = 600
const HEIGHT = 800

let data = []

async function initialize (callback) {
  const folders = await listFolders(dir)
  console.log('Available images folders :', folders)

  const queue = folders.map((e)=>{
    return new Promise(async (resolve, reject) => {
      try {
        const files = await listFiles(join(dir, e))
        data[e] = { files, max: files.length, getRandom: ()=>{ return files[Math.floor(Math.random() * files.length)] }, get: (name)=>{return join(dir, e, name)} }
        resolve()
      } catch (error) {
        reject()
      }
    })
  })
  return Promise.all(queue).then(callback)
}

const generateArm = async (id, color, modulate, left=false)=>{
  const items = data['arm']
  const item = sharp(items.get(id)).tint(color).modulate(modulate)
  if(left) {
    item.flop()
  }
  const image = await item.png().toBuffer()
  return image
}

const generateLeg = async (id, color, modulate, left=false)=>{
  const items = data['leg']
  const item = sharp(items.get(id)).tint(color).modulate(modulate)
  if(left) {
    item.flop()
  }
  const image = await item.png().toBuffer()
  return image
}

const generateItem = async (id, name, color, modulate = {}, width)=>{
  const items = data[name]
  const item = sharp(items.get(id)).tint(color).modulate(modulate).resize({ width })
  const image = await item.png().toBuffer()
  return image
}

const generateShoes = async (id, modulateshoes)=>{
  const items = data['shoes']
  const item = sharp(items.get(id)).median(3).modulate({ hue: modulateshoes, brightness: 1.1 })
  const left = await item.png().toBuffer()
  item.flop()
  const right = await item.png().toBuffer()
  return {left, right}
}

const generateHair = async (id, color, width)=>{
  const items = data['hair']
  const item = sharp(items.get(id)).tint(color).resize({ width })
  const image = await item.png().toBuffer()
  return image
}

const generateHead = async (id, color, modulate, width)=>{
  const items = data['head']
  const image = await sharp(items.get(id)).tint(color).resize({ width }).modulate(modulate).png().toBuffer()
  return image
}

const generateEye = async (id, hue, width)=>{
  const items = data['eye']
  const image = await sharp(items.get(id)).resize({ width }).modulate({ hue }).rotate(Math.random()*90 - 45, {background: '#00000000' }).png().toBuffer()
  return image 
}

const generateMouth = async (id, color, modulate, width)=>{
  const items = data['mouth']
  const image = await sharp(items.get(id)).resize({ width }).rotate(Math.random()*10 - 5, {background: '#00000000' }).tint(color).modulate(modulate).png().toBuffer()
  return image
}

const generateNoze = async (id, color, modulate, width)=>{
  const items = data['noze']
  const image = await sharp(items.get(id)).resize({ width }).rotate(Math.random()*10 - 5, {background: '#00000000' }).tint(color).modulate(modulate).png().toBuffer()
  return image
}

const generateSign = async (id, width)=>{
  const items = data['sign']
  const image = await sharp(items.get(id)).resize({ width }).median(3).png().toBuffer()
  return image
}

const generateTatoo = async (id, width)=>{
  const items = data['tatoo']
  const image = await sharp(items.get(id)).resize({ width }).png().toBuffer()
  return image
}

const randomId = async () => {
  const id = {}
  id['hairColor'] = randomColor({luminosity: 'dark'})
  id['backgroundColor'] = randomColor({luminosity: 'dark'})
  id['bodyColor'] = randomColor()
  id['topColor'] = randomColor()
  id['botColor'] = randomColor()
  id['glassColor'] = randomColor()
  id['modulate'] = Math.floor(Math.random()*-60)
  id['eyesHue'] = Math.floor(Math.random()*360)
  id['modulateShoes'] = Math.floor(Math.random()*360)
  id['topOrBodyRDM'] = Math.round(Math.random()*10)
  id['boldRDM'] = Math.round(Math.random()*10)
  id['cyclopRDM'] = Math.round(Math.random()*10)
  id['glassRDM'] = Math.round(Math.random()*10)
  id['tatooRDM'] = Math.round(Math.random()*10)
  id['signRDM'] = Math.round(Math.random()*10)
  for (const [key, value] of Object.entries(data)) {
    id[key] = await value.getRandom()
  }
  id['arm2'] = data['arm'].getRandom()
  return({id, buffer: Buffer.from(JSON.stringify(id)).toString('base64')})
}


const generate = async (from)=> {
  const id = from ? JSON.parse(Buffer.from(from, 'base64').toString('utf8')) : (await randomId()).id

  const canvas = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })

  const bodyColor = id['bodyColor']
  const modulate = { lightness: id['modulate'] }
  
  const toCompose = [
    { input: await generateArm(id['arm'], bodyColor, modulate) },
    { input: await generateArm(id['arm2'], bodyColor, modulate, true) },
    { input: await generateLeg(id['leg'], bodyColor, modulate) },
    { input: await generateLeg(id['leg'], bodyColor, modulate, true) },
    { input: await generateItem(id['neck'], 'neck', bodyColor, modulate) },
  ]
  if(id['topOrBodyRDM']>8) {
    toCompose.push({ input: await generateItem(id['body'], 'body', id['topColor']) })
  } else {
    toCompose.push({ input: await generateItem(id['bot'], 'bot', id['botColor']) })
    toCompose.push({ input: await generateItem(id['top'], 'top', id['topColor']) })
  }
  const shoes = await generateShoes(id['shoes'], id['modulateShoes'])
  toCompose.push({ input: shoes.left }, { input: shoes.right })

  if(id['boldRDM']>1) {
    const size = 200
    toCompose.push({ input: await generateHair(id['hair'], id['hairColor'], size), top: HEIGHT/2 - 150, left: WIDTH/2-size/2 })
  }

  if(id['signRDM'] > 1) {
    const size = 50
    toCompose.push({ input: await generateSign(id['sign'], size), top: HEIGHT/2 + 60, left: WIDTH/2-size/2 })
  }

  {
    const size = 200
    toCompose.push({ input: await generateHead(id['head'], bodyColor, modulate, size), top: HEIGHT/2 - 130, left: WIDTH/2-size/2 })
  }

  {
    const size = 50
    if(id['cyclopRDM']>1) {
      toCompose.push({ input: await generateEye(id['eye'], id['eyesHue'], size), top: HEIGHT/2 - 80, left: WIDTH/2-60 })
      toCompose.push({ input: await generateEye(id['eye'], id['eyesHue'], size), top: HEIGHT/2 - 80, left: WIDTH/2-10 })
      if(id['glassRDM']>8) {
        const glassWidth = size*7
        toCompose.push({ input: await generateItem(id['glasses'], 'glasses', id['glassColor'], {}, glassWidth), top: HEIGHT/2 - 190, left: WIDTH/2 - glassWidth/2 })
      }
    } else {
      toCompose.push({ input: await generateEye(id['eye'], id['eyesHue'], size), top: HEIGHT/2 - 80, left: WIDTH/2-size/2 })
    }
  }
  
  {
    const size = 50
    toCompose.push({ input: await generateMouth(id['mouth'], bodyColor, modulate, size), top: HEIGHT/2 - 10, left: WIDTH/2-size/2 })
  }

  {
    const size = 70
    toCompose.push({ input: await generateNoze(id['noze'], bodyColor, modulate, size), top: HEIGHT/2 - 35, left: WIDTH/2-size/2 })
  }
  
  if(id['tatooRDM'] > 8) {
    const size = 12
    toCompose.push({ input: await generateTatoo(id['tatoo'], size), top: HEIGHT/2 - 20, left: WIDTH/2-size/2+20 })
  }

  canvas.composite(toCompose)

  const res = await canvas.png().toBuffer()
  const rese = await sharp(res).extract({ left: 50, top: 230, width: 500, height: 500 }).png().toBuffer()
  return `data:image/png;base64,${rese.toString('base64')}`
}

module.exports = {generate, randomId, initialize}