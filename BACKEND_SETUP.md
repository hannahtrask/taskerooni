# Backend Setup Instructions

## Required: Enable CORS in Your Backend

Since your frontend (port 3000) needs to communicate with your backend (port 8080), you need to enable CORS in your backend Express app.

### Add CORS to your backend:

1. Install CORS package in your backend project:
```bash
npm install cors
npm install --save-dev @types/cors
```

2. Update your backend's main server file (usually `index.ts` or `server.ts`):

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Your routes here
app.use('/api/tasks', taskRoutes);

// ... rest of your server setup
```

## Running Both Servers

1. **Start your backend** (in your backend project directory):
```bash
npm run dev
```
This should start on port 8080

2. **Start your frontend** (in this directory):
```bash
npm run dev
```
This should start on port 3000

## Environment Variables

The frontend is configured to use:
- `NEXT_PUBLIC_API_URL=http://localhost:8080`

This is set in `.env.local`

## Testing

Once both servers are running:
1. Open http://localhost:3000
2. You should see the Task Board
3. Try creating a task - it will be saved to MongoDB via your backend API
4. Tasks will persist across page refreshes

## Troubleshooting

If you see CORS errors in the browser console:
- Make sure CORS is enabled in your backend (see above)
- Verify your backend is running on port 8080
- Check that the NEXT_PUBLIC_API_URL in .env.local is correct

If tasks don't load:
- Check browser console for errors
- Verify your backend MongoDB connection is working
- Make sure your backend routes are at `/api/tasks`

