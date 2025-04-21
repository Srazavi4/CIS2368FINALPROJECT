document.addEventListener('DOMContentLoaded', function () {
    loadBooks();

    // handles adding a new book
    document.getElementById('book-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const genre = document.getElementById('book-genre').value;

        // post request to add new book
        await axios.post('http://localhost:5000/books', {
            title,
            author,
            genre,
            status: 'available'
        });

        loadBooks();
        this.reset();
    });
});

// loads all books
async function loadBooks() {
    const res = await axios.get('http://localhost:5000/books');
    const books = res.data;
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';

    books.forEach(book => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${book.title}</strong> by ${book.author} (${book.genre})
            [${book.status}]
            <button onclick="deleteBook(${book.id})">Delete</button>
        `;
        booksList.appendChild(div);
    });
}

// deletes a book
async function deleteBook(id) {
    await axios.delete(`http://localhost:5000/books/${id}`);
    loadBooks();
}