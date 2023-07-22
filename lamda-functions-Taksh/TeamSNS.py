import json
import boto3

def create_cloudwatch_event_rule(topic_arn,data):
    # Create an SNS client
    sns = boto3.client('sns')

    # Create a CloudWatch Events client
    events = boto3.client('events')
    
    
     # Subscribe an email to the SNS topic
    email_address = data['email']
    
    filter_policy = {
        "email": [email_address]
    }
    
    subscribe_response = sns.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email_address,
        Attributes={
            'FilterPolicy': json.dumps(filter_policy)
        }
    )
    subscription_arn = subscribe_response['SubscriptionArn']
    
    print(subscribe_response)
    
    event_pattern = {
        "source": ["aws.sns"],
        "resources": [topic_arn],
        "id": ["12345678-1234-1234-1234-123456789012"],
        "account": ["371241265915"],
        "time": ["2023-07-25T12:34:56Z"],
        "region": ["us-east-1"],
        "detail-type": ["SubscriptionConfirmation"]
    }

    
    # Create the CloudWatch Events rule
    events.put_rule(
        Name=data['topic_name'],
        EventPattern=json.dumps(event_pattern),
        State = 'ENABLED'
    )

    # Add the Lambda function as a target for the rule
    target_id = 'SNS_Subscription_Confirmation_Target'
    events.put_targets(
        Rule=data['topic_name'],
        Targets=[
            {
                'Id': target_id,
                'Arn': "arn:aws:lambda:us-east-1:371241265915:function:TopicConfirmSubscription"
            }
        ]
    )
    
    print('CloudWatch Events rule created successfully.')
    return






def lambda_handler(event, context):
    
    print(event)
    data=json.loads(event['body'])
    topic_name = data['topic_name']  # Replace with your desired SNS topic name

    try:
        sns = boto3.client('sns')
        create_topic_response = sns.create_topic(Name=topic_name)
        topic_arn = create_topic_response['TopicArn']

        print('SNS Topic created successfully with ARN:', topic_arn)
        
        
        sns = boto3.client('sns')
        
        # Create the SNS topic
        create_topic_response = sns.create_topic(Name=topic_name)
        topic_arn = create_topic_response['TopicArn']

        print('SNS Topic created successfully with ARN:', topic_arn)
        
        create_cloudwatch_event_rule(topic_arn,data)

        print('Subscribed email address:', data['email'], 'to SNS Topic with ARN:', topic_arn)


        return {
            'statusCode': 200,
            'body': json.dumps({'topicArn': topic_arn})
        }
    except Exception as e:
        print('Error creating SNS Topic:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Error creating SNS Topic'})
        }
        