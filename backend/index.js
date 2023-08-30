// import the necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import  auth_router  from './routes/auth.routes.js';
import  user_router from './routes/user.routes.js';
import shop_router from './routes/shop.routes.js';
import profile_router from './routes/profile.routes.js';
import product_router from './routes/product.routes.js';
import passport from './config/passport.js';
import session from 'express-session';
import path from 'path';
import NodeCache from 'node-cache';

export const myCache = new NodeCache();

// configure necessary modules
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI || "";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet(
  {
    crossOriginResourcePolicy: false,
  }
))
app.use(
    cors({
      origin: "http://localhost:5173",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
app.use(
    session({
      secret: "SECRET", // Replace with a more secure secret
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Set maxAge to 24 hours in milliseconds
    })
  );

  
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use("/", user_router)
app.use("/", auth_router)
app.use("/", shop_router)
app.use("/", profile_router)
app.use('/', product_router)

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error": err.name + ": " + err.message })
    } else if (err) {
        res.status(400).json({ "error": err.name + ": " + err.message })
        console.log(err)
    }
})

// connect to the database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error: ' + err);
});

// create a mock routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

export default app;