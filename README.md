📄 **Document Intelligence & Knowledge Search Hub**

Turn your documents into instant answers.

Upload PDFs or text files → ask questions → get AI-powered responses backed by document excerpts.

Built with MERN + RAG-style retrieval.

🚀 **Live Demo**

Use the app here:https://document-intellegence-hub.vercel.app/

🚀 **Features**

Authentication — signup & login with JWT

Upload PDF / TXT

Extract & store document text in MongoDB

Chat interface for asking questions

AI answers strictly from your uploaded content

Reference excerpts shown for every answer

Query history preserved during session

Delete uploaded documents

Deployed (Backend on Render, Frontend on Vercel)

🏗️ **Tech Stack**

**Frontend**

React (Create React App)

Fetch API

Protected routes

**Backend**

Node + Express

JWT authentication

Multer (file uploads)

PDF parsing

REST APIs

**Database**

MongoDB Atlas

**AI**

**Running Locally (Dev Mode)**

1️⃣ **Backend**

cd backend

npm install

Create .env with:

MONGO_URL=your_mongo_uri

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key

npm start


Runs at:

http://localhost:5000

2️⃣ **Frontend**

cd frontend

npm install

npm start


Runs at:

http://localhost:3000

**Live Deployment** 

Backend: Render (Node Service)

Frontend: Vercel

Frontend uses environment variable:

REACT_APP_API_BASE=https://YOUR-BACKEND.onrender.com

**Key API Endpoints**

**Auth**

POST /auth/signup

POST /auth/login

**Documents**

GET    /documents

POST   /documents/upload

DELETE /documents/:id

⚠️ **Known Limitations**

Embeddings are replaced with a simpler “recent chunk” heuristic (free-tier friendly).

Large PDFs may respond slower.

Query history resets on page refresh.

Groq API (Llama model — fast + cost-free tier)
