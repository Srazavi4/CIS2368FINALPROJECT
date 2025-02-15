from datetime import datetime
import db

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
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO customers (firstname, lastname, email, passwordhash) VALUES (%s, %s, %s, %s)",
        (firstname, lastname, email, passwordhash)
    )
    connection.commit()
    cursor.close()
    connection.close()

# Update customer function
def update_customer(id, firstname, lastname, email, passwordhash):
    connection = db.get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE customers SET firstname = %s, lastname = %s, email = %s, passwordhash = %s WHERE id = %s",
        (firstname, lastname, email, passwordhash, id)
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
