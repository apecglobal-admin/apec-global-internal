import {
  FinishReason,
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
  type EnhancedGenerateContentResponse,
  type GenerateContentResult,
  type GenerationConfig,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { parseTaskAnalysis } from "@/src/features/ai-report/schemas";
import { buildTaskAnalysisPrompt } from "@/src/features/ai-report/server/prompt";
import {
  loadAITaskContext,
  validateTaskAnalysisContext,
} from "@/src/features/ai-report/server/taskContext";

export const maxDuration = 60;

const AI_REPORT_TIMEOUT_MS = 20_000;

interface AIReportGenerationConfig extends GenerationConfig {
  thinkingConfig: {
    thinkingLevel: "low";
  };
}

class AIReportTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`AI không phản hồi trong ${timeoutMs} ms.`);
    this.name = "AIReportTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

const requestSchema = z.object({
  text: z.string().trim().min(1).max(10_000),
  userName: z.string().trim().min(1).max(255),
  token: z.string().trim().min(1),
});

const formatZodErrorMessage = (error: z.ZodError): string => {
  const flattened = error.flatten();
  const fieldMessages = Object.entries(flattened.fieldErrors).flatMap(
    ([field, messages]) =>
      messages?.map((message) => `${field}: ${message}`) ?? [],
  );

  return [...flattened.formErrors, ...fieldMessages].join("; ") ||
    "Dữ liệu AI Report không hợp lệ.";
};

const generationConfig: AIReportGenerationConfig = {
  responseMimeType: "application/json",
  maxOutputTokens: 6096,
  temperature: 0.1,
  thinkingConfig: {
    thinkingLevel: "low",
  },
};

const logGeminiError = (error: unknown): void => {
  if (error instanceof AIReportTimeoutError) {
    console.error("AI Report Gemini request timed out:", {
      name: error.name,
      message: error.message,
      timeoutMs: error.timeoutMs,
    });
    return;
  }

  if (error instanceof GoogleGenerativeAIFetchError) {
    console.error("AI Report Gemini request failed:", {
      name: error.name,
      message: error.message,
      status: error.status ?? null,
      statusText: error.statusText ?? null,
      errorDetails: error.errorDetails ?? null,
    });
    return;
  }

  console.error("AI Report analysis failed:", {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : String(error),
  });
};

const getCurrentDate = (): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const assertGeminiResponseIsComplete = (
  response: EnhancedGenerateContentResponse,
): void => {
  const candidate = response.candidates?.[0];
  if (candidate?.finishReason !== FinishReason.MAX_TOKENS) {
    return;
  }

  console.error("AI Report Gemini output was truncated:", {
    finishReason: candidate.finishReason,
    finishMessage: candidate.finishMessage ?? null,
  });
  throw new Error("AI Report output bị cắt do vượt giới hạn phản hồi.");
};

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = requestSchema.parse(body);
    const apiKey = process.env.GEMINI_AI_REPORT_API_KEY;

    if (!apiKey) {
      console.error("AI Report configuration error: GEMINI_AI_REPORT_API_KEY is missing.");
      return NextResponse.json(
        {
          error: {
            code: "AI_REPORT_NOT_CONFIGURED",
            message: "AI Report chưa được cấu hình.",
          },
        },
        { status: 500 },
      );
    }

    const currentDate = getCurrentDate();
    const taskContext = await loadAITaskContext(input.token);
    const prompt = buildTaskAnalysisPrompt({
      userText: input.text,
      userName: input.userName,
      currentDate,
      context: taskContext,
    });
    console.info("AI Report prompt:", {
      characterCount: prompt.length,
      prompt,
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_AI_REPORT_MODEL || "gemini-2.5-flash",
      generationConfig,
    });
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      AI_REPORT_TIMEOUT_MS,
    );
    let result: GenerateContentResult;

    try {
      result = await model.generateContent(prompt, {
        signal: controller.signal,
      });
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        throw new AIReportTimeoutError(AI_REPORT_TIMEOUT_MS);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    assertGeminiResponseIsComplete(result.response);
    const rawText = result.response.text();
    const parsedJson: unknown = JSON.parse(rawText);
    const analysis = parseTaskAnalysis(parsedJson);
    if (analysis.reports.length > 0) {
      validateTaskAnalysisContext(analysis, taskContext);
    }

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    if (error instanceof AIReportTimeoutError) {
      logGeminiError(error);
      return NextResponse.json(
        {
          error: {
            code: "AI_REPORT_TIMEOUT",
            message: "AI phản hồi quá lâu. Vui lòng thử lại.",
          },
        },
        { status: 504 },
      );
    }

    if (error instanceof z.ZodError) {
      const details = error.flatten();
      const message = formatZodErrorMessage(error);
      console.error("AI Report validation failed:", details);
      return NextResponse.json(
        {
          error: {
            code: "AI_REPORT_INVALID_DATA",
            message,
            details,
          },
        },
        { status: 422 },
      );
    }

    logGeminiError(error);
    return NextResponse.json(
      {
        error: {
          code: "AI_REPORT_ANALYSIS_FAILED",
          message: "Không thể phân tích yêu cầu lúc này.",
        },
      },
      { status: 500 },
    );
  }
}
