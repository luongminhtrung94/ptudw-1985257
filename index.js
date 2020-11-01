const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();

app.use(express.static(__dirname + '/public'));
let helper = require("./controllers/helper");
let paginateHelper = require("express-handlebars-paginate");
const hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars,
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// use body-parser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// use session
let session = require('express-session');
app.use(session({
    cookie: { httpOnly: true, maxAge:null},
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false
}));

// use cart Controller
let Cart = require('./controllers/cartController');
app.use((req, res, next) =>{
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity || 0;
    res.locals.username = (req.session.user) ? req.session.user.fullname : '';
    res.locals.isLoggedIn = (req.session.user) ? true : false;
    console.log(res.locals.isLoggedIn);
    next();
});

app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productRouter"));
app.use("/cart", require("./routes/cartRouter"));
app.use("/comments", require("./routes/commentRouter"));
app.use("/reviews", require("./routes/reviewRouter"));
app.use("/users", require("./routes/userRouter"));

app.get('/sync', (req,res)=>{
    let models = require("./models");
    models.sequelize.sync()
    .then(()=>{
        res.send("database sync completed!");
    });
});

app.get('/:page',(req,res)=>{
    let banner = {
        blog: 'Our Blog',
        category: 'Category',
        cart: 'Shopping Cart'
    };
    let page = req.params.page;
    res.render('blog', { banner: banner[page]});
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});

