let bookMap = {};      
let customerMap = {};  

document.addEventListener('DOMContentLoaded', async function () {
    await loadBooksDropdown();
    await loadCustomersDropdown();
    console.log("Book Map after loading:", bookMap);
    console.log("Customer Map after loading:", customerMap);
    await loadBorrowings();
    await loadReturnBorrowingsDropdown();
});

// handle borrow form submission
document.getElementById('borrow-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const bookid = document.getElementById('borrow-book').value;
    const customerid = document.getElementById('borrow-customer').value;
    const borrowdate = document.getElementById('borrow-date').value;

    await axios.post('http://localhost:5000/borrow', {
        bookid,
        customerid,
        borrowdate
    });

    alert('Book borrowed successfully!');
    await loadBooksDropdown();
    await loadCustomersDropdown();
    await loadBorrowings();
    await loadReturnBorrowingsDropdown();
    this.reset();
});

// handles return form submission
document.getElementById('return-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const borrowingId = document.getElementById('return-borrowing').value;
    const returnDate = document.getElementById('return-date').value;

    if (!borrowingId || !returnDate) {
        alert('Please select a borrowing record and return date.');
        return;
    }

    await axios.post('http://localhost:5000/return', {
        id: borrowingId,
        returndate: returnDate
    });

    alert('Book returned successfully!');
    await loadBooksDropdown();
    await loadCustomersDropdown();
    await loadBorrowings();
    await loadReturnBorrowingsDropdown();
    this.reset();
});

// load and display borrowings
async function loadBorrowings() {
    console.log("Fetching borrowings...");
    const res = await axios.get('http://localhost:5000/borrowings');
    const borrowings = res.data;
    console.log("Borrowings Loaded:", borrowings);

    const borrowingsList = document.getElementById('borrowings-list');
    borrowingsList.innerHTML = '';

    if (borrowings.length > 0) {
        const ul = document.createElement('ul');
        borrowings.forEach(borrow => {
            console.log("Checking Borrow:", borrow);

            const bookName = bookMap[borrow.bookid] || "Unknown Book";
            const customerName = customerMap[borrow.customerid] || "Unknown Customer";

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${bookName}</strong> borrowed by 
                <strong>${customerName}</strong> 
                on ${borrow.borrowdate}
                ${borrow.returndate ? `, Returned on ${borrow.returndate}` : ''}
                ${borrow.late_fee ? `, Late Fee: $${borrow.late_fee}` : ''}
            `;
            ul.appendChild(li);
        });
        borrowingsList.appendChild(ul);
    } else {
        borrowingsList.innerHTML = '<p>No borrowings recorded.</p>';
    }
}

// load available books
async function loadBooksDropdown() {
    const res = await axios.get('http://localhost:5000/books');
    const books = res.data;
    const borrowBookSelect = document.getElementById('borrow-book');
    borrowBookSelect.innerHTML = '';

    books.forEach(book => {
        if (book.status === 'available') {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} by ${book.author}`;
            borrowBookSelect.appendChild(option);

            bookMap[book.id] = `${book.title} by ${book.author}`; 
        }
    });
}

// load customers 
async function loadCustomersDropdown() {
    const res = await axios.get('http://localhost:5000/customers');
    const customers = res.data;
    const borrowCustomerSelect = document.getElementById('borrow-customer');
    borrowCustomerSelect.innerHTML = '';

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.firstname} ${customer.lastname}`;
        borrowCustomerSelect.appendChild(option);

        customerMap[customer.id] = `${customer.firstname} ${customer.lastname}`; 
    });
}

// load active borrowings 
async function loadReturnBorrowingsDropdown() {
    const res = await axios.get('http://localhost:5000/borrowings');
    const borrowings = res.data;
    const returnSelect = document.getElementById('return-borrowing');
    returnSelect.innerHTML = '';

    borrowings.forEach(borrow => {
        if (!borrow.returndate) {
            const bookName = bookMap[borrow.bookid] || "Unknown Book";
            const customerName = customerMap[borrow.customerid] || "Unknown Customer";

            const option = document.createElement('option');
            option.value = borrow.id;
            option.textContent = `${bookName} borrowed by ${customerName} on ${borrow.borrowdate}`;
            returnSelect.appendChild(option);
        }
    });

    if (returnSelect.innerHTML === '') {
        const option = document.createElement('option');
        option.textContent = 'No active borrowings';
        option.disabled = true;
        returnSelect.appendChild(option);
    }
}
