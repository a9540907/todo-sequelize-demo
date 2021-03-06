const express = require('express')
const session = require('express-session')
const passport = require('passport')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')

// const usePassport = require('./config/passport')
// require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  // console.log(req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(routes)

// app.get('/', (req, res) => {
//   return Todo.findAll({
//     raw: true,
//     nest: true
//   })
//     .then((todos) => {
//       // console.log(todos)
//       return res.render('index', { todos: todos })
//     })
//     .catch((error) => { return res.status(422).json(error) })
// })


// app.get('/users/login', (req, res) => {
//   res.render('login')
// })

// app.post('/users/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/login'
// }))

// app.get('/users/register', (req, res) => {
//   res.render('register')
// })

// app.post('/users/register', (req, res) => {
//   const { name, email, password, confirmPassword } = req.body
//   User.findOne({ where: { email } }).then(user => {
//     if (user) {
//       console.log('User already exists')
//       return res.render('register', {
//         name,
//         email,
//         password,
//         confirmPassword
//       })
//     }
//     return bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(password, salt))
//       .then(hash => User.create({
//         name,
//         email,
//         password: hash
//       }))
//       .then(() => res.redirect('/'))
//       .catch(err => console.log(err))
//   })
// })

// app.get('/users/logout', (req, res) => {
//   res.send('logout')
// })


// app.get('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findByPk(id)
//     .then(todo => res.render('detail', { todo: todo.toJSON() }))
//     .catch(error => console.log(error))
// })


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})