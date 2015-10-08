var jwt = require('jsonwebtoken');

module.exports = function (app, router) {

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

}
