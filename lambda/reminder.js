// lambda/reminder.js
// This Lambda runs daily via EventBridge Scheduler
// It reads all users due a reminder from DynamoDB and sends them a text via SNS

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const sns    = new SNSClient({ region: process.env.AWS_REGION });

const REMINDERS_TABLE = process.env.REMINDERS_TABLE;

exports.handler = async () => {
  const now    = new Date();
  const hour   = now.getUTCHours();   // EventBridge triggers hourly, we filter by hour
  const minute = now.getUTCMinutes();

  console.log(`Running reminder check for UTC ${hour}:${minute}`);

  // Scan DynamoDB for users whose reminder hour matches now
  const result = await dynamo.send(new ScanCommand({
    TableName: REMINDERS_TABLE,
    FilterExpression: "reminderHour = :h",
    ExpressionAttributeValues: { ":h": { N: String(hour) } },
  }));

  const users = result.Items || [];
  console.log(`Found ${users.length} users to remind`);

  const results = await Promise.allSettled(
    users.map(async (user) => {
      const phone      = user.phone.S;
      const name       = user.name?.S || "there";
      const wrongQs    = JSON.parse(user.wrongQuestions?.S || "[]");
      const language   = user.language?.S || "English";

      const practiceList = wrongQs.length > 0
        ? `\n\nReview these:\n${wrongQs.slice(0, 3).map((q, i) => `${i+1}. ${q}`).join("\n")}`
        : "\n\nYou're doing great — keep it up!";

      const message =
        `🗽 Hi ${name}! Time to practice for your citizenship test.\n` +
        `Go to citizentest.me to keep studying.` +
        practiceList +
        `\n\nReply STOP to unsubscribe.`;

      await sns.send(new PublishCommand({
        PhoneNumber: phone,
        Message: message,
        MessageAttributes: {
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional",
          },
          "AWS.SNS.SMS.SenderID": {
            DataType: "String",
            StringValue: "CitizenTest",
          },
        },
      }));

      console.log(`Sent reminder to ${phone}`);
    })
  );

  const sent   = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;
  console.log(`Sent: ${sent}, Failed: ${failed}`);

  return { sent, failed };
};
