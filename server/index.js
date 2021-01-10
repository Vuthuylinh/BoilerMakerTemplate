const express = require('express')
const path = require('path')
const morgan = require('morgan')
// const compression = require('compression')
const session = require ("express-session")
const passport = require ("passport")


const  db = require('./db/database')
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
  secret:"a wild insecure secret",
  resave: false,
  saveUninitialized: false
}))



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
