/* eslint-disable max-classes-per-file */
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { aws_lambda_nodejs as lambdaNode } from "aws-cdk-lib";
import { aws_stepfunctions as sfn } from "aws-cdk-lib";
import { aws_stepfunctions_tasks as tasks } from "aws-cdk-lib";
import { aws_events as events } from "aws-cdk-lib";
import { aws_events_targets as eventsTarget } from "aws-cdk-lib";

import {EventBridgeTypes} from "../src/lambda/sfn-reminder/sendReminder";



export class VPCStack extends cdk.Stack {
  // 👇 set a property for the vpc
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'my-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });
  }
}

// 👇 extend the props interface of LambdaStack
interface LambdaStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}


export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // 👇 recommended way to get access to the properties
    console.log('accountId: ', cdk.Stack.of(this).account);
    console.log('region: ', cdk.Stack.of(this).region);
    console.log('availability zones: ', cdk.Stack.of(this).availabilityZones);

    const { vpc } = props;

    cdk.Tags.of(vpc).add('environment', 'development');
    cdk.Tags.of(vpc).add('department', 'dpt123');

    // // 👇 parameter of type String
    // const statCd = new cdk.CfnParameter(this, 'state', {
    //   type: 'String',
    //   default: 'XX',
    //   maxLength: 2,
    //   description: 'The name of the state Code is Deploying',
    // });
    // console.log('statCd 👉 ', statCd.valueAsString);

    // // 👇 parameter of type String
    // const deployEnvironment = new cdk.CfnParameter(this, 'deployEnvironment', {
    //   type: 'String',
    //   default: 'UAT',
    //   maxLength: 4,
    //   description: 'The name of deployment environment ex;, dev, uat, tst1,tst2, tst3, prd',
    // });
    // console.log('deployEnvironment 👉 ', deployEnvironment.valueAsString);

    const stateCd :string = this.node.tryGetContext('stateCd');
    const targetEnv :string = this.node.tryGetContext('targetEnv');
    console.log('stateCd' + stateCd);
    console.log('targetEnv' , targetEnv);

        // 👇Reading Systems Manager values at synthesis time
        // const dynatraceTenant = ssm.StringParameter.valueFromLookup(this, 
        //         `xx.uat.dt.tenant`);
        const dynatraceTenant = ssm.StringParameter.valueForStringParameter(
          this, `${stateCd.toLowerCase()}.${targetEnv.toLowerCase()}.dt.tenant`);         
          // console.log('Dynatrace Tenant 👉 ', dynatraceTenant2);

    const layer1 = new lambda.LayerVersion(this, 'layer1', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_12_X,
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/layer/my-layer-1')),
      description: 'Moment Libs',
    });
    const layer2 = new lambda.LayerVersion(this, 'layer2', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_14_X,
      ],
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/layer/my-layer-2')),
      description: 'UUID Libs',
    });
    const existingVpc = ec2.Vpc.fromLookup(this, 'ESP-RDS-Glue-PoC-NonPrd', { isDefault: false, vpcName: 'vpc-stack/my-vpc' });
    const serverlessrole = iam.Role.fromRoleArn(
      this,
      'imported-role',
      `arn:aws:iam::${cdk.Stack.of(this).account}:role/my-serverless-role`,
      { mutable: false },
    );
    // 👇 lambda function definition
    const lambdaFunction1 = new lambda.Function(this, 'lambda-function-1', {
      // 👇 place lambda in shared VPC
      vpc: existingVpc,
      allowPublicSubnet: true,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      role: serverlessrole,
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/lambda/my-lambda-1')),
      layers: [layer1, layer2],
      environment: {
        DT_TENANT : dynatraceTenant
      },
    });

    const lambdaFunction2 = new lambda.Function(this, 'lambda-function-2', {
      // 👇 place lambda in shared VPC
      vpc: existingVpc,
      allowPublicSubnet: true,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src/lambda/my-lambda-2')),
      // role: serverlessrole,
      layers: [layer2],
      timeout: cdk.Duration.seconds(15),
      environment: {
        // 👇 pass the VPC ID as an environment variable
        VPC_ID: existingVpc.vpcId,
      },
    });


    const api = new apigateway.RestApi(this, 'api', {
      description: 'example api gateway',
      restApiName: 'My Test API 1',
      deployOptions: {
        stageName: 'dev',
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:4200'],
      },
    });

    // 👇 create an Output for the API URL
    new cdk.CfnOutput(this, 'apiUrl', { value: api.url });

    // 👇 integrate GET /todos with getTodosLambda
    const myApiOne = api.root.addResource('myApiResourceOne');
    myApiOne.addMethod(
      'GET',
      new apigateway.LambdaIntegration(lambdaFunction1, { proxy: true }),
    );

    const myApiTwo = api.root.addResource('myApiResourceTwo');
    myApiTwo.addMethod(
      'POST',
      new apigateway.LambdaIntegration(lambdaFunction1, { proxy: true }),
    );

    // 👇 create bucket
    const s3Bucket = new s3.Bucket(this, 's3-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: 'samba-test-bucket-20220425'
    });

    // 👇 invoke lambda every time an object is created in the bucket
    s3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(lambdaFunction2),
      // 👇 only invoke lambda if object matches the filter
      { prefix: 'test/' },
    );

    new cdk.CfnOutput(this, 'bucketName', {
      value: s3Bucket.bucketName,
    });

/** ################################################################################################### */
    // Create an EventBus to receive and send events.
    const bus = new events.EventBus(this, "reminderEventBus");
    // Output the name of the new bus.
    new cdk.CfnOutput(this, "reminderBus", { value: bus.eventBusName });

    // Define the wait task.
    // Because we're subscribing to an EventBridge event, the "at" field
    // is under the detail.
    const waitTask = new sfn.Wait(this, "waitUntil", {
      time: sfn.WaitTime.timestampPath("$.detail.at"),
    });

    // Define the sendReminder task.
    const sendReminderHandler = new lambdaNode.NodejsFunction(
      this,
      "sendReminderHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "handler",
        entry: path.join(
          __dirname,
          "../src/lambda/sfn-reminder/sendReminder.ts"
        ),
        memorySize: 1024,
        environment: {
          EVENT_BUS: bus.eventBusName,
        },
      }
    );
    // Grant permission to send to the bus.
    bus.grantPutEventsTo(sendReminderHandler);
    // Set up the Lambda function to be a task.
    const sendReminderTask = new tasks.LambdaInvoke(
      this,
      "sendReminder",
      {
        lambdaFunction: sendReminderHandler,
        outputPath: "$.Payload", // Return the output from the Lambda function.
      }
    );

    // Configure a delay for the sendReminderTask.
    const reminderMachineDefinition = waitTask.next(
      sendReminderTask
    );

    // Construct the state machine.
    const reminderMachine = new sfn.StateMachine(this, "reminder", {
      definition: reminderMachineDefinition,
      timeout: cdk.Duration.days(90),
    });

    // Configure EventBridge to start the reminder machine when a remind event is received.
    const reminderMachineTarget = new eventsTarget.SfnStateMachine(
      reminderMachine
    );
    new events.Rule(this, "startReminder", {
      eventBus: bus,
      targets: [reminderMachineTarget],
      eventPattern: {
        detailType: [EventBridgeTypes.StartReminder],
      },
    });
    /** ################## SFN Reminder ##########################################*/




  }
  
}

