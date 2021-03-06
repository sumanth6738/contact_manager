const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()
const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication.js')
// get user list
router.get('/',function(req,res){
    // will return all the document in the collection
    User.find()
    .then(function(user){
        res.send(user)
    })
    .catch(function(err){
        res.send(err)
    })
})

// register
router.post('/register',function(req,res){
    const body = req.body
    const user = new User(body)
    console.log(user.isNew)
    // creating an object of contact type
   // contact.name = body.name ..... 
    user.save()
        .then(function(user){
            console.log(user.isNew)
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})

// login
router.post('/login',function(req,res){
    const body = req.body
    User.findByCredentials(body.email,body.password)
        .then(function(user){
           return user.generateToken()    
        })
        .then(function(token){
            res.send({token})
        })
        .catch(function(err){
            res.status('404').send(err)
        })
    // User.findOne({email: body.email})
    //     .then(function(user){
    //         if(!user){
    //             res.status('404').send('Invalid email/password')
    //         }
    //     bcryptjs.compare(body.password,user.password)
    //         .then(function(result){
    //             if(result){
    //                 res.send(user)
    //             }else {
    //                 res.status('404').send('Invalid email/Password')
    //             }
    //         })
    //     })
       
    //     .catch(function(err){
    //         res.send(err)
    //     })
})

//users/account
router.get('/account',authenticateUser,function(req, res){
    const {user} = req
    res.send(user)
})

//users/logout

router.delete('/logout',authenticateUser,function(req,res){
    const { user, token } = req
    User.findByIdAndUpdate(user._id, {$pull: {tokens: {token: token}}})
    .then(function(){
        res.send({notice: 'successfully logged out'})
    })
    .catch(function(err){
        res.send(err)
    })
})


module.exports = {
    userRouter: router
}