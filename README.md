# Job Emailer Manager - Frontend

Next.js frontend for the Job Emailer Manager application.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Mantine UI v7
- **Styling**: Tailwind CSS (for utilities)
- **State Management**: React hooks
- **API Client**: Axios
- **Icons**: Tabler Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:8000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
job-emailer-front-end/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx          # Home/login page
│   ├── auth/
│   │   └── callback/     # OAuth callback handler
│   └── dashboard/        # Main application dashboard
├── components/           # React components
│   ├── ApplicationsTable.tsx
│   ├── ApplicationsKanban.tsx
│   └── DashboardHeader.tsx
├── lib/                  # Utilities and API client
│   └── api.ts           # Axios API client with interceptors
└── public/              # Static files
```

## Features

- **Google OAuth Authentication**: Sign in with Google account
- **Application Management**: Track job applications with status updates
- **Multiple Views**: Table and Kanban board views
- **Real-time Updates**: Drag and drop in Kanban view
- **Search and Filter**: Find applications quickly
- **JWT Token Management**: Automatic token refresh

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000/api)

## Deployment

### Vercel Deployment

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com-personal:AdamFreemer/job-emailer-manager-front-end.git
git push -u origin master
```

2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your production API URL

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback`
4. Callback exchanges code for tokens
5. Tokens stored in localStorage
6. User redirected to dashboard

## API Integration

The app uses an Axios client with:
- Automatic token injection in headers
- Token refresh on 401 responses
- Error handling and notifications

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved