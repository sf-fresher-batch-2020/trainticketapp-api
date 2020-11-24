const Joi = require('joi');

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

class UserSchemaValidator {

    createUserSchema = async function (req,res,next){
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('ADMIN', 'USER').required()
        });

        validate(schema,req,res,next);
    }

    validate = async function(schema,req,res,next){
        try{
            let result = await schema.validateAsync(req.body, options);
            console.log("Result:", result);
            //validateRequest(req,next, schema);
            next();
        }
        catch(error){    
            let errorMessages = error.details.map(x=>x.message);       
            console.error(JSON.stringify(errorMessages));
            let result = { status: 400, errors: errorMessages};
            res.status(400).json(result);
        }
    }

}

exports.UserSchemaValidator = UserSchemaValidator;