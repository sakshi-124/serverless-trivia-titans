import boto3
import time
import json

def lambda_handler(event, context):
    # Create an SNS client
    
    print(event)
    sns_client = boto3.client('sns')

    # Read the incoming message from the SQS event
    for record in event['Records']:
        # Assuming the message body is a JSON string, you can adjust this based on your message format
        message_body = json.loads(record['body'])
        print(message_body)
        # Determine the appropriate SNS topic based on the message content or metadata
        topic_arn = message_body['topic_arn']
        
        split=message_body['topic_arn'].split(":")
        team_name = split[5]

        # Create the invitation URL
        invitation_url = f"http://127.0.0.1:5001/trivia-titans-390605/us-central1/app/acceptInvite?email={message_body['email']}&team={team_name}"

        # Publish the message to the appropriate SNS topic
        response = sns_client.publish(
            TopicArn=message_body['topic_arn'],
            Message="Please accept invite: " + invitation_url,
            MessageAttributes={'email': {'DataType': 'String', 'StringValue': message_body['email']}},
            Subject="Invitation to join the team"
        )

        print(f"Message published to SNS topic {topic_arn}. Message ID: {response['MessageId']}")


