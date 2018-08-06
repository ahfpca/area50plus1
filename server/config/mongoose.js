console.log("1--- Mongoose Set");

module.exports = (db_name) => {

    var mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost/' + db_name);
}
