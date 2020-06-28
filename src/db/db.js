const mongoose = require('mongoose');

const database = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(` MongoDB connected... ${db.connection.host}`);
    return db;
  } catch (error) {
    console.error(' Connection to database is failed!! ');
    process.exit(1)
  }
};

module.exports = database();
