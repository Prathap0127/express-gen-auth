const { default: mongoose } = require('mongoose')
const validator = require('validator')


const usersSchema = new mongoose.Schema(

    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: (value) => validator.isEmail(value)
        },

        mobile: {
            type: String,
            required: true,
            validate: (value) => { return validator.isNumeric(value) && (value.length === 10) }
        },
        password: { type: String, required: true },
        role:{type:String, default:"student"},
        createdAt: { type: String, default: Date.now() }
    },
    //to control db name and verification key 
    {
        collection: 'user',
        versionKey: false
    }
)

const userModel = mongoose.model('user', usersSchema)

module.exports = { userModel }