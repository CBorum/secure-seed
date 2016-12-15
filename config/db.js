/**
 * Created by ChristopherBorum on 13/12/2016.
 */
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/secureseed', () => {
    console.log('mongodb connected')
})