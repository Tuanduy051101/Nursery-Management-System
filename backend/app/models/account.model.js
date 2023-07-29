const mongoose = require("mongoose");

const accountModel = new mongoose.Schema({
    name: {
        type: "string",
    },
    password: {
        type: "string",
    },
    role: {
        type: "string",
    },
});

module.exports = mongoose.model('Account', accountModel);