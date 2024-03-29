var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(next) {
    var user = this
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

UserSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return callback(err)
        }
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema);