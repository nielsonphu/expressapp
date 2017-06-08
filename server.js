var express = require('express');
var env = require('dotenv').load();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Models
var models = require("./app/models");
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
});

// Load passport strategies
require('./config/passport/passport.js')(passport, models.user);


var authRoute = require('./app/routes/auth.js')(app, passport);

app.get('/', function(req, res) {
	res.send("Welcome!");
});

app.listen(5000, function(err) {
	if (!err) {
		console.log("Site is live!");
	} else {
		console.log(err);
	}
});