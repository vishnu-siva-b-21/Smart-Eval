import os
from dotenv import load_dotenv

load_dotenv()

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY')
    MONGO_URI = os.getenv('MONGO_URI')
    HF_TOKEN = os.getenv('HF_TOKEN')
    T5_MODEL = os.getenv('T5_MODEL')
    SBERT_MODEL = os.getenv('SBERT_MODEL')
