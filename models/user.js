const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});


userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User", userSchema);