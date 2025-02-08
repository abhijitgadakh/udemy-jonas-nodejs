const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs = require('fs');

const Tour = require('../../models/tourModel');

const { default: mongoose } = require('mongoose');
const { Console } = require('console');

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

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log('Data Successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
// deleteData();
// importData();
