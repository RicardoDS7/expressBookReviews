const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    valid_user = users.some((user) => user.username === username);
    console.log(valid_user);
    return valid_user;
}

const authenticatedUser = (username,password)=>{ 

    if (isValid(username)) {
        passwordValid = users.find((user) => user.password === password);
        return !!passwordValid;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
  } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
