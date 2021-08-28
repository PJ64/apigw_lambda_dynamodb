import { Stack, App, RemovalPolicy } from '@aws-cdk/core';
import { LambdaIntegration, RestApi , Cors} from '@aws-cdk/aws-apigateway';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Runtime, Code, Function } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from '@aws-cdk/aws-iam';

export class ApigwLambdaDynamodbStack extends Stack {
  constructor(scope: App, id: string, ) {
    super(scope, id);

    //Create DynamoDB table
    const dynamoTable = new Table(this, "DynamoDBTable",{
      partitionKey: {
        name: 'orderid',
        type: AttributeType.STRING
      },
      tableName: 'apigw_lambda_dynamodb',
      removalPolicy: RemovalPolicy.DESTROY
    });

    //Setup IAM security for Lambda
    const lambda_service_role = new Role(this, "IamRole",{
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        roleName: "apigw_lambda_dynamodb"
    });

    lambda_service_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    
    lambda_service_role.addToPolicy(new PolicyStatement({
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
    }));

    //Create 2 Lambda function. One for read and one for writing
    const lambda_post_order = new Function(this, "PostLambdaFunction",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_handler.lambda_handler",
      code: Code.fromAsset("resources/post_order"),
      functionName: "post_apigw_Lambda_dynamodb",
      role: lambda_service_role,
      environment: {
        'TABLENAME': dynamoTable.tableName
      }
    });

    const lambda_get_order = new Function(this, "GetLambdaFunction",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_handler.lambda_handler",
      code: Code.fromAsset("resources/get_order"),
      functionName: "get_apigw_Lambda_dynamodb",
      role: lambda_service_role,
      environment: {
        'TABLENAME': dynamoTable.tableName
      }
    });

    //Create REST Api and integrate the Lambda functions
    var api = new RestApi(this, "OrderApi",{
        restApiName: "apigw_lambda_dynamodb",
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS}
    });

    var lambda_post_integration = new LambdaIntegration(lambda_post_order, {
      requestTemplates: {
            ["application/json"]: "{ \"statusCode\": \"200\" }"
        }
    });

    var lambda_get_integration = new LambdaIntegration(lambda_get_order);

    var apiresource = api.root.addResource("order");
    apiresource.addMethod("POST", lambda_post_integration);
    apiresource.addMethod("GET", lambda_get_integration);
  }
}
