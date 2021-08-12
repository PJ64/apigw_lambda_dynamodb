from __future__ import print_function
import boto3, json
import logging
import os
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

def lambda_handler(event, context):
    body = json.loads(event['body'])
    try:
        response = table.put_item(
            Item={
                'orderid': body['order']['orderid'],
                'coffeetype': body['order']['coffeetype'],
                'coffeesize': body['order']["coffeesize"],
                'vendorid': body['order']["vendorid"]
            })
        logger.info("PutItem %s to table %s.",body,table)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(response)
        }

    except ClientError:
        logger.exception("Couldn't PutItem %s to table %s",body,table)
        raise