import {generate, initialize} from "../core/generateAvatar"
import data from "../../data.json"

initialize()

export default async function avatarV2(fastify) {
  fastify.get("/", async (req, res) => {
    if(req.query.json) {
      return {data: await generate()}
    } else {
      res.code(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(`<body><img src="${await generate()}"/></body>`)
    }
  })
  fastify.get("/:id", async (req, res) => {
    if(req.params.id) {
      if(req.query.json) {
        return {data: await generate(data[req.params.id])}
      } else {
        res.code(200)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(`<body><img src="${await generate(data[req.params.id])}"/></body>`)
      }
    } else {
      res.code(404).send('err')
    }
  })
  fastify.get("/data/:id", async (req, res) => {
    if(req.params.id && data[req.params.id]) {
      let attributes = []
      for (const [key, value] of Object.entries(JSON.parse(Buffer.from(data[req.params.id], 'base64').toString('utf8')))) {
        attributes.push({"trait_type":key,"value":value})
      }
      return {
        "name": `Blimp ${req.params.id}`,
        "description": "This is your awesome Blimp avatar", 
        "image": await generate(data[req.params.id]),
        "attributes": attributes
      }
    } else {
      res.code(404).send('err')
    }
  })
}