const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connect");
    })
    .catch((error) => {
        console.log(error);
    });

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    accountNumber: {
        required: true,
        type: Number
    },
    role: {
        type: String,
        enum: ["member", "manager", "sadmin", "oadmin"],
        default: "member"
    }
});

module.exports = mongoose.model("Member", UserSchema);
