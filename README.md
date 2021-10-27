## Example
This example is designed for a concept mobile application called Skip the Line, which allows user to pre-order takeaway coffee while they are in transit. Just as the train pulls into the station, the user can order a coffee and pick it up on the way past the coffee shop.

This example uses an Amazon API Gateway endpoint to allow the mobile app to add and manage orders. There are four AWS Lambda functions deployed behind the gateway endpoint, they are used to execute  CRUD (create, read, update, delete) operations against an Amazon DynamoDB order table.

The Amazon DynamoDB table is partitioned on an accountid attribute and also includes a sort key on the vendorid attribute, together they form the primary key. The example also demonstrates using Python to put, update, get and delete items in Amazon DynamoDB.

By integrating an API Gateway endpoint with AWS Lambda functions and an Amazon DynamoDB table you can build basic microservice architecture that is scalable, highly available and cost effective. This is a standard pattern for applications that require a CRUD backend.

The example also includes a Python Lambda layer with the aws_embedded_metrics module. The aws_embedded_metrics is used to capture order details as additional metrics which can be viewed using Amazon CloudWatch Log Insights. 

![architecture](./images/architecture_1.png "Architecture")

## Setup

You will need to download and install [Node.js](https://nodejs.org/en/download/) before you can start using the AWS Cloud Development Kit.

This example is developed using the AWS CDK and Typescript, so you will need to install both Typescript and the CDK using the following commands
```
npm install -g typescript
npm install -g aws-cdk@latest
```
Since this CDK project uses ['Assests'](https://docs.aws.amazon.com/cdk/latest/guide/assets.html), you might need to run the following command to provision resources the AWS CDK will need to perform the deployment.

```bash 
cdk bootstrap
```

The testing scripts can be executed using Jupyter Notebook. There are a few methods for installing Jupyter Notebooks. These instructions will help you get to started with [JupyterLab](https://jupyter.org/install) installation. 

You can also install Jupyter Notebooks as part of [Anaconda](https://docs.anaconda.com/anaconda/install/index.html) installation.

To download this example, you will need to install [Git](https://github.com/git-guides/install-git). After installing git follow these [instructions](https://github.com/git-guides/git-clone) to learn how to clone the repository.

After the repository has been cloned set the command prompt path to the cloned directory and run the following command to install the project dependencies.

```bash
npm install
```

**cdk synth** executes the application which translates the Typescript code into an AWS CloudFormation template.

```bash
cdk synth
```

After the synth command has generated the template use the  **cdk deploy** command to deploy the template to AWS CloudFormation and build the stack. You will be prompted to confirm the deployment with y/n.

```bash
cdk deploy
```

## Run the Example
Open the Jupyter Notebook in the **jupyter_notebook directory** follow the instructions.

## Cleanup
From the command prompt execute the following command: **cdk destroy**

## Deployed Resources
|	Identifier	|	Service	|	Type	|
|	:---	|	:---	|	:---	|
|	apigw_lambda_dynamodb	|	DynamoDB	|	Table	|
|	account/ApigwL-Order-FWxkXGJAl84t	|	ApiGateway	|	Account	|
|	ApigwLambdaDynamodbStack-OrderApiCloudWatchRoleB19-O3GSF61CEV4Q	|	IAM	|	Role	|
|	restapis/so9wvpacfj	|	ApiGateway	|	RestApi	|
|	embeded_metrics	|	Lambda	|	LayerVersion	|
|	apigw_Lambda_dynamodb_delete_item	|	Lambda	|	Function	|
|	apigw_lambda_dynamodb_delete	|	IAM	|	Role	|
|	apigw_Lambda_dynamodb_get_item	|	Lambda	|	Function	|
|	apigw_lambda_dynamodb_get	|	IAM	|	Role	|
|	apigw_Lambda_dynamodb_put_item	|	Lambda	|	Function	|
|	apigw_lambda_dynamodb_put	|	IAM	|	Role	|
|	apigw_Lambda_dynamodb_update_item	|	Lambda	|	Function	|
|	apigw_lambda_dynamodb_update	|	IAM	|	Role	|

