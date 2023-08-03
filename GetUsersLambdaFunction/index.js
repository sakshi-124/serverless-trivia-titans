const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    AWS.config.update({ region: 'us-east-1' });
    const userPoolId = 'us-east-1_1Xcd4lxHQ';

    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    const params = {
        UserPoolId: userPoolId,
    };

    try {
        const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
        const users = data.Users.map((user) => ({
            username: user.Username,
            email: user.Attributes.find((attr) => attr.Name === 'email').Value,
            name: user.Attributes.find((attr) => attr.Name === 'name').Value
        }));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Origin': 'https://frontend-o5zhrppqlq-uc.a.run.app',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                users: users
            }),
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching users' }),
        };
    }
};
