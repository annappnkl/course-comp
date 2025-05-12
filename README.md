# 🌐 Course Dashboard – Template-Based Web Info Extractor

This is a full-stack web application that helps you extract and organize information from websites using custom templates powered by GPT. You define your own labels (like “Duration”, “Location”, or “Application Deadline”), add website URLs, and the app uses AI to retrieve relevant values — even when terms vary between pages or languages.

## Example Use Case

For example, you can compare acting course pages by extracting duration, requirements, application deadline, and tuition.

##### User input
Labels:
- course title
- organisor
- date and duration
- location
- course time schedule
- price

Links:
- course link 1
- course link 2
- course link 3

##### Output
- Course Title: Shakespeare Summer School (8 Weeks)
- Organiser: London Academy of Music & Dramatic Art
- Location: In-person at LAMDA
- Date and Duration: Monday 16 June - Friday 8 August 2025 (8 Weeks)
- Course Time Schedule: From 10am - 5:30pm each day
- Price: UK Applicants: £3,500, International Applicants: £6,010

---

## ✨ Features

- 🧠 GPT-based smart extraction with translation and inference
- 🏷️ User-defined templates with custom labels
- 🔗 Add multiple URLs to scan
- 🗂️ Dashboard display of results in original language
- ⚡ Built with React (Vite) frontend & Node.js backend

---

## 📦 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **AI:** OpenAI API (`gpt-3.5-turbo`)
- **Parsing:** Cheerio for HTML content extraction
- **HTTP:** Axios
- **Styling:** TailwindCSS

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/course-comp.git
cd course-comp

### 2 Install dependencies
For the frontend:

cd client
npm install

For the backend:

cd ..
npm install

### 3. Set up your .env file
In the root or server folder, create a .env file:

OPENAI_API_KEY=your-openai-key

### 4. Run the app
In two terminals:

#### Terminal 1 - backend
cd .. #or server
node server.js

#### Terminal 2 - frontend
cd client
npm run dev

## Environment Setup Notes

Make sure .env is in your .gitignore. 

## 💡 Process

- Save/load templates and sessions
- Enhance error handling and toast messages