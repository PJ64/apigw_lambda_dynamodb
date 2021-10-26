from __future__ import print_function
import boto3, json, logging, os
from decimal import Decimal
from botocore.exceptions import ClientError

logger = logging.getLogger()

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

def lambda_handler(event, context):
    body = json.loads(event['body'])
    try:
        response = table.update_item(
        Key={
            'accountid': body['order']['accountid'],
            'vendorid': body['order']["vendorid"]
        },
        UpdateExpression="set details.quantity=:q, details.coffeesize=:s, details.coffeetype=:t",
        ExpressionAttributeValues={
            ':q': body['order']['details']["quantity"],
            ':s': body['order']['details']["coffeesize"],
            ':t': body['order']['details']['coffeetype'],
        },
        ReturnValues="UPDATED_NEW"
        )

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