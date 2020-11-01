let controller = {}
let models = require("../models");
let User = models.User;
let bcryptjs = require('bcryptjs');

controller.getUserbyEmail = (email) =>{
    return User.findOne({
        where: { username: email}
    })
}


controller.createUser = (user) =>{
    var salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(user.password, salt);
    return User.create(user);
}


controller.comparePassword = (password, has) =>{
    return bcryptjs.compareSync(password, has);
}

controller.isLoggedIn = (req,res,next)=>{
    if(req.session.user){
         next();
    }else{
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
}

module.exports = controller;