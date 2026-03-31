// lambda/index.js
// Deploy this as your Lambda function handler.
// It caches each USCIS question (per language) in DynamoDB
// so Claude is only called once per question per language — ever.

const https    = require("https");
const { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });
const sm     = new SecretsManagerClient({ region: process.env.AWS_REGION });

const TABLE_NAME  = process.env.CACHE_TABLE;   // injected by CDK
const SECRET_ID   = process.env.SECRET_ID;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

// ── Secrets (cached in memory between warm Lambda invocations) ────────────────
let cachedApiKey = null;
async function getApiKey() {
  if (cachedApiKey) return cachedApiKey;
  const res = await sm.send(new GetSecretValueCommand({ SecretId: SECRET_ID }));
  cachedApiKey = JSON.parse(res.SecretString).key;
  return cachedApiKey;
}

// ── CORS headers ──────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

// ── Call Anthropic (non-streaming — we store the result in Dynamo) ────────────
async function callClaude(apiKey, prompt) {
  const payload = JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system:
      "You are a U.S. citizenship test quiz generator. " +
      "Return ONLY a raw JSON object (no markdown, no code fences). " +
      'Schema: {"question":string,"options":[string,string,string,string],"answer":"A"|"B"|"C"|"D","explanation":string}. ' +
      "The answer field must be exactly A, B, C, or D. " +
      "Translate all text into the language specified by the user.",
    messages: [{ role: "user", content: prompt }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.anthropic.com",
        path:     "/v1/messages",
        method:   "POST",
        headers: {
          "Content-Type":    "application/json",
          "x-api-key":       apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Length":  Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const text   = parsed.content?.[0]?.text || "";
            // Strip any accidental code fences
            const clean  = text.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();
            resolve(JSON.parse(clean));
          } catch (e) {
            reject(new Error("Failed to parse Claude response: " + data.slice(0, 200)));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ── DynamoDB helpers ──────────────────────────────────────────────────────────
// Cache key: "LANG#questionIndex"  e.g. "English#42"
async function getCached(language, index) {
  const res = await dynamo.send(new GetItemCommand({
    TableName: TABLE_NAME,
    Key: {
      pk: { S: `${language}#${index}` },
    },
  }));
  if (!res.Item) return null;
  return JSON.parse(res.Item.data.S);
}

async function putCached(language, index, questionObj) {
  await dynamo.send(new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      pk:   { S: `${language}#${index}` },
      data: { S: JSON.stringify(questionObj) },
      // TTL: never expires (USCIS questions don't change)
    },
  }));
}

// ── Shuffle helper ────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Main handler ──────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return respond(200, "");
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body" });
  }

  const { language = "English", uscisQuestions, usedIndices = [] } = body;
  // uscisQuestions: array of { index: number, q: string, a: string }
  if (!Array.isArray(uscisQuestions) || uscisQuestions.length === 0) {
    return respond(400, { error: "uscisQuestions array required" });
  }

  try {
    const apiKey = await getApiKey();
    const results = [];

    for (const item of uscisQuestions) {
      const { index, q, a } = item;

      // 1. Check cache first
      let cached = await getCached(language, index);

      if (!cached) {
        // 2. Not cached — call Claude and store result
        const prompt =
          `Language: ${language}\n\n` +
          `Convert this official U.S. citizenship test question into a multiple choice question.\n\n` +
          `Question: ${q}\n` +
          `Official answer: ${a}\n\n` +
          `Return ONLY a raw JSON object with keys: question, options (array of 4 strings), answer (A/B/C/D), explanation. ` +
          `Write everything in ${language}.`;

        cached = await callClaude(apiKey, prompt);

        // Validate before caching
        if (
          !cached.question ||
          !Array.isArray(cached.options) || cached.options.length !== 4 ||
          !["A","B","C","D"].includes(cached.answer) ||
          !cached.explanation
        ) {
          return respond(500, { error: `Invalid question format for index ${index}` });
        }

        await putCached(language, index, cached);
      }

      results.push(cached);
    }

    // Shuffle so question order is random each session
    return respond(200, { questions: shuffle(results) });

  } catch (err) {
    console.error("Handler error:", err);
    return respond(500, { error: err.message || "Internal server error" });
  }
};