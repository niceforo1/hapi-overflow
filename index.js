'use strict'
const Hapi = require('hapi')
const inert = require('inert')
const path = require('path')


const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init() {
  try {
    await server.register(inert)

    server.route({
      method: 'GET',
      path: '/home',
      handler: (req, h) => {
        return h.file('index.html')
      }
    })
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          index: ['index.html']
        }
      }
    })

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
  console.log(`Server lanzado en: ${server.info.uri}`)
}

init()
// h Segundo param del handler, es una colección de utilidades y propiedades relativas a enviar información de respuesta.
// h.response crea un objeto de respuesta
// h.redirect redirecciona una petición
// h.response permite definir las propiedades de la respuesta al Browser o cliente que realizó la respuesta.
// response.header Configura un encabezado en la respuesta
// response.type Permite definir el tipo de mime de la respuesta.
// response.code permite definir el codigo de estado de la respuesta (200,300,400,500)

// Plugin es un modulo que adiciona funcionalidades a hapi utilizando el API base de hapi