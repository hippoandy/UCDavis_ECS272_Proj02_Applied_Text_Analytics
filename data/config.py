
# Confriguration for Data Insertion and Preprocessing
# Created: 2018.02.13
# Author: Yu-Chang (Andy) Ho

# MongoDB Configurations
MongoDB_ADDR = "127.0.0.1"
MongoDB_USER = "hippo"
MongoDB_PASS = "hippo1993928"
MongoDB_URL = "mongodb://" + MongoDB_USER + ":" + MongoDB_PASS + "@" + MongoDB_ADDR + "/admin"
MongoDB_PORT = 27017
MongoDB_DB = "ECS272-P2-Data"


# Data Files
File_SET = [ "business", "checkin", "photos", "review", "tip", "user" ]

# Preprocessed Files
PRE_PATH = "./prep/"
BUSID = "busid.txt"
USRID = "usrid.txt"
