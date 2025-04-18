from pymongo import MongoClient
from benx_1.config import Config

def create_mongo_client(mongo_uri = Config.MONGO_URI):
    if not mongo_uri:
        raise ValueError("MongoDB URI not found in Config")
    return MongoClient(mongo_uri)

def init_database(client, db_name):
    return client.get_database(db_name)

def init_collection(db_name, coll_name):
    return db_name.get_collection(coll_name)


req_coll = ["faculty_details", "faculty_login_details", "student_details", "student_login_details", "questions", "exam_response", "exam_qps", "ongoing_exam"]
dbs = {name: init_collection(init_database(create_mongo_client(), "benx_solns_smart_eval"), name) for name in req_coll}