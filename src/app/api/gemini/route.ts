import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in environment variables.");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not set" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.0-flash for speed and multimodal capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert File to bytes
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Transcribe the speech into Vietnamese text with high accuracy.
      The speech may mention the following projects: Apec Global, Ion Bạc (Ion Ag+), Queency, Nam Thiên Long, Life Care, Apec Space, Apec BCI, Ecoop, CLB Sinh viên khởi nghiệp, Phở cô Ba Sài Gòn.
      If no speech or any part is unclear or inaudible output . (a dot). Output only the transcript, no timestamps, no explanations.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: audioFile.type || "audio/webm",
          data: base64Audio,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error processing AI report:", error);
    
    // Log additional details if available
    if (error.response) {
        console.error("Gemini API Error Response:", JSON.stringify(error.response, null, 2));
    }

    return NextResponse.json(
      { 
        error: error.message || "Internal Server Error",
        details: error.toString() 
      },
      { status: 500 }
    );
  }
}
