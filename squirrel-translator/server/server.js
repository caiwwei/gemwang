import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(fileUpload());

// Make sure OPENAI_API_KEY is set in environment or .env (if you add dotenv)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/squirrel", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const img = req.files.image;
    const base64 = img.data.toString("base64");
    const dataUrl = `data:${img.mimetype};base64,${base64}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // vision-capable model
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "You are a chaotic but cute UBC squirrel." +
                " Look at this photo and imagine you ARE the squirrel in it." +
                " Respond ONLY with valid JSON, no extra text." +
                " Format: {\"mood\":\"string\",\"mainThought\":\"string\"," +
                "\"sideThoughts\":[\"string\",\"string\"]," +
                "\"stats\":{\"hunger\":int,\"chaos\":int,\"friendliness\":int}}." +
                " Make it funny, short, and student-relatable."
            },
            {
              type: "image_url",
              image_url: { url: dataUrl }
            }
          ]
        }
      ]
    });

    const raw = completion.choices[0].message.content;
    // In chat.completions, content is usually a string
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse JSON from model:", raw);
      return res.status(500).json({ error: "Model did not return valid JSON" });
    }

    res.json(json);
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: err.message || "OpenAI request failed" });
  }
});

const PORT = 3069;
app.listen(PORT, () => {
  console.log(`Squirrel server running on http://localhost:${PORT}`);
});
