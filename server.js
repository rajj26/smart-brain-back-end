const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controller/register.js');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image.js');

const db = knex({
	client: 'pg',
	connection: {
	  connectionString : process.env.DATABASE_URL,
	  ssl : {rejectUnauthorized: false},
	  host : process.env.DATABASE_HOST,
	  port : 5432,
	  user : process.env.DATABASE_USER,
	  password : process.env.DATABASE_PASS,
	  database : process.env.DATABASE_DB
	}
  });


const app = express();

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
	res.send('success');
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)} )  //this is called dependency injection
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})