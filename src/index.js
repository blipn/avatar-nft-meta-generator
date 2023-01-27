require("dotenv").config()
import app from "./app"
const PORT = process.env.PORT || 8080
app.listen({port: PORT, address: "0.0.0.0"}, ()=>{
  console.log(`Fastify server running on port ${PORT}`)
})