const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!username || !password) {
    console.log("Username and password are required")
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(user => user.username === username)) {
    console.log("Username already exists")
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  console.log(users)
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulate async with Promise.resolve
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    const book = await Promise.resolve(books[isbn]);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book by ISBN', error: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
    const filtered_books = await Promise.resolve(Object.values(books).filter(book => book.author === author));
    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by author', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  try {
    const filtered_books = await Promise.resolve(Object.values(books).filter(book => book.title === title));
    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by title', error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

