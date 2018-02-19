#!/usr/bin/env python

# Objective: Query all the business IDs from database
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
PRE_PATH = config.PRE_PATH
SBAD = config.SBAD
SGOOD = config.SGOOD

Collection = "business_reviews"
field = "business_id"

# Database Connection ----------------------------------------
mongodb_client = pymongo.MongoClient( MongoDB_URL, MongoDB_PORT, serverSelectionTimeoutMS = 10 )
mongodb_db = mongodb_client[ MongoDB_DB ]
# ---------------------------------------- Database Connection

f = open( PRE_PATH + SGOOD, 'r' )
for r in f:
	#print( r )
	r = str(r).replace( '\n', '' )
	data = mongodb_db[ Collection ].find( { field: r } )
	for d in data:
		#print( d )
		revs = d[ 'reviews' ]
		for l in revs:
			print( str(l[ 'text' ]).replace( '\n', '' ).replace( '\r', '' ) )
f.close()

# Close Database Connection ----------------------------------
try:
	mongodb_client.close()
except:
	print( "[ERROR] No MongoDB Connection!" )
# ---------------------------------- Close Database Connection


