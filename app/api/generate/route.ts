/**
 * API Route: POST /api/generate
 * Generates React component code based on user prompt
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCode } from "@/lib/groq-service";
import { validateGeneratedCode, getErrorMessage } from "@/lib/code-sanitizer";

export const runtime = "nodejs";
function cleanReactCode(response: any) {
  // Remove any markdown fences and 'use client' lines
  let cleanedResponse = response
    .replace(/```tsx/g, '')                // Remove opening TSX code fences if they exist
    .replace(/```jsx/g, '')                // Remove opening JSX code fences if they exist
    .replace(/```/g, '')                   // Remove closing code fences
    .replace(/'use client'/, '')            // Remove the 'use client' directive if present
    .trim();                               // Trim any surrounding whitespace
  
  // Remove any lingering 'tsx' or other type metadata from the top
  cleanedResponse = cleanedResponse.replace(/^tsx/i, '').trim();

  return cleanedResponse;
}



export async function POST(request: NextRequest) {
  try {
    // Validate request method
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { prompt } = body;
    console.log("promptx", prompt);

    // Validate prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Generate code using Groq API
    console.log(
      "Calling generateCode with prompt:",
      prompt.substring(0, 50) + "..."
    );
    console.log("GROQ_API_KEY loaded:", !!process.env.GROQ_API_KEY);

    const { code, error } = await generateCode(prompt);
    const cleanCode = cleanReactCode(code);
    console.log("cleanCode",cleanCode);

    console.log("generateCode returned:", {
      hasCode: !!code,
      hasError: !!error,
    });

    if (error) {
      console.error("Code generation error:", error);
      return NextResponse.json(
        {
          error: error,
          code: "",
        },
        { status: 500 }
      );
    }

    // Validate generated code
    const validation = validateGeneratedCode(code);

    if (!validation.isValid) {
      const errorMessage = getErrorMessage(validation.errors);
      console.warn("Code validation failed:", errorMessage);
      // Still return the code, but flag the warnings
      return NextResponse.json(
        {
          code: cleanCode,
          warnings: validation.errors,
        },
        { status: 200 }
      );
    }

    // Return sanitized code
    return NextResponse.json(
      {
        code: cleanCode,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        code: "",
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
