# cbp-aws-lambda
Contains lambda functions to be deployed on AWS.

Currently for customizing AWS Cognito Email messages to users.


### How to run tests
1. Jest is used for tests so install dependencies with 
    - $npm install
2. Run test
    - $npm test

### To Deploy Lambda Function Initially
1. run Yarn Build
2. Zip handler.js file
    - $zip -j function.zip dist/handler.js 
3. Set environment account number and domain postfix (for prod this should be empty '') and run AWS CLI command to initially upload function.zip
    - To deploy to DEV (switch 816905787311 to different env account number for other environments)
        - $aws lambda create-function --function-name CustomizeCognitoMessageTrigger  \
            --zip-file fileb://function.zip --handler handler.handler --runtime nodejs12.x \
            --role arn:aws:iam::816905787311:role/cbp-lambda-cli \
            --environment "Variables={DOMAIN_POSTFIX='dev'}"
4. Test function is deployed
    - $aws lambda invoke --function-name CustomizeCognitoMessageTrigger out --log-type Tail --query 'LogResult' --output text |  base64 -D


### Updating a Lambda Function
1. run Yarn Build
1. Zip handler.js file
    - $zip -j function.zip dist/handler.js 
2. Run update function code command
    - $aws lambda update-function-code --function-name CustomizeCognitoMessageTrigger  \
        --zip-file fileb://function.zip
