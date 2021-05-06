const Joi = require('joi');

exports.userSchema = Joi.object({
    email: Joi.string().pattern(new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')),
    password: Joi.string().min(8).max(32),
    referCode: Joi.string(),
    uid: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24,24}$'))
});
