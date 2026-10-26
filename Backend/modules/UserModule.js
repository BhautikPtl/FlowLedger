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
        type: String,
        trim: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        required: true,
        type: String,
        trim: true
    },
    password: {
        required: true,
        type: String,
        select: false
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
