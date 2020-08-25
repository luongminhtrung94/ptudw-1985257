const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();

app.use(express.static(__dirname + '/public'));
const hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.get('/',(req,res)=>{
    res.render('index');
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
