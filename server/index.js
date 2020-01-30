require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = './controllers/authController.js';
const treasureCtrl = './controllers/treasureController.js';
const auth = require('./middleware/authMiddleware');

const app = express()
const {SESSION_SECRET, CONNECTION_STRING} = process.env;
const port = 4000;

app.use(express.json());

//endpoints
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly,treasureCtrl.getAllTreasure)

massive(CONNECTION_STRING).then(db =>{
    app.set('db', db);
    console.log('db connected')
    app.listen(port, ()=> console.log(`Listening on port ${port}`))
})

app.use(
    session({
        resave: true, 
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)
