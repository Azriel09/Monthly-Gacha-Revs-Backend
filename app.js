const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const dbConnect = require("./db/dbConnect");
const cors = require("cors");
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
// app.post("/register", (request, response) => {
//   // hash the password
//   bcrypt
//     .hash(request.body.password, 10)
//     .then((hashedPassword) => {
//       // create a new user instance and collect the data
//       const user = new User({
//         name: request.body.name,
//         email: request.body.email,
//         password: hashedPassword,
//       });

//       // save the new user
//       user
//         .save()
//         // return success if the new user is added to the database successfully
//         .then((result) => {
//           response.status(201).send({
//             message: "User Created Successfully",
//             result,
//           });
//         })
//         // catch erroe if the new user wasn't added successfully to the database
//         .catch((error) => {
//           response.status(500).send({
//             message: "Error creating user",
//             error,
//           });
//         });
//     })
//     // catch error if the password hash isn't successful
//     .catch((e) => {
//       response.status(500).send({
//         message: "Password was not hashed successfully",
//         e,
//       });
//     });
// });

// login
// app.post("/login", (request, response) => {
//   // check if email exists
//   const rem = request.body.remember;
//   User.findOne({ email: request.body.email })

//     // if email exists
//     .then((user) => {
//       // compare the password entered and the hashed password found
//       console.log(user.id);
//       bcrypt
//         .compare(request.body.password, user.password)

//         // if the passwords match
//         .then((passwordCheck) => {
//           // check if password matches
//           if (!passwordCheck) {
//             return response.status(400).send({
//               message: "Passwords does not match",
//               error,
//             });
//           }

//           function expiree() {
//             if (request.body.remember == true) {
//               return "30d";
//             } else {
//               return "1h";
//             }
//           }
//           console.log(expiree());
//           //   create JWT token
//           const token = jwt.sign(
//             {
//               userId: user._id,
//               userEmail: user.email,
//             },
//             "RANDOM-TOKEN",

//             { expiresIn: expiree() }
//           );

//           //   return success response
//           response.status(200).send({
//             message: "Login Successful",
//             email: user.email,
//             token,
//           });
//         })
//         // catch error if password does not match
//         .catch((error) => {
//           response.status(400).send({
//             message: "Passwords does not match",
//             error,
//           });
//         });
//     })
//     // catch error if email does not exist
//     .catch((e) => {
//       response.status(404).send({
//         message: "Email not found",
//         e,
//       });
//     });
// });

// app.get("/", (request, response) => {
//   console.log(request);
//   Symbols.find({ id: { $gte: 0 } }).then((data) => {
//     response.json({ data });
//   });
// });

// free endpoint
// app.get("/free-endpoint", (request, response) => {
//   response.json({ message: "You are free to access me anytime" });
// });

// authentication endpoint
// app.get("/auth-endpoint", auth, (request, response) => {
//   const id = request.user.userId;
//   const selected = request.headers.currency;

//   if (selected) {
//     User.findOneAndUpdate(
//       { email: request.user.userEmail },
//       { $set: { rates: selected } },
//       { new: true }
//     )
//       .then((user) => {
//         response.json(user.rates);
//       })
//       // catch erroe if the new user wasn't added successfully to the database
//       .catch((error) => {
//         response.status(500).send({
//           message: "Error",
//           error,
//         });
//       });
//   } else {
//     User.findOne({ email: request.user.userEmail })
//       .then((user) => {})
//       // catch erroe if the new user wasn't added successfully to the database
//       .catch((error) => {
//         response.status(500).send({
//           message: "Error",
//           error,
//         });
//       });
//   }
// });

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
