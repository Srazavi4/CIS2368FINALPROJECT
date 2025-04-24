document.addEventListener('DOMContentLoaded', async function () {
    await loadBooks();
    await loadUpdateBookDropdown();

    // handles adding a new book
    document.getElementById('book-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const genre = document.getElementById('book-genre').value;

        await axios.post('http://localhost:5000/books', {
            title,
            author,
            genre,
            status: 'available'
        });

        await loadBooks();
        await loadUpdateBookDropdown();
        this.reset();
    });

    // prefill update form when a book is selected
    document.getElementById('update-book-id').addEventListener('change', async function () {
        const id = this.value;
        if (!id) return;

        const res = await axios.get('http://localhost:5000/books');
        const book = res.data.find(b => b.id == id);

        document.getElementById('update-title').value = book.title;
        document.getElementById('update-author').value = book.author;
        document.getElementById('update-genre').value = book.genre;
        document.getElementById('update-status').value = book.status;
    });

    // handles updating a book
    document.getElementById('update-book-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('update-book-id').value;
        const title = document.getElementById('update-title').value;
        const author = document.getElementById('update-author').value;
        const genre = document.getElementById('update-genre').value;
        const status = document.getElementById('update-status').value;

        await axios.put(`http://localhost:5000/books/${id}`, {
            title,
            author,
            genre,
            status
        });

        alert('Book updated successfully!');
        this.reset();
        await loadBooks();
        await loadUpdateBookDropdown();
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
    await loadBooks();
    await loadUpdateBookDropdown();
}

// loads books into update dropdown
async function loadUpdateBookDropdown() {
    const res = await axios.get('http://localhost:5000/books');
    const books = res.data;
    const updateBookSelect = document.getElementById('update-book-id');
    updateBookSelect.innerHTML = '<option value="">Select book to update</option>';

    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        updateBookSelect.appendChild(option);
    });
}