import time
import boto3
import json

# lambda_function.py

def lambda_handler(event, context):
    # Your code logic here
    # This is the entry point function for AWS Lambda

    # For example, you can process the event data
    print(event)
    data=json.loads(event['body'])
    # Replace 'your_topic_arn_here' with the ARN of the SNS topic you want to list subscriptions for
    # Create an SNS client
    sns = boto3.client('sns')
    print(data)
    # Retrieve a list of all topics
    res = sns.list_topics()

    # Filter topics based on the topic name
    topics = res['Topics']
    matching_topics = [topic for topic in topics if data['topic_name'] in topic['TopicArn']]
    print(matching_topics)
    topic_arn=matching_topics[0]['TopicArn']
    email=data['email']
    
    filter_policy = {
        "email": [email]
    }
    
    sns.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email,
        Attributes={
            'FilterPolicy': json.dumps(filter_policy)
        }
    )
    
    message={
        "topic_arn":topic_arn,
        "email":email
    }    
    sqs=boto3.client('sqs');
    time.sleep(30)
    sqs.send_message(
        QueueUrl='https://sqs.us-east-1.amazonaws.com/371241265915/SnsQueue',
        MessageBody=json.dumps(message)
    )

    # Return a response if needed
    return {
        'statusCode': 200,
        'body': {
            "status":"requets sent"
        }
    }
