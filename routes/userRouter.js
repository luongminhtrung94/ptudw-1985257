const express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');

router.get('/login', (req, res, next)=>{
    req.session.returnURL = req.query.returnURL;
    res.render('login');
});

router.post('/login', (req, res, next)=>{
    let email = req.body.username;
    let password = req.body.password;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);

    userController
    .getUserbyEmail(email)
    .then(user =>{
        if(user){
            if(userController.comparePassword(password, user.password) ){
                req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 100 : null;
                req.session.user = user;
                if(req.session.returnURL){
                    res.redirect(req.session.returnURL);
                }else{
                    return res.redirect('/');
                }
            }else{
                return res.render('login',{
                    message:"Incorrect Password!",
                    type:"alert-danger"
                })
            }
        }else{
            return res.render('login',{
                message:'Email does not exists!',
                type:'alert-danger'
            })
        }
    })
});

router.get('/register', (req, res, next)=>{
    res.render('register');
});

router.post('/register', (req, res, next)=>{
    let user = {
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
    }
    let confirmPassword = req.body.confirmPassword;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);

    if(user.password != confirmPassword){
        return res.render('register', {
            message: 'Confirm password does not match!',
            type: 'alert-danger'
        });
    }

    userController.getUserbyEmail(user.username)
    .then(existUser =>{
        if(existUser){
            return res.render('register',{
                message: `Email ${existUser.username} exist! Please choose another email address`,
                type: 'alert-danger'
            });
        }
        return userController
        .createUser(user)
        .then(user =>{
            if(keepLoggedIn){
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 100;
                req.session.user = user;
                return res.render('/')
            }else{
                return res.render('login',{
                    message: 'You have registed, now please login!',
                    type: 'alert-primary' 
                });
            }
        })
    })
    .catch(error => next(error));
});

router.get('/logout', (req,res,next)=>{
    req.session.destroy(error =>{
        if(error){
            return next(error);
        };
        return res.redirect('/users/login');
    });
});

module.exports = router;

