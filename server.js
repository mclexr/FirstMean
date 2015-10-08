// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var mongoose = require('mongoose');
mongoose.connect('mongodb://mclexr:mongolabMaster@ds035014.mongolab.com:35014/blog');
app.set('secretKey', "Familia#Amigos@Master!"); // secret variable

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

router.post('/auth', function (req, res) {

    // find the user
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            if (user.password != req.body.password) {
                res.status(401).json({
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                var token = jwt.sign({
                    user: user.name,
                    email: user.email
                }, app.get('secretKey'), {
                    expiresIn: 3600
                });

                // return the information including token as JSON
                res.status(200).json({
                    token: token
                });
            }

        }

    });
});


router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('secretKey'), function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(401).send({
            message: 'No token provided.'
        });

    }
});


router.get('/', function (req, res) {
    res.json({
        message: 'Wellcome!'
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
