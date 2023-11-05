const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const Game = require("./db/gameModel");
const Admin = require("./db/adminModel");
const dbConnect = require("./db/dbConnect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const auth = require("./auth");
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
// test
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

app.get("/games", function (request, response) {
  Game.find({}).then(function (game) {
    response.send(game);
  });
});

app.post("/find-test", function (request, response) {
  console.log("accessed");
  let game = "Honkai Star Rail";
  let serverName = "global";
  Game.findOne({ name: game, server: serverName })
    .then((game) => {
      if (!game) {
        console.log("Game doesn't exist");
        response.render("Error: Game doesn't exist");
      }
      response.json(game);
    })
    .catch((error) => {
      console.log(error);
      response.json(error);
    });
});
// login
app.post("/login", (request, response) => {
  Admin.findOne({ username: request.body.username })

    // if username exists
    .then((user) => {
      // compare the password entered and the hashed password found

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
          console.log("Login error");
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

app.post("/insert", (request, response) => {
  console.log(request.body.game);
  Game.updateOne(
    { name: request.body.game },
    {
      downloads: request.body.downloads,
      revenue: request.body.revenue,
      expandData: request.body.expandData,
    }
  )
    .then((game) => {
      response.json(game);
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error",
        error,
      });
    });
});

module.exports = app;
