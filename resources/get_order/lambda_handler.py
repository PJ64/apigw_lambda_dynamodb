import json
import boto3
import logging
import os
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ.get('TABLENAME'))

    queryParam = event["queryStringParameters"]
    
    try:
        response = table.get_item(Key={'orderid': queryParam['orderid']})

        return {
            'statusCode': 200,
            'headers': {
                "Content-Type": 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,X-Api-Key',
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            'body': json.dumps(response)
        }
    except ClientError:
        logger.exception("Couldn't Getitem from table %s",table)
        raise