// lambda/save-reminder.js
// Handles POST /reminder (save) and DELETE /reminder (unsubscribe)

const { DynamoDBClient, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const REMINDERS_TABLE = process.env.REMINDERS_TABLE;
const ALLOWED_ORIGIN  = process.env.ALLOWED_ORIGIN;

const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") return respond(200, {});

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return respond(400, { error: "Invalid JSON body" });
  }

  const { phone, name, language, wrongQuestions, reminderHour } = body || {};

  // DELETE — unsubscribe user
  if (event.httpMethod === "DELETE") {
    if (!phone) return respond(400, { error: "phone required" });
    try {
      await dynamo.send(new DeleteItemCommand({
        TableName: REMINDERS_TABLE,
        Key: { phone: { S: phone } },
      }));
      return respond(200, { message: "Unsubscribed successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      return respond(500, { error: "Failed to unsubscribe" });
    }
  }

  // POST — save reminder preference
  if (!phone) return respond(400, { error: "phone required" });

  // Basic phone validation
  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) return respond(400, { error: "Invalid phone number" });
  const e164Phone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`;

  // reminderHour should be 0-23 in UTC
  const hour = parseInt(reminderHour ?? 14); // default 2pm UTC = ~9am EST

  try {
    await dynamo.send(new PutItemCommand({
      TableName: REMINDERS_TABLE,
      Item: {
        phone:          { S: e164Phone },
        name:           { S: name || "there" },
        language:       { S: language || "English" },
        wrongQuestions: { S: JSON.stringify(wrongQuestions || []) },
        reminderHour:   { N: String(hour) },
        createdAt:      { S: new Date().toISOString() },
      },
    }));

    return respond(200, { message: "Reminder saved!", phone: e164Phone });
  } catch (err) {
    console.error("Save error:", err);
    return respond(500, { error: "Failed to save reminder" });
  }
};