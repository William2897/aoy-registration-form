# AOY 2025 Registration System

A full-stack web application for handling registrations for the AOY 2025 conference event.

## Overview

This project provides a comprehensive registration system for the AOY 2025 event, allowing participants to register themselves and their family members, order conference shirts, select food preferences, and complete payment.

![AOY Registration System](frontend/src/assets/aoy%20logo.svg)

## Features

- **User Registration**: Collect personal information from participants
- **Health & Dietary Information**: Track food preferences and health concerns
- **Family Registration**: Register multiple family members with a family discount
- **T-shirt Ordering**: Optional conference shirt ordering with size selection
- **Payment Processing**: Support for bank transfer with payment proof upload
- **Responsive Design**: Mobile-friendly interface with dark mode support
- **Early Bird Discounts**: Special pricing for early registrations
- **Volunteer Selection**: Sign up to volunteer for various event teams

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- React Select for enhanced dropdown components

### Backend
- Node.js with Express
- TypeORM with PostgreSQL database
- SendGrid for email notifications
- Multer for file uploads
- Cloudinary for file storage
- JWT for authentication

## Development Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL database

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/aoy-2025-registration.git
cd aoy-2025-registration/frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

## Deployment Information

### Repository Structure

This repository contains both frontend and backend code, but they are deployed separately:

- **Frontend**: Pushed to this GitHub repository and can be deployed to services like Vercel, Netlify, or GitHub Pages.
- **Backend**: The backend code is deployed directly to Heroku and is excluded from Git tracking in this repository.

### Why Separate Deployments?

The backend is deployed directly to Heroku for several reasons:
1. **Environment Variables**: Sensitive configuration (database credentials, API keys) is managed directly in Heroku
2. **Database Integration**: Heroku PostgreSQL add-on is used for the production database
3. **CI/CD Pipeline**: Backend has a separate deployment workflow with Heroku's Git integration

### Future Plans

We plan to eventually include the backend code in this repository with proper environment variable management and deployment instructions. This will help with:
- Better code collaboration
- Unified version control
- Improved documentation

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact: aoyregister.aoy@gmail.com