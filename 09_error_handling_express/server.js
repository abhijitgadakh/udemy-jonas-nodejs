const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, ': ', err.message);
  console.log('Unhandled Exception!!! Shutting down...');
  process.exit(1);
});

const app = require('./app');
const { default: mongoose } = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected.'))
  .catch((err) => console.error('DB Connection Error:', err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('listening to port: ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection!!! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
