const express = require('express')
const path = require('path')
const morgan = require('morgan')
// const compression = require('compression')
const  db = require('./db/database')
const session = require ("express-session")
const passport = require ("passport")
const User = require('./db/models/user')
// configure and create our database store to save session info in database even when we restart server
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const dbStore = new SequelizeStore({db:db});
// sync so that our session table gets created
dbStore.sync();

const app = express()
const PORT = process.env.PORT || 3000

module.exports = app

const createApp = () => {

// logging middleware
  app.use(morgan('dev'))

// body parsing middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET ||"a wild insecure secret",
  resave: false, //forces the session to be saved back to the session store
  saveUninitialized: false //forces a session that is “uninitialized” to be saved to the store
}))

//initialize passport so that it will consume our req.session object, and attach the user to the request object. Make sure to put this AFTER our session middleware!
app.use(passport.initialize());
app.use(passport.session());

//passport registration - to remember the user in our session store
passport.serializeUser((user,done)=>{
  try {
    done(null,user.id)  //done function takes care of supplying user credentials after user is authenticated successfully. This function attaches the email id to the request object so that it is available on the callback url as "req.user".
  } catch (err) {
    done(err)
  }
})
//to re-obtain the user from our database after user got serialized
passport.deserializeUser(async (id,done)=>{
  try {
   const user = await User.findByPk(id)
   done(null,user)
  } catch (error) {
    done(err)
  }

})
//api routes
app.use('/api', require('./api'))

// static middleware
app.use(express.static(path.join(__dirname, '../public')))

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})
}

const syncDb = () => db.sync()

const startListening =()=>{
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )
}

async function bootApp() {
  // await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}

if (require.main === module) {
  bootApp()
} else {
  createApp()
}
