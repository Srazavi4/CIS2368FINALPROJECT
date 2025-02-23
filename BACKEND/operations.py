from datetime import datetime
import db
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

# Function to calculate late fee
def calculate_late_fee(borrowdate, returndate):
    if returndate:
        days_overdue = (returndate - borrowdate).days - 10
        if days_overdue > 0:
            return days_overdue * 1.0  # $1 per day
    return 0.0

# Book functions
# Viewing book function
def get_all_books():
    connection = db.get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    cursor.close()
    connection.close()
    return books

# Add book function
def add_book(title, author, genre):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO books (title, author, genre, status) VALUES (%s, %s, %s, %s)",
        (title, author, genre, 'available')
    )
    connection.commit()
    cursor.close()
    connection.close()

# Update book function
def update_book(id, title, author, genre, status):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE books SET title = %s, author = %s, genre = %s, status = %s WHERE id = %s",
        (title, author, genre, status, id)
    )
    connection.commit()
    cursor.close()
    connection.close()

# Delete book function
def delete_book(id):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM books WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()

# Customer Functions
# Viewing customer function
def get_all_customers():
    connection = db.get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers")
    customers = cursor.fetchall()
    cursor.close()
    connection.close()
    return customers

# Add customer function
def add_customer(firstname, lastname, email, passwordhash):
    hashed_password = generate_password_hash(passwordhash, method='sha256')
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO customers (firstname, lastname, email, passwordhash) VALUES (%s, %s, %s, %s)",
        (firstname, lastname, email, hashed_password)
    )
    connection.commit()
    cursor.close()
    connection.close()

# Update customer function
def update_customer(id, firstname, lastname, email, passwordhash):
    hashed_password = generate_password_hash(passwordhash, method='sha256')
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE customers SET firstname = %s, lastname = %s, email = %s, passwordhash = %s WHERE id = %s",
        (firstname, lastname, email, hashed_password, id)
    )
    connection.commit()
    cursor.close()
    connection.close()

# Delete customer function
def delete_customer(id):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM customers WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    connection.close()

# Verify customer login
def verify_customer(email, password):
    connection = db.get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customers WHERE email = %s", (email,))
    customer = cursor.fetchone()
    cursor.close()
    connection.close()

    if customer and check_password_hash(customer['passwordhash'], password):
        return True
    return False

# Borrowing functions
# Viewing borrowings function
def get_all_borrowings():
    connection = db.get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM borrowingrecords")
    borrowings = cursor.fetchall()
    cursor.close()
    connection.close()
    return borrowings

# Borrowing book function
def borrow_book(book_id, customer_id, borrow_date):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO borrowingrecords (bookid, customerid, borrowdate) VALUES (%s, %s, %s)",
        (book_id, customer_id, borrow_date)
    )
    cursor.execute("UPDATE books SET status = 'unavailable' WHERE id = %s", (book_id,))
    connection.commit()
    cursor.close()
    connection.close()

# Returning book function
def return_book(borrowing_id, return_date):
    connection = db.get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM borrowingrecords WHERE id = %s", (borrowing_id,))
    borrowing = cursor.fetchone()
    if not borrowing:
        cursor.close()
        connection.close()
        return False

    # Calculates late fee
    late_fee = calculate_late_fee(borrowing['borrowdate'], return_date)

    # Updates borrowing record
    cursor.execute(
        "UPDATE borrowingrecords SET returndate = %s, late_fee = %s WHERE id = %s",
        (return_date, late_fee, borrowing_id)
    )
    cursor.execute("UPDATE books SET status = 'available' WHERE id = %s", (borrowing['bookid'],))
    connection.commit()
    cursor.close()
    connection.close()
    return True
