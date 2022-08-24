const Joi = require('joi')

// image field must be validated separately
const schema = Joi.object({
    id: Joi.number()
        .integer().allow(null),
    image: Joi.string()
        .max(200)
        .min(0)
        .allow(null),
    content: Joi.string()
        .max(16_777_215).allow(null),
    created: Joi.date(),
    edited: Joi.date(),
    favourite: Joi.bool().default(false),
    draft: Joi.bool().default(true),
    tags: Joi.array().default([])
})

module.exports = {
    schema
}