# 🌱 GreenWash Detector

An AI-powered ESG audit tool that analyzes corporate sustainability reports to detect greenwashing by cross-referencing claims against real-world news data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

GreenWash Detector helps identify misleading environmental claims in corporate sustainability reports by:
1. Extracting text from PDF sustainability reports
2. Analyzing claims using GPT-4o
3. Cross-referencing with real-world news via Serper API
4. Generating a trust score based on specificity, consistency, and verification
5. Highlighting contradictions and providing detailed audit metrics

## ✨ Features

- **🤖 AI-Powered Analysis**: Leverages GPT-4o to analyze sustainability claims
- **📊 Trust Score System**: Mathematical scoring (0-100) based on:
  - Specificity (quantifiable metrics)
  - Consistency (internal alignment)
  - Verification (external validation)
- **🚦 Traffic Light Rating**: 
  - 🔴 RED (<40) - High greenwashing risk
  - 🟡 YELLOW (40-75) - Moderate concerns
  - 🟢 GREEN (>75) - Trustworthy claims
- **📰 News Cross-Reference**: Searches for contradicting information via Serper.dev
- **💾 MongoDB Storage**: Files stored in GridFS, analysis results persisted
- **📈 Audit Metrics**: Detailed breakdown of claims, contradictions, and recommendations
- **📜 Report History**: Track and compare multiple reports over time

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   FastAPI    │─────▶│   MongoDB   │
│  Frontend   │      │   Backend    │      │   Database  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├─────▶ OpenAI GPT-4o
                            │
                            └─────▶ Serper News API
```

**Tech Stack:**
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + Python 3.10+
- **Database**: MongoDB + GridFS
- **AI**: OpenAI GPT-4o
- **News API**: Serper.dev

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher** - [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **API Keys**:
  - OpenAI API Key - [Get here](https://platform.openai.com/api-keys)
  - Serper API Key - [Get here](https://serper.dev/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GreenWash-Detector
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
py -m pip install -r requirements.txt

# Or use pip directly if available
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `backend/.env` with your credentials:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-openai-key-here

# Serper API Configuration
SERPER_API_KEY=your-serper-api-key-here

# MongoDB Configuration
# Option 1: Local MongoDB
MONGODB_URL=mongodb://localhost:27017

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Database Name
MONGODB_DB_NAME=greenwash_detector
```

### MongoDB Setup

**Option A: Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URL` in `.env` with your connection string

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Verify Installation

1. Backend health check: Visit `http://localhost:8000/health`
2. API documentation: Visit `http://localhost:8000/docs`
3. Frontend: Visit `http://localhost:5173`

## 📚 API Documentation

### Endpoints

#### `GET /`
Health check endpoint
```json
{
  "message": "GreenWash Detector API",
  "status": "running"
}
```

#### `POST /analyze`
Upload and analyze a PDF sustainability report

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: PDF file

**Response:**
```json
{
  "id": "report_id",
  "filename": "sustainability_report.pdf",
  "uploaded_at": "2026-01-11T10:30:00",
  "analysis": {
    "trust_score": 65,
    "rating": "YELLOW",
    "specificity_score": 70,
    "consistency_score": 60,
    "verification_score": 65,
    "contradictions": [...],
    "key_claims": [...],
    "recommendations": [...]
  }
}
```

#### `GET /reports`
List all analyzed reports

#### `GET /reports/{report_id}`
Get specific report details

#### `DELETE /reports/{report_id}`
Delete a report and its associated file

### Interactive API Docs

FastAPI provides interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📁 Project Structure

```
GreenWash-Detector/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── ai_service.py      # OpenAI integration
│   │   │   ├── news_service.py    # Serper API integration
│   │   │   └── pdf_service.py     # PDF text extraction
│   │   ├── config.py              # Configuration management
│   │   ├── database.py            # MongoDB connection
│   │   ├── main.py                # FastAPI application
│   │   ├── models.py              # Pydantic models
│   │   └── prompts.py             # AI prompts
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment template
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # Entry point
│   ├── package.json               # Node dependencies
│   └── vite.config.js             # Vite configuration
└── README.md                      # This file
```

## 🔧 Troubleshooting

### Python not found
```bash
# Try using py launcher
py --version

# Or add Python to PATH
# Windows: Search "Environment Variables" → Edit PATH → Add Python directory
```

### MongoDB connection error
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Check connection string in .env
# Make sure MONGODB_URL is not empty
```

### Module not found errors
```bash
# Reinstall dependencies
cd backend
py -m pip install -r requirements.txt --force-reinstall
```

### Port already in use
```bash
# Backend (change port)
py -m uvicorn app.main:app --reload --port 8001

# Frontend (change port in vite.config.js or use)
npm run dev -- --port 5174
```

### CORS errors
The backend is configured to allow requests from `localhost:5173` and `localhost:3000`. If you're using a different port, update the CORS settings in `backend/app/main.py`.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.
