import Joi from 'joi';

const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const validateSignup = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
        error: 'All fields must be filled'
        });
    }

    const { error, value } = signupSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
        error: error.details[0].message
        });
    }

    req.body = value; 
    next();
};
