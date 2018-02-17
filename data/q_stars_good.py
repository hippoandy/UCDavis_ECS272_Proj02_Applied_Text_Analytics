#!/usr/bin/env python

import MySQLdb

import config
MySQL_ADDR = config.MySQL_ADDR
MySQL_USER = config.MySQL_USER
MySQL_PASS = config.MySQL_PASS
MySQL_DB = config.MySQL_DB

# Open database connection
db = MySQLdb.connect( MySQL_ADDR, MySQL_USER, MySQL_PASS, MySQL_DB )
# prepare a cursor object using cursor() method
cursor = db.cursor()

command = "SELECT * FROM business WHERE stars > '%d'" % (3)
# execute SQL query using execute() method.
cursor.execute( command )
try:
	# Fetch all the rows in a list of lists.
	results = cursor.fetchall()
	for r in results:
		print( r[ 0 ] )
except:
	print "Error: unable to fecth data"

db.close()
