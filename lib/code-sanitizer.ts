/**
 * Code Sanitizer
 * Validates and sanitizes generated code before rendering
 */

// Patterns that should NOT appear in generated code
const DANGEROUS_PATTERNS = [
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /document\.write/gi,
  /innerHTML\s*=/gi,
  /dangerouslySetInnerHTML/gi,
  /import\s+.*from\s+['"](?!react|lucide-react|tailwindcss)/gi,
  /<script/gi,
  /onclick\s*=/gi,
  /onerror\s*=/gi,
  /fetch\s*\(\s*['"`]/gi, // potential API calls to user-controlled URLs
]

// Allowed imports (whitelist)
const ALLOWED_IMPORTS = [
  "react",
  "lucide-react",
  "@/components",
  "@/lib",
  "clsx",
  "tailwind-merge",
]

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedCode: string
}

/**
 * Validate that the code is safe and production-ready
 */
export function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = []
  let sanitizedCode = code

  // Check if code is empty
  if (!code || code.trim().length === 0) {
    errors.push("Generated code is empty")
    return {
      isValid: false,
      errors,
      sanitizedCode: "",
    }
  }

  // Check if it's the mock/template response (red flag)
  if (code.includes("Component {i}") || (code.includes("map((i)") && code.includes("Component"))) {
    errors.push("Generated code appears to be a template/mock response, not real generated code")
    return {
      isValid: false,
      errors,
      sanitizedCode: "",
    }
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      const match = code.match(pattern)?.[0]
      errors.push(`Dangerous pattern detected: ${match}`)
    }
  }

  // Basic JSX/React validation
  if (!code.includes("export") && !code.includes("return")) {
    errors.push("Code must export a React component")
  }

  // Check if it has 'use client' for client components
  if (!code.startsWith("'use client'") && !code.startsWith('"use client"')) {
    sanitizedCode = `'use client'\n\n${code}`
  }

  // Validate that default export exists or add it
  if (!code.includes("export default")) {
    if (code.includes("function") || code.includes("const")) {
      // Try to add default export
      const functionMatch = code.match(
        /(?:function|const)\s+(\w+)\s*(?:\(|=|:)/
      )
      if (functionMatch && functionMatch[1]) {
        sanitizedCode = `${sanitizedCode}\n\nexport default ${functionMatch[1]}`
      }
    }
  }

  // Validate imports are from allowed sources (basic check)
  const importRegex = /import\s+.*from\s+['"]([^'"]+)['"]/g
  let match
  while ((match = importRegex.exec(code)) !== null) {
    const importSource = match[1]
    const isAllowed = ALLOWED_IMPORTS.some(
      (allowed) => importSource.includes(allowed) || importSource.startsWith(".")
    )

    if (!isAllowed && !importSource.startsWith("@")) {
      errors.push(
        `Import from "${importSource}" is not in the allowed list`
      )
    }
  }

  // Check for at least basic React JSX syntax
  if (!code.includes("return") && !code.includes("jsx") && !code.includes("<")) {
    errors.push("Code does not appear to be valid React/JSX")
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedCode,
  }
}

/**
 * Quick check if code appears to be valid React
 */
export function isValidReactCode(code: string): boolean {
  if (!code || code.trim().length === 0) return false

  // Must have JSX
  if (!code.includes("<") || !code.includes(">")) return false

  // Must export something
  if (!code.includes("export")) return false

  // Must not have dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) return false
  }

  return true
}

/**
 * Extract error messages for user display
 */
export function getErrorMessage(errors: string[]): string {
  if (errors.length === 0) return ""

  if (errors.length === 1) {
    return `⚠️ ${errors[0]}`
  }

  return `⚠️ Multiple issues found:\n${errors.map((e) => `• ${e}`).join("\n")}`
}
