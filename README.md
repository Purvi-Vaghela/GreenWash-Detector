# GreenWash Detector

AI-powered ESG audit tool that compares corporate sustainability claims against real-world data to detect greenwashing.

## Features

- **Dual Login System**: Industry clients and Government admins
- **AI-Powered Analysis**: Uses GPT-4o to analyze sustainability reports
- **Trust Score**: Mathematical scoring based on Specificity, Consistency, and Verification
- **News Cross-Reference**: Searches for contradicting news via Serper.dev
- **Traffic Light System**: RED (<40), YELLOW (40-75), GREEN (>75)
- **MongoDB Storage**: Files stored in GridFS, analysis results persisted

## Quick Start

### Prerequisites
- MongoDB running locally (or update MONGODB_URL in .env)
- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file with your API keys
cp .env.example .env
# Edit .env and add your keys

# Run the server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

```
OPENAI_API_KEY=your_openai_api_key
SERPER_API_KEY=your_serper_api_key
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=greenwash_detector
```

## API Endpoints

- `POST /analyze` - Upload and analyze a PDF report
- `GET /reports` - List all analyzed reports
- `GET /reports/{id}` - Get specific report
- `DELETE /reports/{id}` - Delete a report
