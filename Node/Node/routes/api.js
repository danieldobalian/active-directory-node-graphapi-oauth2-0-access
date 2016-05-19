var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth.js');
var config = require('../helpers/config.js');
var request = require('request');
/* GET users listing. */
router.get('/connect', function (req, res) {
    auth.getAccessToken().then(function (data){
        console.log(data);
        req.session.access_token = data;
        res.send('respond with a resource');
    }).catch(function (error) {
        console.log('fail', error);
        res.send(500,error)
    });
});

router.get('/disconnect', function (req, res) {
    if (delete req.session.access_token) {
        console.log(req.session)
        res.send(true)
    } else {
        res.send(500,false)
    }
});

router.get('/checkConnection', function (req, res) {
    if (req.session.access_token!==undefined) {
        res.send(true)
    } else {
        res.send(false)
    }   
});
router.get('/user/(:user_id)?', function (req, res) {
    var endpoint = 'https://graph.microsoft.com/v1.0/users' + (req.params.user_id?'/' + req.params.user_id:'');
    console.log(endpoint)
    request.get(endpoint+"?"+config.filder, {
        'auth': {
            'bearer': req.session.access_token
        }
    }, function (err, response, body) {
        var parsedBody = JSON.parse(body);
        console.log(parsedBody);
        if (err) {
            res.send(500,err);
        } else if (parsedBody.error) {
            res.send(500,parsedBody.error.message);
        } else {
            // The value of the body will be an array of all users.
            if (req.params.user_id) {
                res.send(parsedBody);
            } else {
                res.send(parsedBody.value);
            }
        }
    });
});

router.post('/user', function (req, res) {
    var endpoint = 'https://graph.microsoft.com/v1.0/users';
    var data = req.body;
    data.passwordProfile = {
        "forceChangePasswordNextSignIn": data.forceChangePasswordNextSignIn=="true"?true:false,
        "password": data.password
    }
    data.accountenabled=data.accountenabled=="true"?true:false;
    delete data.password;
    delete data.forceChangePasswordNextSignIn;
    console.log(data);
    request.post({
        url:endpoint,
        body: JSON.stringify(data),
        headers:{'Content-type': 'application/json'},
        'auth': {
            'bearer': req.session.access_token
        }
    }, function (err, response, body) {
        var parsedBody = JSON.parse(body);
        
        if (err) {
            console.log(err);
            res.send(500, err);
        } else if (parsedBody.error) {
            console.log(parsedBody.error);
            res.send(500, parsedBody.error.message);
        } else {
            // The value of the body will be an array of all users.
            res.send(parsedBody.value);
        }
    });
});

router.patch('/user/:user_id', function (req, res) {
    var endpoint = 'https://graph.microsoft.com/v1.0/users/'+req.params.user_id;
    var data = req.body;
    console.log(data);
    console.log(endpoint);
    request.patch({
        url: endpoint,
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json',
            'authorization':'Bearer '+ req.session.access_token
        }
    }, function (err, response, body) {
        //var parsedBody = JSON.parse(body);
        console.log(response.statusCode)
        
        if (err) {
            console.log(err);
            res.send(500, err);
        //} else if (parsedBody.error) {
        //    console.log(parsedBody.error);
        //    res.send(500, parsedBody.error.message);
        } else {
            // The value of the body will be an array of all users.
            res.send(body);
        }
    });
});

router.delete('/user/:user_id', function (req, res) {
    var endpoint = 'https://graph.microsoft.com/v1.0/users/' + req.params.user_id;
    request.del({
        url: endpoint,
        headers: {
            'authorization': 'Bearer ' + req.session.access_token
        }
    }, function (err, response, body) {
        console.log(response.statusCode)
        if (err) {
            console.log(err);
            res.send(500, err);
        } else {
            res.send(body);
        }
    });
});

module.exports = router;