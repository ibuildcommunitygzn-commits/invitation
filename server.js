require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const apiRoutes = require('./routes/api');

const REQUIRED_ENV = [
  'BASE_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'SESSION_SECRET',
  'MNOTIFY_API_KEY',
  'MNOTIFY_SENDER_ID',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(
    `Warning: missing env vars: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`,
  );
}

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  }),
);

app.use('/api', apiRoutes);

// Everything else is the single-page site.
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Invitation site running on http://localhost:${PORT}`);
});
