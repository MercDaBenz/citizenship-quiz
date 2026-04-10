// lambda/reminder.js
// Runs daily via EventBridge Scheduler.
// Reads all users due a reminder from DynamoDB and sends them a text via Twilio.
//
// Required environment variables (set in Lambda console or CDK):
//   TWILIO_ACCOUNT_SID   — from console.twilio.com
//   TWILIO_AUTH_TOKEN    — from console.twilio.com
//   TWILIO_PHONE_NUMBER  — your Twilio number, e.g. +15551234567
//   REMINDERS_TABLE      — DynamoDB table name
//   AWS_REGION           — e.g. us-east-1
//
// Before deploying, install Twilio in the lambda folder:
//   cd lambda && npm init -y && npm install twilio

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const twilio = require("twilio");

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const REMINDERS_TABLE = process.env.REMINDERS_TABLE;

exports.handler = async () => {
  const now  = new Date();
  const hour = now.getUTCHours(); // EventBridge triggers hourly, filter by hour

  console.log(`Running reminder check for UTC hour: ${hour}`);

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
      const phone    = user.phone.S;
      const name     = user.name?.S || "there";
      const wrongQs  = JSON.parse(user.wrongQuestions?.S || "[]");

      const practiceList = wrongQs.length > 0
        ? `\n\nReview these:\n${wrongQs.slice(0, 3).map((q, i) => `${i + 1}. ${q}`).join("\n")}`
        : "\n\nYou're doing great — keep it up!";

      const message =
        `🗽 Hi ${name}! Time to practice for your citizenship test.\n` +
        `Go to citizentest.me to keep studying.` +
        practiceList +
        `\n\nReply STOP to unsubscribe.`;

      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      console.log(`Sent reminder to ${phone}`);
    })
  );

  const sent   = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;
  results.filter(r => r.status === "rejected").forEach(r => console.error(r.reason));

  console.log(`Sent: ${sent}, Failed: ${failed}`);
  return { sent, failed };
};
