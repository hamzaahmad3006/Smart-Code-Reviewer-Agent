# Smart Code Reviewer Agent 🚀

An AI-powered code review tool that acts like a senior software engineer. It analyzes your code for bugs, anti-patterns, and quality issues, providing detailed feedback and a quality score.

## Features

- 🤖 **AI Analysis**: Powered by OpenAI GPT-4
- 📝 **Code Input**: Syntax-highlighted editor
- 📁 **File Upload**: Direct analysis of `.js`, `.ts`, `.py` files
- 📊 **Smart Scoring**: 0-10 quality score with detailed reasoning
- 🎨 **Premium UI**: Beautiful, dark-themed responsive interface
- 📜 **History**: Session history to track your reviews

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: Python, FastAPI, OpenAI
- **AI**: GPT-4 Code Analysis

## Setup Instructions

### 1. Backend Setup

Prerequisites: Python 3.10+

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration:**
1. Copy `.env.example` to `.env`
2. Add your OpenAI API Key:
   ```
   OPENAI_API_KEY=sk-...
   ```

**Run Server:**
```bash
python main.py
# Server starts at http://localhost:8000
```

### 2. Frontend Setup

Prerequisites: Node.js 18+

```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:3000
```

## Usage

1. Open the [Web App](http://localhost:3000)
2. Click **Start Reviewing**
3. Paste code OR Drag & drop a file
4. Click **Review Code**
5. View detailed results, score, and suggestions!

## Project Structure

```
├── backend/
│   ├── services/      # AI Logic
│   ├── models/        # Pydantic Schemas
│   ├── utils/         # Validators
│   └── main.py        # API Entry Point
├── frontend/
│   ├── app/           # Next.js Pages
│   ├── components/    # Reusable UI Components
│   └── lib/           # API Utilities
```
