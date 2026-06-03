# 🎁 Gift Whisperer - Anti-Generic Gift Finder

> **Never give a generic gift again!** Gift Whisperer is an intelligent gift recommendation engine that understands your recipients and suggests thoughtful, personalized gifts tailored to their unique preferences, interests, and personality traits.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)

## 📚 About

Gift Whisperer is a web application designed to solve the eternal problem: **"What should I gift them?"** Using artificial intelligence and machine learning, the app analyzes recipient information—their hobbies, interests, personality, budget, and occasion—to generate thoughtful, personalized gift suggestions that go beyond generic options.

Whether you're shopping for a birthday, anniversary, holiday, or any special occasion, Gift Whisperer helps you find the perfect gift that shows you truly know the person.

## ✨ Features

- **Smart Gift Recommendations**: AI-powered suggestions using Groq & Google Gemini
- **Recipient Profiles**: Create and manage detailed recipient profiles with interests and preferences
- **Budget Filtering**: Set your budget and get suggestions within your price range
- **Occasion-Based Suggestions**: Different recommendations for birthdays, holidays, anniversaries, etc.
- **User Authentication**: Secure authentication with Supabase
- **Personalized Dashboard**: View past recommendations and manage your gift history
- **Responsive Design**: Beautiful UI built with Tailwind CSS and Lucide icons
- **Real-time Updates**: Live notifications using Sonner toast notifications

## 🛠 Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS 4, PostCSS
- **Backend**: Next.js API Routes, Supabase
- **AI/ML**: Groq API, Google Gemini AI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR support
- **UI Components**: Custom components with Lucide icons
- **Form Validation**: Zod
- **Date Handling**: date-fns
- **Development**: ESLint, TypeScript

## 📦 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Usually comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/padmashri23/-Gift-Whisperer---Anti-Generic-Gift-Finder.git
cd Gift-Whisperer
```

### 2. Install Dependencies

```bash
npm install
```

## ⚙️ Configuration

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Your API Keys

#### Supabase Setup:
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Copy your project URL and anon key from Settings → API
4. Paste them in `.env.local`

#### Groq API Setup:
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up and create an API key
3. Add it to `GROQ_API_KEY` in `.env.local`

#### Google Gemini Setup:
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add it to `GEMINI_API_KEY` in `.env.local`

## 🎯 Running the Project

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Build the project for production:

```bash
npm run build
```

### Start Production Server

After building, start the production server:

```bash
npm start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
Gift-Whisperer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (app)/             # Main app routes
│   │   │   ├── find/          # Gift finder page
│   │   │   ├── recipients/    # Recipients management
│   │   │   ├── settings/      # User settings
│   │   │   └── layout.tsx     # App layout
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── gift-finder/       # Gift finder components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utility functions
│   │   ├── ai/               # AI integration (Groq, Gemini)
│   │   └── utils.ts          # Helper functions
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── supabase/                 # Supabase configurations
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## 🧠 How It Works

### Gift Recommendation Flow

1. **User Authentication**: Users sign in with their Supabase account
2. **Recipient Profile**: Create a detailed profile with recipient's interests, personality, and preferences
3. **AI Analysis**: The app processes the recipient data through Groq/Gemini AI
4. **Smart Filtering**: Filter suggestions by budget and occasion
5. **Personalized Results**: Receive thoughtful, non-generic gift recommendations
6. **History Tracking**: Save and revisit past recommendations

### AI Integration

- **Primary AI**: Groq API for fast processing
- **Fallback**: Google Gemini for backup recommendations
- **Prompts**: Custom prompts designed to generate thoughtful, specific gift ideas
- **Response Parsing**: Structured parsing of AI responses for consistent formatting

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 💡 Tips

- **Better Recommendations**: The more detailed the recipient profile, the better the AI recommendations
- **Multiple Suggestions**: Run the finder multiple times with different parameters to get variety
- **Budget Awareness**: Set realistic budgets for the most relevant suggestions
- **Occasion Matters**: Specify the occasion for more contextual recommendations

---

**Made with ❤️ to make gift-giving personal and thoughtful**
