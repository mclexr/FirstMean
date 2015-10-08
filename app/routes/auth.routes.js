var jwt = require('jsonwebtoken');
var User = require('../models/user');

module.exports = function (app, router) {

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



}
