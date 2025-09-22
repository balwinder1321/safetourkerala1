from flask import Flask, render_template, request, redirect, url_for, session
import smtplib
from email.mime.text import MIMEText
import mysql.connector

app = Flask(__name__)
app.secret_key = "yoursecretkey"  # Required for session storage

# Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="ballu5252",
        database="smarttour"
    )

# Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        unique_id = request.form['unique_id']
        password = request.form['password']

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE unique_id=%s AND password=%s", (unique_id, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['unique_id'] = user['unique_id']  # Save user ID in session
            return redirect(url_for('dashboard.html'))
        else:
            return "Invalid Credentials"
    return render_template('login.html')

# Dashboard Page
@app.route('/dashboard')
def dashboard():
    if 'unique_id' in session:
        return render_template('dashboard.html', user_id=session['unique_id'])
    else:
        return redirect(url_for('login.html'))
