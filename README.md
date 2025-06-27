# 🎨 AI Chat Terminal

A beautiful, minimalistic terminal-style chat application with AI integration, built with Next.js and deployed on Vercel.

## ✨ Features

- **Terminal UI**: Minimalistic, pastel-colored terminal interface
- **Dark Mode Toggle**: Smooth slider switch between light and dark themes
- **Conversation Context**: AI remembers the full conversation history
- **Real-time Streaming**: Responses stream in real-time
- **Auto-scroll**: Chat automatically scrolls to latest messages
- **Input Focus**: Keeps focus on input for seamless typing
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Click "Deploy"

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API
- **Deployment**: Vercel
- **API**: Next.js API Routes

## 📁 Project Structure

```
The-AI-Engineer-Challenge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # Chat API endpoint
│   │   ├── page.tsx                  # Main chat UI
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   └── ...
├── package.json
├── vercel.json                       # Vercel configuration
└── README.md
```

## 🔧 Configuration

### OpenAI API Key
- Enter your OpenAI API key in the chat interface
- The key is stored locally and never sent to our servers
- Supports GPT-4o-mini model

### Environment Variables (Optional)
For production, you can set environment variables in Vercel:
- `OPENAI_API_KEY`: Default API key (optional)

## 🎨 Customization

### Themes
- **Light Mode**: Pastel pink, blue, and green gradient
- **Dark Mode**: Professional dark theme
- **Toggle**: Slider switch in top-right corner

### Styling
- All styles use Tailwind CSS
- Easy to customize colors and layout
- Responsive design included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Vercel
