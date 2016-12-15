/**
 * Created by ChristopherBorum on 13/12/2016.
 */
const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jwt-simple')

const User = require('../models/user')
const jwtConfig = require("../config/jwtconfig")
require('../config/passport')(passport)

router.get("/names", function (req, res) {
    res.json([{name: "Peter"}, {name: "Kurt"}, {name: "Hanne"}]);
})

router.get("/hellos", function (req, res) {
    res.json([{msg: "Hello World"}, {msg: "Hello all"}, {msg: "Hello guys"}]);
})

router.post('/signup', function (req, res) {
    console.log(req.body)
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        })
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        })
    }
})

router.post('/authenticate', function (req, res) {
    User.findOne({name: req.body.name}, function (err, user) {
        if (err) {
            return res.json({success: false, msg: 'error'})
        }
        if (!user) {
            res.status(401).send({ msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var iat = new Date() / 1000
                    var exp = iat + jwtConfig.tokenExpirationTime;
                    var payload = {
                        aud: jwtConfig.audience,
                        iss: jwtConfig.issuer,
                        iat: exp,
                        sub: user.name
                    }
                    var token = jwt.encode(payload, jwtConfig.secret)
                    res.json({token: `JWT ${token}`})
                } else {
                    res.status(401).send({ msg: 'Authentication failed. Wrong password.'});
                }
            })
        }
    })
})

module.exports = router