const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
require("dotenv").config();

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
// mongoose
//   .connect(`${process.env.MONGO_URI}`, {
//     dbName: "PSYCHECK_EJS_DEPLOYED",
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "PSYCHECK_EJS_DEPLOYED",
//     serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileimage: {
    type: String,
    default: "default.png",
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },
  ],
  usertype: { type: String, enum: ["user", "admin"], default: "user" },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contacts",
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
