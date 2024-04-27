import Fastify from 'fastify';
import cors from '@fastify/cors';
import https from 'node:https';
import http from 'node:http';

const fastify = Fastify({
  logger: true
})

fastify.all('/', async (request, reply) => {

    const { method, url, body, headers } = request;

    const remoteHost = `http://localhost:3006`;
    const remoteUrl = `${remoteHost}${url}`;

    const res = await doGET(remoteUrl);
    //const res = await doGET('https://jsonplaceholder.typicode.com/users?_limit=2');
    reply.code(200).send(res);
});

const doGET = (url) => {
  return new Promise((resolve, reject) => {
    let data = '';
    http.get(url, (res) => {
      if (res.statusCode !== 200) reject(res.statusCode);
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('close', () => {
        resolve(data);
      })
    })
  })
}


const start = async () => {

  await fastify.register(cors, {
    origin: (origin, cb) => {
      cb(null, true);
      return origin;
    },
    credentials: true,
    methods: 'GET, PUT, PATCH, POST, DELETE, OPTIONS, HEAD',
  })

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

(async () => {
  await start();
})();