const config = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "bucketavika"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://p01jk4d1c7.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_EPAYCmxWN",
      APP_CLIENT_ID: "7k46bn3mnudvqqdvhtcngc5n9f",
      IDENTITY_POOL_ID: "us-east-1:ea4ed3f6-c477-4781-9b12-c9c6e6fd8360",
      REDIRECT_URI: "http://localhost:3000/login/callback"
    },
    social: {
      FB: "1308851786388960"
    }
  };
  
  export default config;
  