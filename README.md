# Lighthouse Take-Home Assignment - O-1 Visa Case Builder

An AI-powered application that guides users through building their O-1 visa case. The app analyzes your background, recommends the strongest criteria for your profile, and helps you collect evidence with intelligent assistance at every step.

See [ASSIGNMENT.md](./docs/ASSIGNMENT.md) for the problem statement and requirements.
See [DESIGN.md](./docs/DESIGN.md) for my thought process from ideation to implementation.


## Quick Start

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore enabled
- An OpenAI API key (for AI-powered recommendations and chat assistant)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**

   Create a `.env.local` file with the following variables:

   **Firebase Configuration:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Go to Project Settings > General > Your apps > Add web app
   - Copy the Firebase config values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

   **OpenAI API Key (for AI features):**
   - Get an API key from https://platform.openai.com/api-keys
   - Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open http://localhost:3000**

## Features

- **AI-Powered Questionnaire** - Multi-step profile questionnaire that collects user background, achievements, and goals
- **Smart Criteria Recommendations** - AI analyzes your responses and recommends the 3 strongest O-1 criteria for your case with match scores (0-100%) and reasoning
- **AI Chat Assistant** - Always-available chatbot to answer questions about O-1 visa requirements, evidence gathering, and case strategy at any point in the flow
- **Visual Dashboard** - Overview of your recommended criteria with progress tracking (completed, in-progress, not started)
- **Evidence Collection** - Dynamic forms for each criteria with multiple field types (text, textarea, date, URL, file upload)
- **File Upload Support** - Upload documents directly (PDF, images, Word docs) in addition to linking to external URLs
- **Save/Resume** - Generate shareable link to save progress and continue later
- **Firebase Persistence** - All data stored securely in Firestore
- **Case Submission** - Submit completed applications for review

## AI Features

This application uses OpenAI's GPT models to provide intelligent assistance throughout the O-1 visa application process:

### 1. Criteria Recommendation Engine
- Analyzes user questionnaire responses about background, achievements, and career highlights
- Evaluates fit against all 8 O-1 visa criteria using structured prompts
- Returns the top 3 strongest criteria with:
  - **Match Score (0-100%)** - Quantifies how well your profile fits each criteria
  - **Reasoning** - Explains why this criteria is a good fit based on your specific background
  - **Evidence Requirements** - Shows what documentation you need to provide

### 2. Always-Available Chat Assistant
- Accessible from any page via a floating chat button
- Answers questions about:
  - O-1 visa requirements and eligibility
  - What qualifies as strong evidence for specific criteria
  - How to structure evidence submissions
  - General guidance on the application process
- Provides contextual help based on where you are in the flow
- Maintains conversation history during your session

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes (Vercel Functions)
- **Database:** Firebase Firestore
- **AI:** OpenAI GPT-4 (criteria recommendations and chat)
- **Language:** TypeScript

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── questionnaire/[caseId]/       # Profile questionnaire flow
│   ├── dashboard/[caseId]/           # AI recommendations dashboard
│   ├── evidence/[caseId]/[criteriaId]/ # Evidence collection pages
│   └── api/
│       ├── cases/                    # Case CRUD operations
│       └── ai/                       # AI endpoints (recommendations, chat)
├── components/
│   ├── ui/                           # Base components (Button, Input, etc.)
│   ├── questionnaire/                # Question components and container
│   ├── chatbot/                      # AI chat assistant widget
│   └── fields/                       # Form field components (Text, Date, File, URL)
├── hooks/
│   ├── useQuestionnaire.ts           # Questionnaire state management
│   └── useChatbot.ts                 # Chatbot state management
└── lib/
    ├── firebase/                     # Firebase config and helpers
    └── schemas/                      # TypeScript types, criteria, and questionnaire definitions
```

## Workflow

1. **Landing Page** - Start new case or resume existing
2. **Profile Questionnaire** - Answer questions about your background, achievements, salary, and career highlights
3. **AI Analysis** - System analyzes your responses to identify your 3 strongest criteria
4. **Dashboard** - View your recommended criteria with AI match scores and reasoning
5. **Evidence Collection** - Click each criteria to provide detailed evidence (files, URLs, descriptions)
6. **Progress Tracking** - Monitor completion status across all 3 criteria
7. **Submit Application** - Final submission once all criteria are complete

## Save/Resume

- Progress is automatically saved as you move through the questionnaire
- Click "Save Draft" on the dashboard or evidence pages to copy a shareable link to clipboard
- The link includes a resume token and can access:
  - `/questionnaire/[caseId]?token=[resumeToken]` - Resume questionnaire
  - `/dashboard/[caseId]?token=[resumeToken]` - Resume from dashboard
  - `/evidence/[caseId]/[criteriaId]?token=[resumeToken]` - Resume evidence collection
- Opening the link restores the case at the last saved state

---

## Problem Analysis

See [ASSIGNMENT.md](./ASSIGNMENT.md) for the original problem statement.

### Assumptions About Users
- **Stressed** - The visa process is high-stakes and confusing
- **Uninformed** - They may not understand what evidence qualifies
- **Disorganized** - They don't have all documents ready at once

### Design Decisions

1. **AI-First Approach** - Let AI analyze the user's profile and recommend the strongest path forward, removing the burden of choice from stressed users
2. **Profile Before Evidence** - Understand the applicant's background first through a guided questionnaire, then use that context to personalize recommendations
3. **Visual Progress Tracking** - Clear dashboard showing completion status with color-coded badges (completed, in-progress, not started)
4. **Multiple Evidence Formats** - Support both file uploads and URL links to accommodate different user preferences
5. **Always-Available Help** - AI chatbot accessible from any page to answer questions without interrupting the flow
6. **Progress Persistence** - Auto-save questionnaire responses and manual save for evidence with shareable links
7. **Simple Language** - Explain requirements without legal jargon, using examples and context

### Future Enhancements

1. **Evidence Strength Validation** - Use AI to analyze if submitted evidence is strong enough and suggest improvements
2. **Firebase Storage Integration** - Upload files directly to Firebase Storage with secure URLs instead of storing filenames
3. **Email Notifications** - Send resume link and progress updates via email
4. **Case Manager Dashboard** - Admin interface to review submissions and provide feedback
5. **Expert Letters Generator** - AI-assisted tool to draft recommendation letters
6. **Evidence Templates** - Pre-filled examples and templates for common evidence types
7. **Multi-language Support** - Translate interface and guidance into multiple languages
