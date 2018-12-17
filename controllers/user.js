'use strict';
const Boom = require('boom');
const Users = require('../models/index').users;

async function createUser(req, h) {
	let result;
	try {
		result = await Users.create(req.payload);
	} catch (error) {
		console.error(error);
		// return h.response(`Problemas creando el usuario`).code(500)
		return h.view('register', {
			title: 'Registro',
			error: 'Error creando el usuario'
		});
	}
	// return h.response(`Usuario creado ID:${result}`)
	return h.view('register', {
		title: 'Registro',
		success: 'Usuario creado exitosamente'
	});
}

async function validateUser(req, h) {
	let result;
	try {
		result = await Users.validateUser(req.payload);
		if (!result) {
			// h.response('Email y/o contraseña incorrecta').code(401)
			return h.view('login', {
				title: 'Login',
				error: 'Email y/o contraseña incorrecta'
			});
		}
	} catch (error) {
		console.error(error);
		// return h.response(`Problemas validando el usuario`).code(500)
		return h.view('login', {
			title: 'Login',
			error: 'Problemas validando el usuario'
		});
	}

	return h.redirect('/').state('user', {
		name: result.name,
		email: result.email
	});
}

function logout(req, h) {
	return h.redirect('/login').unstate('user');
}

function failValidation(req, h, error) {
	const template = {
		'/create-user': 'register',
		'/validate-user': 'login',
		'/create-question': 'ask'
	};
	return h
		.view(template[req.path], {
			title: 'Error de validación',
			error: 'Por favor complete los campos requeridos'
		})
		.code(400)
		.takeover();
}
module.exports = {
	createUser: createUser,
	validateUser: validateUser,
	logout: logout,
	failValidation: failValidation
};
