# Issue Tracker

## Overview
This is a FreeCodeCamp Issue Tracker project - a full-stack web application for managing project issues. It provides a RESTful API and a simple web interface for creating, reading, updating, and deleting issues.

## Project Architecture
- **Backend**: Node.js with Express.js (port 5000)
- **Database**: MongoDB (via Mongoose ODM)
- **Frontend**: Static HTML/CSS with jQuery
- **Testing**: Mocha and Chai

## Key Features
- Create new issues with title, description, and assignment
- View issues by project with filtering support
- Update existing issues
- Delete issues
- RESTful API endpoints

## Recent Changes (December 7, 2025)
- Imported from GitHub
- Configured for Replit environment
- Updated server to bind to 0.0.0.0:5000 for Replit webview
- Removed deprecated MongoDB connection options
- Added conditional MongoDB connection check
- Created .gitignore for Node.js
- Set up workflow to run the application

## Configuration
- **PORT**: 5000 (set in environment variables)
- **MONGO_URI**: **REQUIRED** - MongoDB connection string (must be set by user)
  - ⚠️ **The application will NOT function without a valid MONGO_URI**
  - The API will return "database unavailable" errors until this is configured
  - To set: Add MONGO_URI to your Secrets with your MongoDB connection string
  - Get a free MongoDB database at: https://www.mongodb.com/atlas
- **NODE_ENV**: development

## API Endpoints
- `GET /api/issues/:project` - Get all issues for a project (with optional filters)
- `POST /api/issues/:project` - Create a new issue
- `PUT /api/issues/:project` - Update an issue by ID
- `DELETE /api/issues/:project` - Delete an issue by ID

## Database Schema
Issues contain:
- issue_title (required)
- issue_text (required)
- created_by (required)
- assigned_to (optional)
- status_text (optional)
- open (boolean, default true)
- created_on (timestamp)
- updated_on (timestamp)
- project (string)

## Setup Notes
To use this application, you need to:
1. Provide a MongoDB connection string as MONGO_URI environment variable
2. The application will run on port 5000
3. Access the web interface at the root URL
4. Use the API endpoints for programmatic access

## User Preferences
None specified yet.
