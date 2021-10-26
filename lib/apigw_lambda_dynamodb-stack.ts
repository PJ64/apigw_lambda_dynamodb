import { Stack, App, RemovalPolicy } from '@aws-cdk/core';
import { LambdaIntegration, RestApi , Cors} from '@aws-cdk/aws-apigateway';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Runtime, Code, Function, LayerVersion } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, ManagedPolicy, PolicyStatement } from '@aws-cdk/aws-iam';

export class ApigwLambdaDynamodbStack extends Stack {
  constructor(scope: App, id: string, ) {
    super(scope, id);

    //Create DynamoDB table
    const dynamoTable = new Table(this, "DynamoDBTable",{
      partitionKey: {
        name: 'accountid',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'vendorid',
        type: AttributeType.STRING
      },
      tableName: 'apigw_lambda_dynamodb',
      removalPolicy: RemovalPolicy.DESTROY
    });

    //Setup IAM security for Lambda functions
    const lambda_get_service_role = new Role(this, "lambda_get_service_role",{
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        roleName: "apigw_lambda_dynamodb_get"
    });

    lambda_get_service_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    
    lambda_get_service_role.addToPolicy(new PolicyStatement({
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:GetItem'],
    }));

    const lambda_put_service_role = new Role(this, "lambda_put_service_role",{
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      roleName: "apigw_lambda_dynamodb_put"
    });

    lambda_put_service_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    
    lambda_put_service_role.addToPolicy(new PolicyStatement({
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:PutItem'],
    }));

    const lambda_delete_service_role = new Role(this, "lambda_delete_service_role",{
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      roleName: "apigw_lambda_dynamodb_delete"
    });

    lambda_delete_service_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    lambda_delete_service_role.addToPolicy(new PolicyStatement({
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:DeleteItem'],
    }));

    const lambda_update_service_role = new Role(this, "lambda_update_service_role",{
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      roleName: "apigw_lambda_dynamodb_update"
    });

    lambda_update_service_role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    lambda_update_service_role.addToPolicy(new PolicyStatement({
      resources: [dynamoTable.tableArn],
      actions: ['dynamodb:UpdateItem'],
    }));

    //Lambda layer
    const embeded_metricsLayer = new LayerVersion(this, 'embeded_metricsLayer', {
      layerVersionName: 'embeded_metrics',
      compatibleRuntimes: [
        Runtime.PYTHON_3_7
      ],
      code: Code.fromAsset('resources/lambda_layer'),
      description: 'embeded_metrics',
    });

    //Create Lambda functions for CRUD (create, read, update, delete) operations.
  
    const lambda_put_item = new Function(this, "lambda_put_item",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_function.lambda_handler",
      code: Code.fromAsset("resources/function_put_item"),
      functionName: "apigw_Lambda_dynamodb_put_item",
      role: lambda_put_service_role,
      environment: {
        'TABLENAME': dynamoTable.tableName
      },
      layers: [embeded_metricsLayer]
    });

    const lambda_get_item = new Function(this, "lambda_get_item",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_function.lambda_handler",
      code: Code.fromAsset("resources/function_get_item"),
      functionName: "apigw_Lambda_dynamodb_get_item",
      role: lambda_get_service_role,
      environment: {
        'TABLENAME': dynamoTable.tableName
      }
    });

    const lambda_delete_item = new Function(this, "lambda_delete_item",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_function.lambda_handler",
      code: Code.fromAsset("resources/function_delete_item"),
      functionName: "apigw_Lambda_dynamodb_delete_item",
      role: lambda_delete_service_role,
      environment: {
        'TABLENAME': dynamoTable.tableName
      }
    });

    const lambda_update_item = new Function(this, "lambda_update_item",{
      runtime: Runtime.PYTHON_3_7,
      handler: "lambda_function.lambda_handler",
      code: Code.fromAsset("resources/function_update_item"),
      functionName: "apigw_Lambda_dynamodb_update_item",
      role: lambda_update_service_role,
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

    //Create API lambda integrations
    var lambda_put_integration = new LambdaIntegration(lambda_put_item, {
      requestTemplates: {
            ["application/json"]: "{ \"statusCode\": \"200\" }"
        }
    });
    var lambda_delete_integration = new LambdaIntegration(lambda_delete_item, {
      requestTemplates: {
            ["application/json"]: "{ \"statusCode\": \"200\" }"
        }
    });
    var lambda_update_integration = new LambdaIntegration(lambda_update_item, {
      requestTemplates: {
            ["application/json"]: "{ \"statusCode\": \"200\" }"
        }
    });
    var lambda_get_integration = new LambdaIntegration(lambda_get_item);

    //Create API resources
    var api_put_resource = api.root.addResource("putorder");
    var api_delete_resource = api.root.addResource("deleteorder");
    var api_update_resource = api.root.addResource("updateorder");
    var api_get_resource = api.root.addResource("getorder");

    //Create API methods
    api_put_resource.addMethod("POST", lambda_put_integration);
    api_delete_resource.addMethod("POST", lambda_delete_integration);
    api_update_resource.addMethod("POST", lambda_update_integration);
    api_get_resource.addMethod("GET", lambda_get_integration);
  }
}
