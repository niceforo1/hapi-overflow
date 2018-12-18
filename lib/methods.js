'use strict';

const questions = require('../models/index').questions;

async function setAnswerRight(questionId, answerId, user) {
	let result;
	try {
		result = await question.setAnswerRight(questionId, answerIdm, user);
	} catch (error) {
		console.error(error);
		return false;
	}
	return result;
}

module.exports = {
	setAnswerRight: setAnswerRight
};
