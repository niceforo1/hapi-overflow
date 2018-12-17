'use strict';
const Hapi = require('hapi');
const handlebars = require('handlebars');
const vision = require('vision');
const inert = require('inert');
const path = require('path');
const routes = require('./routes');
const site = require('./controllers/site');

handlebars.registerHelper('answerNumber', (answers) => {
	const keys = Object.keys(answers);
	return keys.length;
});

const server = Hapi.server({
	port: process.env.PORT || 3000,
	host: 'localhost',
	routes: {
		files: {
			relativeTo: path.join(__dirname, 'public')
		}
	}
});

async function init() {
	try {
		await server.register(inert);
		await server.register(vision);

		server.state('user', {
			ttl: 1000 * 60 * 60 * 24 * 7,
			isSecure: process.env.NODE_ENV === 'prod',
			encoding: 'base64json'
		});

		server.views({
			engines: {
				hbs: handlebars
			},
			relativeTo: __dirname,
			path: 'views',
			layout: true,
			layoutPath: 'views'
		});
		server.ext('onPreResponse', site.fileNotFound);
		server.route(routes);

		await server.start();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
	console.log(`Server lanzado en: ${server.info.uri}`);
}

process.on('unhandledRejection', (error) => {
	console.error(`unhandledRejection `, error.message, error);
});

process.on('unhandledException', (error) => {
	console.error(`unhandledException `, error.message, error);
});

init();
// h Segundo param del handler, es una colección de utilidades y propiedades relativas a enviar información de respuesta.
// h.response crea un objeto de respuesta
// h.redirect redirecciona una petición
// h.response permite definir las propiedades de la respuesta al Browser o cliente que realizó la respuesta.
// response.header Configura un encabezado en la respuesta
// response.type Permite definir el tipo de mime de la respuesta.
// response.code permite definir el codigo de estado de la respuesta (200,300,400,500)

// Plugin es un modulo que adiciona funcionalidades a hapi utilizando el API base de hapi
