/**
 * Test file to check if the Groq API is being called
 * Run this in your browser console or create an API route for it
 */

// Check the API response
async function testGroqAPI() {
  console.log("Testing Groq API endpoint...")

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "Create a simple red button with text 'Click me'",
    }),
  })

  const data = await response.json()

  console.log("Response status:", response.status)
  console.log("Response data:", data)

  if (data.error) {
    console.error("Error from API:", data.error)
  }

  if (data.code) {
    console.log("Generated code preview:")
    console.log(data.code.substring(0, 300))
  }

  return data
}

// Test response checking
async function debugAPI() {
  try {
    const result = await testGroqAPI()
    
    // Check if it's the mock response
    if (result.code && result.code.includes("Component {i}")) {
      console.warn(
        "⚠️ WARNING: This is the mock/fallback response, not from Groq API!"
      )
      console.log(
        "The backend is returning a template instead of calling Groq."
      )
    } else if (result.code) {
      console.log("✓ Looks like real code from Groq!")
    }
  } catch (err) {
    console.error("Test failed:", err)
  }
}

// Run the test
console.log("Starting API test...")
debugAPI()
