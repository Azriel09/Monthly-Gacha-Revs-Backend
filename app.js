const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const Games = require("./db/gameModel");
const Admin = require("./db/adminModel");
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const db = dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new Admin({
        username: request.body.username,

        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});
app.get("/test", (request, response) => {
  console.log(request);
  response.json({ message: "You are free to access me anytime" });
});

app.get("/games", function (req, res) {
  Games.find({}).then(function (game) {
    res.send(game);
  });
});

// login
app.post("/login", (request, response) => {
  // check if email exists
  const rem = request.body.remember;
  User.findOne({ username: request.body.username })

    // if username exists
    .then((user) => {
      // compare the password entered and the hashed password found
      console.log(user.id);
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          function expiree() {
            if (request.body.remember == true) {
              return "30d";
            } else {
              return "1h";
            }
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userUsername: user.username,
            },
            "RANDOM-TOKEN",

            { expiresIn: "7d" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            username: user.username,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// app.get("/account", auth, (request, response) => {
//   console.log("accessed account");

//   User.findOne({ email: request.user.userEmail })
//     .then((user) => {
//       response.json({ email: user.email, name: user.name });
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// });

// app.get("/dashboard", auth, (request, response) => {
//   console.log("accessed dashboard");

//   User.findOne({ email: request.user.userEmail })
//     .then((user) => {
//       console.log(user.rates);
//       response.json(user.rates);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
// });

module.exports = app;
