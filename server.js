const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

if (process.env.NODE_ENV === 'production')
  console.log('You are working on Production environment');
else console.log('You are working on Development environment');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const dbLocal = process.env.DATABASE_LOCAL;

mongoose

  // For Local DB
  // .connect(dbLocal, {
  // For AWS
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to AWS MongoDB...✔️'))
  .catch((err) => {
    console.error('Failed to connect with AWS MongoDB...❌ =>', err.message);
    server.close(() => process.exit(1));
  });

const app = require('./app');

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated.');
  });
});
