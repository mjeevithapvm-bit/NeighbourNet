"""
Simple MySQL connection helpers for the prototype.
- Uses mysql-connector-python (synchronous).
- Reads connection settings from environment variables with sensible defaults.
- Provides `get_connection()` and small helpers for queries.

Implemented: basic connect/execute/fetch helpers.
Conceptual: connection pooling / ORM (not used here) are omitted for simplicity.
"""
import os
import mysql.connector
from mysql.connector import Error

DB_HOST = os.environ.get("NN_DB_HOST", "127.0.0.1")
DB_PORT = int(os.environ.get("NN_DB_PORT", 3306))
DB_USER = os.environ.get("NN_DB_USER", "root")
DB_PASS = os.environ.get("NN_DB_PASS", "")
DB_NAME = os.environ.get("NN_DB_NAME", "neighbournet")


def get_connection():
    """Return a new MySQL connection. Caller must close it."""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            autocommit=True,
        )
        return conn
    except Error as e:
        # For prototype, print error and re-raise
        print("DB connection error:", e)
        raise


def fetch_all(query, params=None):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(query, params or [])
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def fetch_one(query, params=None):
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(query, params or [])
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row


def execute(query, params=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(query, params or [])
    last_id = cur.lastrowid
    conn.commit()
    cur.close()
    conn.close()
    return last_id
