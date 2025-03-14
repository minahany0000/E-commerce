import joi from 'joi'

const generalField = {

    mongoId: joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Invalid MongoDB ObjectId format"),

    email: joi.string().email({ tlds: { allow: ['com', 'net'] } }).required().pattern(/^[a-z0-9._%+-]+@gmail\.com$/),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    id: joi.string().length(24).hex().required(),
    file: joi.object(
        {
            size: joi.number().positive().required(),
            path: joi.string().required(),
            filename: joi.string().required(),
            destination: joi.string().required(),
            mimetype: joi.string().required(),
            encoding: joi.string().required(),
            originalname: joi.string().required(),
            fieldname: joi.string().required()
        }),
    headers: joi.object().pattern(/^/, joi.string()).keys({
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
        token: joi.string().required()
    })


}

export default generalField