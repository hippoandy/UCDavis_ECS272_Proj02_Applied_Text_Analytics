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
BUSID = config.BUSID

Collection = "business"
field = "business_id"

# Database Connection ----------------------------------------
mongodb_client = pymongo.MongoClient( MongoDB_URL, MongoDB_PORT, serverSelectionTimeoutMS = 10 )
mongodb_db = mongodb_client[ MongoDB_DB ]
# ---------------------------------------- Database Connection

f = open( PRE_PATH + BUSID, 'w' )
data = mongodb_db[ Collection ].find()
for d in data:
	f.write( d[ field ] )
	f.write( '\n' )
f.close()

# Close Database Connection ----------------------------------
try:
	mongodb_client.close()
except:
	print( "[ERROR] No MongoDB Connection!" )
# ---------------------------------- Close Database Connection

