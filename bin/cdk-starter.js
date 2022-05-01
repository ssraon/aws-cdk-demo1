#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = __importStar(require("aws-cdk-lib"));
const cdk_starter_stack_1 = require("../lib/cdk-starter-stack");
const app = new cdk.App();
const vpcStack = new cdk_starter_stack_1.VPCStack(app, 'vpc-stack', {
    stackName: 'vpc-stack',
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    },
});
const lambdaStack = new cdk_starter_stack_1.LambdaStack(app, 'lambda-stack', {
    vpc: vpcStack.vpc,
    stackName: 'lambda-stack',
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YXJ0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstc3RhcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUFtQztBQUNuQyxnRUFBK0Q7QUFFL0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSw0QkFBUSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUU7SUFDOUMsU0FBUyxFQUFFLFdBQVc7SUFDdEIsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO1FBQ3RDLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtLQUN6QztDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sV0FBVyxHQUFHLElBQUksK0JBQVcsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFO0lBRXZELEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRztJQUNqQixTQUFTLEVBQUUsY0FBYztJQUN6QixHQUFHLEVBQUU7UUFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7UUFDdEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO0tBQ3pDO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7TGFtYmRhU3RhY2ssIFZQQ1N0YWNrfSBmcm9tICcuLi9saWIvY2RrLXN0YXJ0ZXItc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCB2cGNTdGFjayA9IG5ldyBWUENTdGFjayhhcHAsICd2cGMtc3RhY2snLCB7XG4gIHN0YWNrTmFtZTogJ3ZwYy1zdGFjaycsXG4gIGVudjoge1xuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OLFxuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gIH0sXG59KTtcblxuY29uc3QgbGFtYmRhU3RhY2sgPSBuZXcgTGFtYmRhU3RhY2soYXBwLCAnbGFtYmRhLXN0YWNrJywge1xuICAvLyDwn5GHIHBhc3MgdGhlIFZQQyBmcm9tIHRoZSBvdGhlciBzdGFja1xuICB2cGM6IHZwY1N0YWNrLnZwYyxcbiAgc3RhY2tOYW1lOiAnbGFtYmRhLXN0YWNrJyxcbiAgZW52OiB7XG4gICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04sXG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgfSxcbn0pO1xuIl19