// Import express
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mainRoutes = require('./routes/mainRoutes');
const apiRoutes = require('./routes/apiRoutes');
const quizRoutes = require('./routes/quizRoutes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const authMiddleware = require('./middleware/authMiddleware');

// Create an instance of express
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
mongoose.connect('mongodb+srv://zholaman223:SeqevtFE4u9dotdv@cluster0.rgbcvam.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Session configuration
app.use(session({
    secret: 'your-random-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true for HTTPS
}));

app.use(express.static(__dirname + '/public/'));

// Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/quiz', quizRoutes);
app.use(authMiddleware);
app.use((req, res, next) => {
    console.log(req.url);
    next();
});
// Define the port to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
