import pickle
import numpy as np
import json
from PIL import Image
import requests
import os


files = ['./nordstrom-data/fragrance.pkl', './nordstrom-data/hoodies.pkl', 
         './nordstrom-data/jackets.pkl', './nordstrom-data/pants.pkl', 
         './nordstrom-data/shoes.pkl', './nordstrom-data/shorts.pkl', './nordstrom-data/tshirt.pkl']

data = []

for f in files:
    with open(f, 'rb') as file:
        d = pickle.load(file)
        data.append(d)

data = [item for sublist in data for item in sublist]

# relevant fields
# name, brandName, mediaById
# name --> str
# brandName --> str
# mediaById --> {id: {id, ..., src: str, group: str}, id2: {...}}
# colorsById: {id: {id: str, label: str, mediaIds: list[str]}}

# we want each image of a product to be it's own item (with the same name and brandName)

new_products = [] # {name: str, brand: str, src: str}
for prod in data:
    media = prod['mediaById']
    image_urls = [val['src'] for val in media.values() if val['group'] == 'main'] # only grab the main photos for each product
    name = prod['name']
    brand = prod['brandName']
    for img in image_urls:
        new_products.append({'name': name, 'brand': brand, 'src': img})

# key: src, value = object
# {src: obj, src: obj, ...}
# strip https://n.nordstrommedia.com/it/ from src


formatted_products = {}
for prod in new_products:
    src = os.path.basename(prod['src'])
    formatted_products[src] = prod

with open('nordstrom_data.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_products, f, ensure_ascii=False, indent=4)

# download all images
media_list = list(formatted_products.keys())

for src in media_list:
    r = requests.get(formatted_products[src]['src'])
    loc = "./nordstrom-data/images/" + src
    with open(loc, 'wb') as f:
        f.write(r.content)


# filename = everything up until last slash
# get src from formatted_products


