const express = require("express");
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");

//const multer = require('multer');
const User = require('../models/model');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/');
//     },  
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });
// const upload = multer({storage: storage});

 


router.post('/api/create', async (req, res, next) =>{

    // let email1 = req.body.email;
    // console.log(email1)
    // let selector = {
    //     limit: 1,
    //     where:{email: email1}
    
    // }

    // let user = User.findAll(selector);
    
    // if(user) return res.status(400).send('user already registered.');


    
    let hashing = req.body.password;
    const salt = await bcrypt.genSalt(10);
    hashing = await bcrypt.hash(hashing, salt)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashing
        
     }) 
    .then((userCreated)=>{
        const token = jwt.sign({id:userCreated.id}, config.get('jwtPrivateKey'));
        res.status(201).header('x-auth-token', token).send(_.pick(userCreated, ['id', 'name', 'email']));
    })
    .catch((err)=>{
        res.status(500).send({message: err})
    });
});

router.get("/api/user", (req, res, next) => {
   User.findAll()
    .then((user)=>{
        res.status(200).json({message: user});
    }).catch((err)=>{
        res.status(500).json({message: err})
    });
    
   
});

router.post('/api/auth', async(req, res)=>{
    let selector = {
        limit: 1,
        email:req.body.email
        
    }
    let user = await User.findAll(selector);
    console.log(user);
    if(!user) return res.status(400).send('invalid email or password');
    
    let pass =req.body.password;
    
    let validatePass = await bcrypt.compare(pass, user[0].password);
    if(!validatePass) return res.status(400).send('invalid email or password');
    
    const token = user.generateAuthToken();
    
    const token = jwt.sign({id:user.id}, config.get('jwtPrivateKey'));
    res(token);
});

module.exports = router;