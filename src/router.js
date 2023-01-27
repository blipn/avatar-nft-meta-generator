import avatar from './routes/avatar'
export default async function router(fastify) {
  fastify.register(avatar, { prefix: "/api/v1/avatar/" })
}