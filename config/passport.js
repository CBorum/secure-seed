/**
 * Created by ChristopherBorum on 13/12/2016.
 */
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jwt-simple')

var User = require('../models/user')
var jwtConfig = require('../config/jwtconfig')

module.exports = function (passport) {
    var opts = {}
    opts.secretOrKey = jwtConfig.secret
    opts.issuer = jwtConfig.issuer
    opts.audience = jwtConfig.audience
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload)
        User.findOne({id: jwt_payload.id}, function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    }))
}