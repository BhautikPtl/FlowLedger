const express = require('express');
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const {
    verifyToken,
    IsloggedIn,
    adminOnly
} = require('./middleware/protected');

dotenv.config();
const User = require('./modules/UserModule');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing in .env file');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5555',
    'http://127.0.0.1:5555'
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true
}));

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
};

const createToken = (currentUser) => {
    return jwt.sign(
        {
            id: currentUser._id.toString(),
            role: currentUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const isBcryptHash = (value) => (
    typeof value === 'string' &&
    /^\$2[aby]\$\d{2}\$/.test(value)
);

const verifyPassword = async (user, password) => {
    if (isBcryptHash(user.password)) {
        return bcrypt.compare(password, user.password);
    }

    if (user.password === password) {
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        return true;
    }

    return false;
};

app.get('/', (req, res) => {
    res.json({ message: 'Server Running' });
});

app.post('/register', async (req, res) => {
    try {
        const username = String(req.body.username || '').trim();
        const name = String(req.body.name || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        if (!username || !name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const oldUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (oldUser) {
            return res.status(409).json({
                message: 'Email or username already exists'
            });
        }

        const count = await User.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username: username.trim(),
            name: name.trim(),
            email,
            password: hashedPassword,
            role: count === 0 ? 'sadmin' : 'member',
            accountNumber: Math.floor(
                10000000 + Math.random() * 90000000
            )
        });

        res.cookie('token', createToken(newUser), cookieOptions);

        const safeUser = newUser.toObject();
        delete safeUser.password;

        res.status(201).json({
            message: 'User successfully created',
            user: safeUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const foundUser = await User.findOne({ email }).select('+password');

        const passwordMatches = foundUser
            ? await verifyPassword(foundUser, password)
            : false;

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        res.cookie('token', createToken(foundUser), cookieOptions);

        const safeUser = foundUser.toObject();
        delete safeUser.password;

        res.status(200).json({
            message: 'Login successful',
            user: safeUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path
    });
    res.json({ message: 'Logout successful' });
});

app.get('/me', verifyToken, IsloggedIn, (req, res) => {
    res.json({ user: req.currentUser });
});

const dashboardHandler = (req, res) => {
    res.json({ message: 'Welcome' });
};

app.route('/dashboard')
    .get(verifyToken, IsloggedIn, dashboardHandler)
    .post(verifyToken, IsloggedIn, dashboardHandler);

const superAdminHandler = (req, res) => {
    res.json({ message: 'Welcome super admin' });
};

app.route('/superadmindashboard')
    .get(verifyToken, IsloggedIn, adminOnly, superAdminHandler)
    .post(verifyToken, IsloggedIn, adminOnly, superAdminHandler);

app.use((error, req, res, next) => {
    if (error.message === 'Origin is not allowed by CORS') {
        return res.status(403).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});