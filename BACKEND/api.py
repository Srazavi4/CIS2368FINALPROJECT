from flask import Flask
from flask import request
from flask import jsonify
from datetime import datetime
from operations import *

app = Flask(__name__)

# API for Books
@app.route('/books', methods=['GET']) #Shows all books
def get_books():
    books = get_all_books()
    return jsonify(books)

@app.route('/books', methods=['POST']) #Adds books
def add_book_route():
    data = request.json
    add_book(data['title'], data['author'], data['genre'])
    return jsonify({'message': 'Book added successfully!'}), 201

@app.route('/books/<int:id>', methods=['PUT']) #Updated books
def update_book_route(id):
    data = request.json
    update_book(id, data.get('title'), data.get('author'), data.get('genre'), data.get('status'))
    return jsonify({'message': 'Book updated successfully!'})

@app.route('/books/<int:id>', methods=['DELETE']) #Deletes books
def delete_book_route(id):
    delete_book(id)
    return jsonify({'message': 'Book deleted successfully!'})

# API for Customers 
@app.route('/customers', methods=['GET']) #Shows all customers
def get_customers():
    customers = get_all_customers()
    return jsonify(customers)

@app.route('/customers', methods=['POST']) #Adds customers
def add_customer_route():
    data = request.json
    add_customer(data['firstname'], data['lastname'], data['email'], data['passwordhash'])
    return jsonify({'message': 'Customer added successfully!'}),

@app.route('/customers/<int:id>', methods=['PUT']) #Updated customers
def update_customer_route(id):
    data = request.json
    update_customer(id, data.get('firstname'), data.get('lastname'), data.get('email'), data.get('passwordhash'))
    return jsonify({'message': 'Customer updated successfully!'})

@app.route('/customers/<int:id>', methods=['DELETE']) #Deletes Customers
def delete_customer_route(id):
    delete_customer(id)
    return jsonify({'message': 'Customer deleted successfully!'})

# API for Borrowing


if __name__ == '__main__':
    app.run(debug=True)