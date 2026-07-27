import boto3
import json
from decimal import Decimal

dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
table = dynamodb.Table('xpressbuy')

with open('bin/data/products/product5.json', 'r') as f:
    items = json.load(f, parse_float=Decimal)

for item in items:
    table.put_item(Item=item)
    print(f"Inserted: {item.get('sk')}")
