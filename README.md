# MINORE - Page Generator

An intelligent AI-powered React component generator that transforms natural language prompts into beautiful, production-ready web pages with live preview and code editing capabilities.

## 🎯 Features

- **🤖 AI-Powered Code Generation** - Generate React components from simple text descriptions using Groq API
- **👁️ Live Preview** - See your generated components render in real-time with Tailwind CSS styling
- **💾 Code Editor** - View and edit the generated code with syntax highlighting
- **💾 Save & Load** - Store generated pages locally and reload them anytime
- **📊 Export** - Download your saved pages as JSON backup
- **🎨 Tailwind CSS Support** - Full Tailwind CSS styling out of the box
- **🔒 Security** - Code validation and sanitization to ensure safe execution
- **📱 Responsive Design** - Works seamlessly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Groq API Key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/iyed-guizeni/MINORE_page_generater.git
cd MINORE_page_generater
```

2. **Install dependencies:**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

4. **Run the development server:**

```bash
npm run dev
# or
pnpm dev
```

5. **Open in browser:**
   Visit `http://localhost:3000`

## 📖 Usage

### Generating a Page

1. Enter a natural language description in the prompt field
2. Click the **"Generate"** button
3. View the live preview in the Preview tab
4. Check the generated code in the Code tab

### Example Prompts

- "Create a modern hero section with a gradient background and call-to-action button"
- "Build a pricing table with 3 tiers and feature comparison"
- "Make a contact form with name, email, and message fields"
- "Create a product card with image, title, description, and buy button"

### Saving Pages

1. After generating a component, click **"Save"** button
2. Your page is stored in browser's local storage
3. Click **"Saved Pages"** (bottom-right) to view all saved pages
4. Load, copy code, or delete saved pages

### Exporting Pages

1. Open **"Saved Pages"** dropdown
2. Click the **Download icon** to export all pages as JSON
3. Share or backup your generated pages

## 🏗️ Project Structure

```
MINORE_page_generater/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # AI code generation endpoint
│   ├── page.tsx                  # Main page component
│   └── layout.tsx                # App layout & metadata
├── components/
│   ├── preview-tab.tsx           # Live preview with iframe
│   ├── code-tab.tsx              # Code editor
│   ├── main-workspace.tsx        # Main editor interface
│   ├── navigation.tsx            # Header navigation
│   ├── sidebar.tsx               # Sidebar navigation
│   └── ui/                       # UI component library
├── lib/
│   ├── groq-service.ts           # Groq API integration
│   ├── code-sanitizer.ts         # Code validation & security
│   ├── api-client.ts             # API client utilities
│   └── utils.ts                  # Helper utilities
├── public/                       # Static assets
├── styles/                       # Global styles
├── package.json
└── tsconfig.json
```

## 🔧 Technology Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Code Generation:** Groq API (Mixtral LLM)
- **Code Preview:** React + Babel Standalone
- **Icons:** Lucide React
- **Notifications:** Sonner Toast
- **Analytics:** Vercel Analytics

## 🛡️ Security

- **Code Validation** - Generated code is validated for safety patterns
- **Import Restrictions** - Only allowed imports are permitted
- **Dangerous Pattern Detection** - Blocks eval, dangerous HTML, XSS attempts
- **Sandboxed Preview** - Code runs in isolated iframe with strict sandbox rules

## 📦 Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**

```bash
git add .
git commit -m "Deploy MINORE Page Generator"
git push -u origin main
```

2. **Deploy to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository
   - Add environment variable: `GROQ_API_KEY`
   - Click "Deploy"

3. **Get your live URL** (e.g., `https://minore.vercel.app`)

## 🔑 Environment Variables

| Variable         | Description                      | Required |
| ---------------- | -------------------------------- | -------- |
| `GROQ_API_KEY`   | Groq API key for code generation | ✅ Yes   |
| `GEMINI_API_KEY` | (Optional) Google Gemini API key | ❌ No    |

## 📝 API Endpoints

### POST `/api/generate`

Generate React component code from a prompt.

**Request:**

```json
{
  "prompt": "Create a button that says click me"
}
```

**Response:**

```json
{
  "code": "function Component() { return <button>Click me</button> }",
  "success": true
}
```

**Error Response:**

```json
{
  "error": "Error message",
  "code": ""
}
```

## 🐛 Troubleshooting

### "Cannot use import statement outside a module"

- This is handled automatically - imports are stripped before preview rendering

### "Component is not defined"

- Make sure the generated code has a named component (function or const)

### Groq API errors

- Verify your API key is correct in `.env.local`
- Check your Groq account has quota available
- Rate limit: 30 requests per minute

### Preview not rendering

- Check browser console (F12) for errors
- Verify generated code has valid JSX syntax
- Try a simpler prompt first

## 📊 Performance Tips

- Keep prompts concise and descriptive
- Use the Code tab to verify generated code quality
- Save frequently used components for reuse
- Export pages regularly as backup

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💼 Author

**Iyed Guizeni**

- GitHub: [@iyed-guizeni](https://github.com/iyed-guizeni)
- Project: [MINORE_page_generater](https://github.com/iyed-guizeni/MINORE_page_generater)

## 🙏 Acknowledgments

- [Groq](https://groq.com) - For the fast LLM API
- [Vercel](https://vercel.com) - For deployment platform
- [Tailwind CSS](https://tailwindcss.com) - For utility-first CSS
- [Radix UI](https://www.radix-ui.com) - For accessible components
- [shadcn/ui](https://ui.shadcn.com) - For component library

## 📧 Support

For support and questions:

- Create an issue on GitHub
- Check existing documentation
- Review example prompts in the app

---

**Happy generating! 🚀**

Built with ❤️ using Next.js, React, and AI
