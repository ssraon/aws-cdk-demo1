# How to share a VPC between Stacks in AWS CDK

A repository for an article on
[bobbyhadz.com](https://bobbyhadz.com/blog/aws-cdk-share-vpc-between-stacks)

> If you use CDK v1, switch to the cdk-v1 branch

## How to Use

1. Clone the repository

2. Install the dependencies

```bash
npm install
```

3. Deploy the CDK stacks in the following order

```bash
npx aws-cdk deploy vpc-stack

npx aws-cdk deploy lambda-stack

npx aws-cdk synth --no-staging > template.yaml

npx aws-cdk synth  --context stateCd=XX --context targetEnv=UAT   

aws cloudformation list-stacks --query "StackSummaries[?contains(StackName,'lambda-stack')].StackStatus"
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --output json --query "StackSummaries[?contains(@.StackName, 'lambda-stack')].{Name: StackName, Created: CreationTime}"

aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --output json --query "length(StackSummaries[?contains(@.StackName, 'lambda-stack')])"
 

```

4. Open the AWS CloudFormation Console and the stack should be created in your
   default region

5. Destroy the CDK stacks in the following order

```bash

npx aws-cdk deploy --outputs-file ./cdk-outputs.json
npx aws-cdk destroy lambda-stack

npx aws-cdk destroy vpc-stack
```
