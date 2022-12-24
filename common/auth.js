const bcrypt = require('bcryptjs')
const SALT = 10; // number time to encrypt the password 

const jwt = require('jsonwebtoken')
const secret = 'hjadhfljblkr*lsia@$%Lds'


const hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(SALT)
    let hash = await bcrypt.hash(password, salt)
    return hash
}
const hashCompare = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

//create token
const createToken = async (payload) => {

    //syntax in sign funtion (data, secret key, and options )
    let token = await jwt.sign(payload, secret, { expiresIn: '1m' })
    return token
}

//ecode Token

const decodeToken = async (token) => {
    let data = await jwt.decode(token)
    return data
    // console.log(data)
}

//validate a middle ware function

const validate = async (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1] //to get only the token without word barrer
        let data = await decodeToken(token)
        if (Math.round(Date.now() / 1000) <= data.exp) // convert current time and verifying the current time and tken time 
        {
            next()//it is the funtion used execute the next function
        }
        else {
            res.status(401).send({ message: "Token Expired" })
        }

    }
    else {
        res.status(400).send({
            message: "token not Found"
        })
    }
}

const adminRole = async (req, res, next) => {

    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1] //to get only the token without word barrer
        let data = await decodeToken(token)
        if (data.role === 'admin') {
            next()//it is the funtion used execute the next function
        }
        else {
            res.status(401).send({ message: "Access for Admin only " })
        }

    }
    else {
        res.status(400).send({
            message: "token not Found"
        })
    }

}

module.exports = { hashPassword, hashCompare, createToken, decodeToken, validate, adminRole }