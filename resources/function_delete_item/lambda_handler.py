from __future__ import print_function
import boto3, json
import logging
import os
from botocore.exceptions import ClientError

logger = logging.getLogger()

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

def lambda_handler(event, context):
    body = json.loads(event['body'])
    try:
        response = table.delete_item(
            Key={
                'accountid': body['order']['accountid'],
                'vendorid': body['order']["vendorid"]
            })
        logger.info("Deleting Item %s from table %s.",body,table)
        
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
        logger.exception("Could not delete item %s to table %s",body,table)
        raise