const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const reminderController = require('./controllers/reminder_controller');
const { ensureAuthenticated, isAdmin } = require('./middleware/checkAuth');
const path = require('path');
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

const passport = require('./middleware/passport');
const authRoute = require('./routes/authRoute');
const indexRoute = require('./routes/indexRoute');

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log('Entire session object:');
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/auth/github', authRoute);
// Case 2: User goes to localhost:8080/reminder ----> shows a list of reminders.
app.use('/reminders', ensureAuthenticated, reminderController.reminder_list);

// Case 3: User wants to create a NEW reminder goes to ocalhost:8080/reminder/new
// ----> shows a CREATE REMINDER PAGE.
app.get('/reminder/new', ensureAuthenticated, reminderController.create_page);

// Case 4: User will send new reminder data to us(POST)
app.post('/reminder', ensureAuthenticated, reminderController.create);

// Case 5: User wants to see each reminder individually.
app.get('/reminder/:id', ensureAuthenticated, reminderController.listOne);

// Case 6: User wants to EDIT an individuale reminder.
app.get(
  '/reminder/:id/edit/:id',
  ensureAuthenticated,
  reminderController.edit_page
);

app.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

// Case 7: User clicks UPDATE BUTTON from case 6, and expects their reminder to be updated.
app.post('/reminder/edit/:id', ensureAuthenticated, reminderController.update);

// Case 8: User clicks DELETE btn and expect thr reminder to be deleted.
app.post(
  '/reminder/delete/:id',
  ensureAuthenticated,
  reminderController.delete
);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
