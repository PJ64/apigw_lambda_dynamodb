import json, boto3, logging, os
from botocore.exceptions import ClientError
from decimal import Decimal

logger = logging.getLogger()

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

def lambda_handler(event, context):

    queryParam = event["queryStringParameters"]
    
    try:
        response = table.get_item(Key={'accountid': queryParam['accountid'], 'vendorid':queryParam['vendorid']})

        return {
            'statusCode': 200,
            'headers': {
                "Content-Type": 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,X-Api-Key',
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            'body': json.dumps(response, default=handle_decimal_type)
        }
    except ClientError:
        logger.exception("Couldn't Getitem from table %s",table)
        raise

def handle_decimal_type(obj):
  if isinstance(obj, Decimal):
      if float(obj).is_integer():
         return int(obj)
      else:
         return float(obj)
  raise TypeError