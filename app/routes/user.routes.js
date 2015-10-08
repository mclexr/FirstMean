var User = require('../models/user');

module.exports = function (app, router) {

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

}
