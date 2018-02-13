#!/usr/bin/env python

# Objective: Insert the data into MongoDB
# The data is already in JSON format.
# Created: 2018.02.13
# Author: Yu-Chang (Andy) Ho

import json
import os
import sys
reload( sys )
sys.setdefaultencoding( 'utf-8' )
import pymongo

import config
MongoDB_URL = config.MongoDB_URL
MongoDB_PORT = config.MongoDB_PORT
MongoDB_DB = config.MongoDB_DB
File_SET = config.File_SET

# Database Connection ----------------------------------------
mongodb_client = pymongo.MongoClient( MongoDB_URL, MongoDB_PORT, serverSelectionTimeoutMS = 10 )
mongodb_db = mongodb_client[ MongoDB_DB ]
# ---------------------------------------- Database Connection

# read the files
for item in File_SET:
	f = open( "./files/" + item + ".json", 'r' )
	for r in f:
		try:
			#print( type( r ) )
			db_result = mongodb_db[ item ].insert( json.loads( r ) )
			# print( db_result )
		except:
			print( "Unexpected error:", sys.exc_info()[0] )
	f.close()

# Close Database Connection ----------------------------------
try:
	mongodb_client.close()
except:
	print( "[ERROR] No MongoDB Connection!" )
# ---------------------------------- Close Database Connection


