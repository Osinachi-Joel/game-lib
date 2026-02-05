# Game Library Manager & Bookmark Scanner

A local web application to scan your browser bookmarks for games, organize them, and manage your collection with a beautiful UI.

## Features
- **Auto-Scan**: Automatically scans Chrome, Edge, Firefox, and Opera bookmarks for game-related entries.
- **Clean Titles**: Intelligent cleaning of game titles (removes "Download", version numbers, repack suffixes).
- **Library Management**: Add, edit, and delete games manually.
- **Local First**: Your data stays on your machine (MongoDB).

## Prerequisites
1. **Node.js**: [Download and Install Node.js](https://nodejs.org/) (v18 or higher recommended).
2. **MongoDB**: You need a running MongoDB instance.
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) and run it locally.
   - OR use a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/atlas).

## Installation

1.  **Clone/Download** this repository.
2.  Open a terminal in the project folder.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Configure Environment**:
    - Copy `.env.example` to `.env`.
    - Edit `.env` and set your `MONGODB_URI`.
    - Example for local DB: `mongodb://localhost:27017/game-lib`

## Running the App

### Windows
Double-click `start-app.bat` to launch the application.

### Manual Start
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
1.  **Scan**: Click the "Scan" button. Ensure your games are in a bookmark folder named **"Games"**.
2.  **Manage**: Edit titles or delete entries.
3.  **Clean**: Use "Delete History" to wipe scanned files or reset the database.

## Troubleshooting
- **No Bookmarks Found?** Make sure your bookmarks are in a top-level folder named "Games".
- **Database Error?** Check if MongoDB is running and the connection string in `.env` is correct.
