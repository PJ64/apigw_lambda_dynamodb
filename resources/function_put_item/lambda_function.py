from __future__ import print_function
import boto3, json, logging, os
from botocore.exceptions import ClientError
from aws_embedded_metrics import metric_scope

logger = logging.getLogger()

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLENAME'))

@metric_scope
def lambda_handler(event, context, metrics):
    return dynamo_put_item(event,metrics)

def dynamo_put_item(event,  metrics):
    body = json.loads(event['body'])
    metrics.put_dimensions({"orders": "order_item"})
    metrics.put_metric("quantity", body['order']['details']["quantity"], "Integer")
    metrics.set_property("accountid", body['order']['accountid'])
    metrics.set_property("vendorid", body['order']['vendorid'])
    metrics.set_property("orderdate", body['order']['orderdate'])
    metrics.set_property("city", body['order']['city'])
    metrics.set_property("coffeetype", body['order']['details']['coffeetype'])
    metrics.set_property("coffeesize", body['order']['details']['coffeesize'])

    try:
        response = table.put_item(
            Item={
                'accountid': body['order']['accountid'],
                'vendorid': body['order']["vendorid"],
                'orderdate':body['order']["orderdate"],
                'city':body['order']["city"],
                'details':{
                    'coffeetype': body['order']['details']['coffeetype'],
                    'coffeesize': body['order']['details']["coffeesize"],
                    'unitprice': body['order']['details']["unitprice"],
                    'quantity': body['order']['details']["quantity"]
                },
            })
        logger.info(response)
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

def handle_decimal_type(obj):
  if isinstance(obj, Decimal):
      if float(obj).is_integer():
         return int(obj)
      else:
         return float(obj)
  raise TypeError