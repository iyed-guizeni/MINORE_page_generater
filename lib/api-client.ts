/**
 * API Client
 * Handles communication with the backend API
 */

export interface GenerateRequest {
  prompt: string
}

export interface GenerateResponse {
  code: string
  error?: string
  warnings?: string[]
  success?: boolean
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = "APIError"
  }
}

/**
 * Call the backend API to generate code
 */
export async function generateComponentCode(
  prompt: string
): Promise<GenerateResponse> {
  if (!prompt || prompt.trim().length === 0) {
    throw new APIError("Prompt cannot be empty", 400)
  }

  try {
    console.log("prompt",prompt)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        data.error || "Failed to generate code",
        response.status
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    throw new APIError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500
    )
  }
}
