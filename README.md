## Example
This is a basic example of provisioning an Amazon API Gateway, AWS Lambda function and an Amazon DynamoDB table using the AWS CDK and TypeScript

## Setup
1. Since this CDK project uses ['Assests'](https://docs.aws.amazon.com/cdk/latest/guide/assets.html), you might need to run the following command to provision resources the AWS CDK needs to perform the deployment.

```bash 
cdk bootstrap
```

2. Install the dependencies

```bash
npm install
```

3. Execute **cdk synth** to synthesize as AWS CloudFormation template

```bash
cdk synth
```

4. Execute **cdk deploy** to deploy the template and build the stack

```bash
cdk deploy
```

5. The API Gateway will be deployed by the stack and can be tested using the following json object

```bash
{
  "order": {
    "orderid": "3",
    "coffeetype": "Flat white",
    "coffeesize": "Small",
    "vendorid": 1
  }
}
```