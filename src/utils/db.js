const mongoose = require("mongoose");

exports.connectToDB = () => {
  const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
  let productionConnectString;
  if (DB_USER && DB_PASSWORD) {
    //  mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0-ay896.mongodb.net/test
    productionConnectString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;
  } else {
    productionConnectString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
  }

  mongoose.set("useFindAndModify", false);
  return mongoose.connect(productionConnectString, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};
