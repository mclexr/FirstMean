// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://mclexr:mongolabMaster@ds035014.mongolab.com:35014/blog');

var User = require('./app/models/user');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------

router.use(function (req, res, next) {
    // do logging
    console.log('Requisição realizada');
    next();
});

router.get('/', function (req, res) {
    res.json({
        message: 'Bem vindo a api!'
    });
});

router.route('/users')
    .post(function (req, res) {

        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function (err) {
            if (err)
                res.status(409).send(err);

            res.status(201).json(user);
        });

    })
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

router.route('/users/:userId')
    .get(function (req, res) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    .put(function (req, res) {

        User.findById(req.params.userId, function (err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.password = req.body.password || user.password;

            user.save(function (err) {
                if (err)
                    res.send(err);

                res.status(200).json(user);
            });

        });
    })
    .delete(function (req, res) {
        User.remove({
            _id: req.params.userId
        }, function (err, user) {
            if (err)
                res.send(err);

            res.status(200).json({
                message: 'Successfully deleted'
            });
        });
    });


app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor rodando na porta ' + port);
