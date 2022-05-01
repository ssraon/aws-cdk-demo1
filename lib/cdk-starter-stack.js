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
exports.LambdaStack = exports.VPCStack = void 0;
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const cdk = __importStar(require("aws-cdk-lib"));
const path = __importStar(require("path"));
class VPCStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.VPCStack = VPCStack;
class LambdaStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const { vpc } = props;
        cdk.Tags.of(vpc).add('environment', 'development');
        cdk.Tags.of(vpc).add('department', 'dpt123');
        const layer1 = new lambda.LayerVersion(this, 'layer1', {
            compatibleRuntimes: [
                lambda.Runtime.NODEJS_12_X,
                lambda.Runtime.NODEJS_14_X,
            ],
            code: lambda.Code.fromAsset(path.join(__dirname, '/../src/lambda/layer/my-layer1')),
            description: 'Moment Libs',
        });
        const getExistingVpc = ec2.Vpc.fromLookup(this, 'ESP-RDS-Glue-PoC-NonPrd', { isDefault: false, vpcName: 'vpc-stack/my-vpc' });
        const lambdaFunction = new lambda.Function(this, 'lambda-function', {
            vpc: getExistingVpc,
            allowPublicSubnet: true,
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'my-lambda/index.main',
            code: lambda.Code.fromAsset(path.join(__dirname, '/../src/lambda')),
            layers: [layer1],
            environment: {
                VPC_ID: getExistingVpc.vpcId,
            },
        });
    }
}
exports.LambdaStack = LambdaStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YXJ0ZXItc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstc3RhcnRlci1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlEQUEyQztBQUMzQywrREFBaUQ7QUFDakQsaURBQW1DO0FBQ25DLDJDQUE2QjtBQUU3QixNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUlyQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNyQyxJQUFJLEVBQUUsYUFBYTtZQUNuQixXQUFXLEVBQUUsQ0FBQztZQUNkLG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxJQUFJLEVBQUUsaUJBQWlCO29CQUN2QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO29CQUNqQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbkJELDRCQW1CQztBQVFELE1BQWEsV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3hDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsS0FBSyxDQUFDO1FBRXBCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUU3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNyRCxrQkFBa0IsRUFBRTtnQkFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2dCQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7YUFDM0I7WUFDRCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUNsRixXQUFXLEVBQUUsYUFBYTtTQUMzQixDQUFDLENBQUM7UUFDSCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFFNUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUVsRSxHQUFHLEVBQUUsY0FBYztZQUNuQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDaEIsV0FBVyxFQUFFO2dCQUVYLE1BQU0sRUFBRSxjQUFjLENBQUMsS0FBSzthQUM3QjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUM7Q0FDRjtBQW5DRCxrQ0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBtYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBjbGFzcyBWUENTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIC8vIPCfkYcgc2V0IGEgcHJvcGVydHkgZm9yIHRoZSB2cGNcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy52cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnbXktdnBjJywge1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzE2JyxcbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ3B1YmxpYy1zdWJuZXQtMScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuLy8g8J+RhyBleHRlbmQgdGhlIHByb3BzIGludGVyZmFjZSBvZiBMYW1iZGFTdGFja1xuaW50ZXJmYWNlIExhbWJkYVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHZwYzogZWMyLlZwYztcbn1cblxuXG5leHBvcnQgY2xhc3MgTGFtYmRhU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM6IExhbWJkYVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHt2cGN9ID0gcHJvcHM7XG5cbiAgICBjZGsuVGFncy5vZih2cGMpLmFkZCgnZW52aXJvbm1lbnQnLCAnZGV2ZWxvcG1lbnQnKTtcbiAgICBjZGsuVGFncy5vZih2cGMpLmFkZCgnZGVwYXJ0bWVudCcsICdkcHQxMjMnKTtcblxuICAgIGNvbnN0IGxheWVyMSA9IG5ldyBsYW1iZGEuTGF5ZXJWZXJzaW9uKHRoaXMsICdsYXllcjEnLCB7XG4gICAgICBjb21wYXRpYmxlUnVudGltZXM6IFtcbiAgICAgICAgbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICAgIGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgXSxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCcvLi4vc3JjL2xhbWJkYS9sYXllci9teS1sYXllcjEnKSksXG4gICAgICBkZXNjcmlwdGlvbjogJ01vbWVudCBMaWJzJyxcbiAgICB9KTtcbiAgICBjb25zdCBnZXRFeGlzdGluZ1ZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCAnRVNQLVJEUy1HbHVlLVBvQy1Ob25QcmQnLHtpc0RlZmF1bHQ6IGZhbHNlLCB2cGNOYW1lOiAndnBjLXN0YWNrL215LXZwYycgfSk7XG4gICAgLy8g8J+RhyBsYW1iZGEgZnVuY3Rpb24gZGVmaW5pdGlvblxuICAgIGNvbnN0IGxhbWJkYUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnbGFtYmRhLWZ1bmN0aW9uJywge1xuICAgICAgLy8g8J+RhyBwbGFjZSBsYW1iZGEgaW4gc2hhcmVkIFZQQ1xuICAgICAgdnBjIDpnZXRFeGlzdGluZ1ZwYyxcbiAgICAgIGFsbG93UHVibGljU3VibmV0OiB0cnVlLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnbXktbGFtYmRhL2luZGV4Lm1haW4nLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcvLi4vc3JjL2xhbWJkYScpKSxcbiAgICAgIGxheWVyczogW2xheWVyMV0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAvLyDwn5GHIHBhc3MgdGhlIFZQQyBJRCBhcyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICAgICAgICBWUENfSUQ6IGdldEV4aXN0aW5nVnBjLnZwY0lkLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH1cbn1cbiJdfQ==