from __future__ import print_function
import boto3, json, os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

def lambda_handler(event, context):
    jsondata = json.loads(event['body'])
    print(jsondata['order'])
    table.put_item(
        Item={
            'orderid': jsondata['order']['orderid'],
            'coffeetype': jsondata['order']['coffeetype'],
            'coffeesize': jsondata['order']["coffeesize"],
            'vendorid': jsondata['order']["vendorid"]
        })
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps("Order Placed")
    }