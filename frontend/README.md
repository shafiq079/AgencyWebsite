# Frontend Application

This is the frontend application for the portfolio project with admin panel.

## Environment Setup

### Development
Create a `.env.local` file in the frontend directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production (Vercel)
Set the following environment variable in your Vercel project settings:
```
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com/api
```

Replace `your-backend-app.onrender.com` with your actual Render backend URL.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

## Deployment

The application is configured for deployment on Vercel. Make sure to:

1. Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel
2. Ensure your backend is deployed and accessible
3. Configure CORS on your backend to allow requests from your Vercel domain

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
