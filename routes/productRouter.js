const express = require('express');
let router = express.Router();


router.get("/", (req,res)=>{

    if(req.query.category == null || isNaN(req.query.category)){
        req.query.category = 0;
    }
    if(req.query.brand == null || isNaN(req.query.brand)){
        req.query.brand = 0;
    }
    if(req.query.color == null || isNaN(req.query.color)){
        req.query.color = 0;
    }
    if(req.query.min == null || isNaN(req.query.min)){
        req.query.min = 0;
    }
    if(req.query.max == null || isNaN(req.query.max)){
        req.query.max = 0;
    }
    

    let categoryController = require("../controllers/categoryController");
    categoryController.getAll().then(data =>{
        res.locals.categories = data;
        let brandController = require("../controllers/brandController");
        return brandController.getAll(req.query);
    }).then(data =>{
        res.locals.brands = data;
        let colorController = require("../controllers/colorController");
        return colorController.getAll(req.query);
    }).then(data =>{
        res.locals.colors = data;
        let productController = require("../controllers/productController");
        return productController.getAll(req.query);
    }).then(data =>{
        res.locals.products = data;
        res.render("category");
    });
});

router.get("/:id", (req,res,next)=>{
    let productController = require("../controllers/productController");
    productController.getById(req.params.id)
    .then(data =>{
        res.locals.product = data;
        res.render("single-product");
    })
});

module.exports = router;

