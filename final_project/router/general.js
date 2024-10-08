const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const {username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
        users.push({ username, password});
        console.log(users);
        return res.status(200).json({ message: `${username} is registered successfully!`});
    } else {
        return res.status(403).json({ message: `${username} already exists`});
    }
  } else {
    return res.status(403).json({ message: "Please enter a username and password!"});
  }
});

// Get Books
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books); 
    });
};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks()
        .then(response => {
            res.status(200).json(response);  
        })
        .catch(error => {
            res.status(500).json({ message: 'Error fetching books', error: error.message });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;

    getBooks()
    .then(booksData => {
        if (booksData[isbn]) {
            res.send(JSON.stringify(booksData[isbn],null,4));
        } else {
            return res.status(404).json({message: "ISBN not found!"});
        }

    })
    .catch(errpr => {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
    
    
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    // Debugging logs
    console.log('Requested author:', author);

    getBooks()
    .then(booksData => {   
        author_isbns = Object.keys(booksData).filter((isbn) => booksData[isbn].author === author);

        if (author_isbns.length > 0) {
            let author_books = author_isbns.map(isbn => booksData[isbn]);


            return res.status(200).json(author_books);
        } else {
            return res.status(404).json({message: "Author not found!"});
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    let title = req.params.title;

    getBooks()
    .then(booksData => {
    title_isbns = Object.keys(booksData).filter((isbn) => booksData[isbn].title === title);

    if (title_isbns.length > 0) {
        let book_titles = title_isbns.map(isbn => booksData[isbn]);


        return res.status(200).json(book_titles);
    } else {
        return res.status(404).json({message: "Title not found!"});
    }
    })
    .catch(error => {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    let isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
});

module.exports.general = public_users;
