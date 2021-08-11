import json
import boto3
import os

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ.get('TABLENAME'))

    queryParam = event["queryStringParameters"]
    
    response = table.get_item(Key={'orderid': queryParam['orderid']})

    return {
        'statusCode': 200,
        'headers': {
            "Content-Type": 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,X-Api-Key',
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        'body': json.dumps(response["Item"])
    }
