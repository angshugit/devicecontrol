
var usersModel = require('../models/userModel.js');

exports.session_login_on_post = function(req, res) {
    var postData = req.body,
    validationError = { type: 'Validation Error', message: '' };

    if (!postData.username) {
        validationError.message = 'User Name is required';
    } else if(!postData.password) {
        validationError.message = 'Password is required';
    }
    if (validationError.message) {
        res.json(validationError);
        return;
    }

    usersModel.findOne({ username: postData.username }, function(err, user) {
        if (err) {
            res.send(err);
            console.log('Error finding user');
            return;
        }
        if (user === null) {
            res.json({ type: 'error',
                       message: 'No user with "username" of "'
                       + postData.username + '".' });
            return;
        }
        // check if password matches
        if (user.password != postData.password) {
            console.log('Password not matching');
            res.json({ type: 'error',
                       message: 'password not correct' });
            return;
        }
        console.log('login successful');
        // if yes, send success and role from database 
        res.json({ type: 'success',
                   role: user.role });
    });
};

exports.session_logout_on_delete = function(req, res) {
    // What to do? remove a session from session DB
    // What about timeout ?
    res.send('NOT IMPLEMENTED: logout');
};
