import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import mongoose from 'mongoose';
import User from './_db/user';
import session from 'express-session';
import passport from 'passport';

const MongoStore = require('connect-mongo')(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

mongoose.set('useFindAndModify', false);

mongoose.connect( 
	process.env.MONGODB_ATLAS_CONNECTION_URI, 
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection
	.once('open', ()=> console.log('Connected to database'))
	.on('error', error => {
		console.log('Connection Error', error)
	})

const app = express();

app.use(express.static('static'))

app.use(express.json());
app.use(express.urlencoded());

const sessionStore = new MongoStore({
	mongooseConnection: mongoose.connection,
	collection: 'sessions',
	autoRemove: 'interval',
	autoRemoveInterval: 0.1 
	// check every 10 minutes for outdated sessions and delete them
});

app.use(session({
    secret: "I am great",
    resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 // expires after 1 day 
	}
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app
	.use(
		compression({ threshold: 0 }),
		sapper.middleware(
			{
				session: (req, res) => {
					let user = req.user;
					if(user){
						let tar = JSON.parse(JSON.stringify(req.user))
						user = {
							_id: tar._id.toString(), 
							fullname: tar.fullname,
							isVerified: tar.isVerified,
							isAdmin: tar.isAdmin
						};
					};
					// res.setHeader('cache-control', 'no-cache, no-store');
					return {user: user}
				}
			}
		)
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
