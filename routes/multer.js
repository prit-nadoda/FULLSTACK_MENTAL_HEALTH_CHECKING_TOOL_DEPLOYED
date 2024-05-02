var multer = require("multer");
var {v4 : uuidv4} = require("uuid");
var path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/images/uploads");
    },
    filename: function(req, file, cb){
        var unique = uuidv4();
        cb(null, unique+path.extname(file.originalname));
    }
})

module.exports = multer({storage: storage})