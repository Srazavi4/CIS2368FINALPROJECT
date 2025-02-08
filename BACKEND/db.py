import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
            host="cis2368spring.cvucss6moz7l.us-east-2.rds.amazonaws.com",
            user="Srazavi4",
            password="Butterfly@58",
            database="cis2368spring"
    )