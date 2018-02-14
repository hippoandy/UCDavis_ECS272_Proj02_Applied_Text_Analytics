#!/usr/bin/env python

# Objective: Query the reviews of a business from database
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
BUSID = config.BUSID
REVBUS = config.REVBUS

Collection = "review"

# Database Connection ----------------------------------------
mongodb_client = pymongo.MongoClient( MongoDB_URL, MongoDB_PORT, serverSelectionTimeoutMS = 10 )
mongodb_db = mongodb_client[ MongoDB_DB ]
# ---------------------------------------- Database Connection

f = open( PRE_PATH + BUSID, 'r' )
fw = open( PRE_PATH + REVBUS, 'w' )
for id in f:
	#print( id )
	id = str(id).replace( '\n', '' )
	result = mongodb_db[ Collection ].find( { "business_id": id } )
	d = "{" + "\"business_id\": \"" + id + "\", \"reviews\": [ "
	c = 0
	for r in result:
		text = str(r[ "text" ]).replace( '\n', ' ' ).replace( '\t', ' ' ).replace( '\r', ' ' )
		ele = "{" + "\"text\": \"" + text + "\", \"user_id\": \"" + r[ "user_id" ] + "\"}"
		d += ele
		if( c != int(len( result )) - 1 ): d += ","
		c += 1
	d += "]}"
	#print( d )
	fw.write( d )
	fw.write( '\n' )
f.close()
fw.close()

# Close Database Connection ----------------------------------
try:
	mongodb_client.close()
except:
	print( "[ERROR] No MongoDB Connection!" )
# ---------------------------------- Close Database Connection
