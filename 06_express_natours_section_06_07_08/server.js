const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
app.listen(port, () => {
  console.log('listening to port: ' + port);
});
