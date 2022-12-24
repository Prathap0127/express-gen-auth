var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
const {dbUrl} = require('./../dbConfig')
const {userModel} = require('./../Schema/UserSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validate, adminRole} = require('./../common/auth')

mongoose.connect(dbUrl);

/* GET users listing. */
router.get('/all',validate,adminRole, async(req, res)=> {
  try {
    // console.log(req.headers.authorization)             
    let user = await userModel.find({})
    res.status(200).send({data:user})
  } catch (error) {
    res.status(500).send({message:"Internal Server Error",error})
  }
 
});

//create (signUP)
router.post('/', async(req,res)=>{
  try {
    let user = await userModel.findOne({email:req.body.email})
    if(!user){
      req.body.password = await hashPassword(req.body.password)
      // console.log(req.body.password)
      await userModel.create(req.body)
      res.status(201).send({message:"Registration Sucessfull"})
    }
    else{
      res.status(400).send({message:`User with email ${req.body.email} exits already!`})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
    
  }
})

//login

router.post('/login', async(req,res)=>{
  try {
    let user = await userModel.findOne({email:req.body.email})
    if(user){
      if(await hashCompare(req.body.password,user.password))
      {
        // we need to create tokens
        let token = await createToken({
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email,
          mobile:user.mobile,
          role:user.role
        })
        decodeToken(token)
        res.status(201).send({message:"Login Sucessfull",token})

      }
      else
      {
        res.status(400).send({message:'Invalid Credential'})
      }
    }
    else{
      res.status(400).send({message:`User with email ${req.body.email} not exits!`})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
    
  }
})

module.exports = router;
