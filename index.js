const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();

app.use(express.static(__dirname + '/public'));
let helper = require("./controllers/helper");
const hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        createStarList: helper.createStarList,
        createStars: helper.createStars
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productRouter"));

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

