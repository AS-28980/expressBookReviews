const axios = require('axios');

async function getBooks() {
  try {
    const res = await axios.get('http://localhost:5000/');
    console.log('All books:', res.data);
  } catch (err) {
    console.error('Error fetching all books:', err.message);
  }
}

async function getBookByISBN(isbn) {
  try {
    const res = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Book with ISBN ${isbn}:`, res.data);
  } catch (err) {
    console.error(`Error fetching book by ISBN ${isbn}:`, err.message);
  }
}

async function getBooksByAuthor(author) {
  try {
    const res = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log(`Books by author '${author}':`, res.data);
  } catch (err) {
    console.error(`Error fetching books by author '${author}':`, err.message);
  }
}

async function getBooksByTitle(title) {
  try {
    const res = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log(`Books with title '${title}':`, res.data);
  } catch (err) {
    console.error(`Error fetching books by title '${title}':`, err.message);
  }
}

// Example usage:
(async () => {
  await getBooks();
  await getBookByISBN('1'); // Replace '1' with a valid ISBN from your booksdb.js
  await getBooksByAuthor('Author Name'); // Replace with a valid author
  await getBooksByTitle('Book Title'); // Replace with a valid title
})(); 