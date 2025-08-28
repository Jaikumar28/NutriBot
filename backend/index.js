import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


const app = express();
app.use(cors());
app.use(bodyParser.json());

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: "Your Gemini Key",
  temperature: 0.5,
});

const taskDescription =
  "You are a helpful AI nutritionist. Answer the user query: {question}";

app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    const prompt = ChatPromptTemplate.fromTemplate(taskDescription);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const result = await chain.invoke({ question });
    res.json({ reply: result });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
