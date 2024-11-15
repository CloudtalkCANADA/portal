const { Client, Environment } = require('square');

const squareClient = new Client({
    accessToken: 'EAAAl5mIV2hwPwLBBM6c7ppZv4iKz0CxMh55WhD2Xnu1hP2ifr9VhCWBSW9sJ8Y-',
    environment: Environment.Sandbox,
});

module.exports = { squareClient };
