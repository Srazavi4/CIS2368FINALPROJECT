from flask import Flask
from flask import request
from flask import jsonify
from datetime import datetime
from operations import *

app = Flask(__name__)

# CRUD for Books
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

#CRUD for Customers 


#CRUD for Borrowing


if __name__ == '__main__':
    app.run(debug=True)