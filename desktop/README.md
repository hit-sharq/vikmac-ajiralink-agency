# Vikmac Ajira Desktop - Office Management System

Desktop application for managing workforce recruitment, job requests, visa processing, and payments.

## Features

- **Applicant Management** - Register and manage job applicants
- **Job Requests** - Create and manage employer job requests
- **Shortlisting** - Match and shortlist candidates for positions
- **Visa Processing** - Track visa applications and documentation
- **Payment Management** - Manage payments and generate receipts
- **Reports & Analytics** - View detailed reports and statistics
- **Database Sync** - Real-time sync with web system via shared PostgreSQL database

## Getting Started

### Prerequisites

- Node.js 16+ 
- PostgreSQL database (same as web system)
- npm or yarn

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:

\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

3. Generate Prisma client:

\`\`\`bash
npm run prisma:generate
\`\`\`

4. Run migrations (if needed):

\`\`\`bash
npm run prisma:migrate
\`\`\`

### Development

Start the application in development mode:

\`\`\`bash
npm run dev
\`\`\`

This will start both the React dev server and Electron app.

### Building

Build the application for distribution:

\`\`\`bash
npm run build
\`\`\`

The installer will be created in the \`dist\` directory.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Desktop Framework**: Electron
- **Database**: PostgreSQL (shared with web system)
- **ORM**: Prisma

## Database Connection

The desktop app connects to the same PostgreSQL database as the web system using the \`DATABASE_URL\` environment variable. This ensures real-time data sync between both systems.

## Default Login

**Email**: admin@vikmac.com  
**Password**: admin123

(Change these credentials in production)

## Support

For issues or questions, contact the development team.
