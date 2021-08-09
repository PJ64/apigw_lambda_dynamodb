import json
import boto3
import os

def lambda_handler(event, context): 
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ('TABLENAME'))

    print(event)
    # jsondata =json.loads(event["Records"][0]["body"])
    # jsondata = json.loads(jsondata["Message"])

    # response = table.get_item(Key={'itemid': jsondata["orderid"]})

    # return response['Item']
