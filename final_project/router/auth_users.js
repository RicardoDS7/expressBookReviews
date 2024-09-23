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

  console.log(users);
  // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60 });

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
  let active_user = req.session.authorization.username;
  let isbn = req.params.isbn;
  let review = req.query.review;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  books[isbn].reviews[active_user] = review;

  return res.status(200).json({message: "Review added successfully!"})
});

//Delete Review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let active_user = req.session.authorization.username;
    let isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
      }
    
      delete books[isbn].reviews[active_user]
    
      return res.status(200).json({message: "Review deleted successfully!"})

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
