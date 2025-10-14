// Controllers/signin.js
import jwt from 'jsonwebtoken';
import redis from 'redis';

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const signToken = (username) =>
    jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2d' });

const setToken = async (key, value) => {
    await redisClient.set(key, value);
};

const createSession = async (user) => {
    const { email, id } = user;
    const token = signToken(email);
    await setToken(token, id.toString());
    return { success: "true", userId: id, token, user };
};

const handleSigninCore = async (db, bcrypt, email, password) => {
    const rows = await db('login').select('email', 'hash').where({ email });
    if (!rows.length) throw new Error('wrong credentials');
    const isValid = bcrypt.compareSync(password, rows[0].hash);
    if (!isValid) throw new Error('wrong credentials');
    const user = await db('users').select('*').where({ email });
    return user[0];
};

const getAuthTokenId = async (req, res) => {
    const { authorization } = req.headers;
    const id = await redisClient.get(authorization);
    if (!id) return res.status(401).json('Unauthorized');
    return res.json({ id });
};

const signinAuthentication = (db, bcrypt) => async (req, res) => {
    const { authorization } = req.headers;

    if (authorization) {
        return getAuthTokenId(req, res);
    }

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json('incorrect form submission');

    try {
        const user = await handleSigninCore(db, bcrypt, email, password);
        const session = await createSession(user);
        return res.json(session); // { success: "true", token, userId, user }
    } catch (e) {
        return res.status(400).json('wrong credentials');
    }
};

export { signinAuthentication, redisClient };
