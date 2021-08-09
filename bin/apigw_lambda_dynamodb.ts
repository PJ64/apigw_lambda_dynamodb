#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApigwLambdaDynamodbStack } from '../lib/apigw_lambda_dynamodb-stack';

const app = new cdk.App();
new ApigwLambdaDynamodbStack(app, 'ApigwLambdaDynamodbStack');
