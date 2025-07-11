const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Username must be non-empty and unique
  return username && typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match any user in users array
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("Login request received")
  const { username, password } = req.body;
  if (!username || !password) {
    console.log("Username and password are required")
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    console.log("Invalid login. Check username and password.")
    return res.status(401).json({ message: "Invalid login. Check username and password." });
  }
  // Create JWT token
  let accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });
  console.log(accessToken)
  return res.status(200).json({ message: "Login successful!", token: accessToken });
});

// Middleware to ensure user is authenticated via JWT
function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
}

// Add or modify a book review (protected)
regd_users.put("/auth/review/:isbn", ensureAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }
  // Add or update review for this user only
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// Delete a book review (protected)
regd_users.delete("/auth/review/:isbn", ensureAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Review by user not found for this book" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
