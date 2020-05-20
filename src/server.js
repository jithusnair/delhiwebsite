import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import mongoose from 'mongoose';
import User from './_db/user';
import passport from 'passport';
import bodyParser from 'body-parser';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/DirectionDelhi', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(require('express-session')({
    secret: "I am great",
    resave: false,
    saveUninitialized:false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app
	.use(
		compression({ threshold: 0 }),
		express.static('static'),
		sapper.middleware(
			{
				session: (req, res) => {
					let user = req.user;
					if(user){
						let tar = JSON.parse(JSON.stringify(req.user))
						user = {...tar, _id: tar._id.toString()};
					};
					return {user: user}
				}
			}
		)
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
