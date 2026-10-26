const express = require('express');
const app = express();
const user = require('./modules/UserModule');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(cors({ origin: ['http://localhost:5555'] }));

app.get('/', (req, res) => {
    res.json({ message: "Server Running" });
});

app.post('/register', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;


        const oldUser = await user.findOne({ email: email });
        if (oldUser) {
            return res.status(400).json({ Message: "Already using this email" });
        }


        const count = await user.countDocuments({});
        const role = count === 0 ? 'sadmin' : 'member';

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await user.create({
            username,
            name,
            email,
            password: hashedPassword,
            role: role
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );


        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000,

        });


        const withoutPasswordUser = await user.findById(newUser._id).select('-password');

        return res.status(201).json({
            Message: "User Successfully Created",
            newUser: withoutPasswordUser
        });

    } catch (error) {
        return res.status(500).json({ Message: "Server Error", error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
