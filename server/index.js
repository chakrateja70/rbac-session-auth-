import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import pkg from 'bcryptjs';
const { genSalt, hash, compare } = pkg;
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { secure: false } 
}));


connect('mongodb://localhost:27017/rbac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new Schema({
  username: String,
  password: String,
  role: String,
});

const User = model('User', userSchema);

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Access denied' });
  }
  next();
};


const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};


app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = new User({ username, password: hashedPassword, role });
  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const validPassword = await compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

  req.session.user = { id: user._id, role: user.role };
  res.json({ message: 'Logged in' });
});


app.get('/getUserRole', authMiddleware, (req, res) => {
  if (req.session.user) {
    res.json({ role: req.session.user.role });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.get('/data', authMiddleware, roleMiddleware(['manager', 'teamleader', 'user']), (req, res) => {
  res.json({ message: 'Read data' });
});

app.post('/data', authMiddleware, roleMiddleware(['manager', 'teamleader']), (req, res) => {
  res.json({ message: 'Write data' });
});

app.put('/data', authMiddleware, roleMiddleware(['manager', 'teamleader']), (req, res) => {
  res.json({ message: 'Modify data' });
});

app.delete('/data', authMiddleware, roleMiddleware(['manager']), (req, res) => {
  res.json({ message: 'Delete data' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
