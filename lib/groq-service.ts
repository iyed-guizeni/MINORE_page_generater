/**
 * Google Gemini API Service
 * Handles communication with Google Gemini API for code generation
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const MODEL = "gemini-2.0-flash";

const SYSTEM_PROMPT = `You are a React component generator. Generate a React component based on the user's description. Return ONLY the code, starting with 'use client' if needed. Use Tailwind CSS for styling. Ensure the code is production-ready and functional. Do NOT include any additional explanation, thinking, or comments—just the code.`;

export interface GenerateCodeRequest {
  prompt: string;
}

export interface GenerateCodeResponse {
  code: string;
  error?: string;
}

/**
 * Generate React component code using Google Gemini API
 */
export async function generateCode(
  userPrompt: string
): Promise<GenerateCodeResponse> {
  console.log("[Gemini Service] Starting generateCode");
  console.log(
    "[Gemini Service] API Key present:",
    !!process.env.GEMINI_API_KEY
  );

  if (!process.env.GEMINI_API_KEY) {
    const error = "GEMINI_API_KEY is not configured";
    console.error("[Gemini Service]", error);
    return {
      code: "",
      error: error,
    };
  }

  if (!userPrompt || userPrompt.trim().length === 0) {
    const error = "Prompt cannot be empty";
    console.error("[Gemini Service]", error);
    return {
      code: "",
      error: error,
    };
  }

  try {
    console.log("[Gemini Service] Calling Gemini API at:", GEMINI_API_URL);
    console.log("[Gemini Service] Model:", MODEL);
    console.log("[Gemini Service] Prompt length:", userPrompt.length);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a React component generator. Generate a React component based on the user's description. Return ONLY the code, starting with 'use client' if needed. Use Tailwind CSS for styling. Ensure the code is production-ready and functional. Do NOT include any additional explanation, thinking, or comments—just the code.\n\nGenerate a React component for: ${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
            topP: 1,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("[Gemini Service] Response status:", response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMsg = `API Error: ${response.status} - ${
          error.error?.message || "Unknown error"
        }`;
        console.error("[Gemini Service]", errorMsg, error);
        return {
          code: "",
          error: errorMsg,
        };
      }

      const data = await response.json();
      console.log(
        "[Gemini Service] Response received, candidates:",
        data.candidates?.length
      );

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts
      ) {
        const errorMsg = "Invalid response format from Gemini API";
        console.error("[Gemini Service]", errorMsg, data);
        return {
          code: "",
          error: errorMsg,
        };
      }

      const generatedCode = data.candidates[0].content.parts[0].text.trim();
      console.log(
        "[Gemini Service] Generated code length:",
        generatedCode.length
      );
      console.log(
        "[Gemini Service] Code preview:",
        generatedCode.substring(0, 100)
      );

      return {
        code: generatedCode,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMsg = `Failed to generate code: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
    console.error("[Gemini Service]", errorMsg, error);
    return {
      code: "",
      error: errorMsg,
    };
  }
}

/**
 * Generate code with streaming support
 * Returns a readable stream of the response
 */
export async function generateCodeStreaming(userPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (!userPrompt || userPrompt.trim().length === 0) {
    throw new Error("Prompt cannot be empty");
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a React component generator. Generate a React component based on the user's description. Return ONLY the code, starting with 'use client' if needed. Use Tailwind CSS for styling. Ensure the code is production-ready and functional. Do NOT include any additional explanation, thinking, or comments—just the code.\n\nGenerate a React component for: ${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        topP: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response;
}
