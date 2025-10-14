import 'dotenv/config';

import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import morgan from 'morgan';

import { handleRegister } from './Controllers/register.js';
import { signinAuthentication } from './Controllers/signin.js';
import { handleProfileGet, handleProfileUpdate } from './Controllers/profile.js';
import { handleImage, handleApiCall } from './Controllers/image.js';
import { requireAuth } from './Controllers/authorization.js';

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
});

const app = express();

// Allow localhost during development and the deployed frontend origin
const whitelist = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://face-recognition-backed-deploy.onrender.com'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(morgan('combined'));
app.use(express.json());
app.use(cors(corsOptions));


app.post('/signin', signinAuthentication(db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', requireAuth, (req, res) => handleProfileGet(req, res, db));
app.post('/profile/:id', requireAuth, (req, res) => handleProfileUpdate(req, res, db));

app.put('/image', requireAuth, (req, res) => handleImage(req, res, db));
app.post('/imageurl', requireAuth, (req, res) => handleApiCall(req, res));

// Start server
app.listen(3000, () => {
    console.log('app is running on port 3000');
});
