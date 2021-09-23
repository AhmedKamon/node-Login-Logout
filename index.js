const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

dotenv.config();
//connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('mongoDB is connected'))
  .catch((err) => console.log(err));

//use
app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

//lisent
PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('backend is running on port:', PORT);
});
