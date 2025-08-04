# Deployment Guide - Render.com

This guide will help you deploy your AMD PPM Dashboard to Render.com.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Your database should be accessible from Render

## Step 1: Prepare Your Repository

Your repository should have the following structure:
```
AMD_Project/
├── client/                  # React frontend
├── server/                  # Node.js backend
├── render.yaml             # Render configuration
├── package.json            # Root package.json
└── README.md              # Project documentation
```

## Step 2: Deploy Backend API

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" and select "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your repository: `danieldzy7/AMD_Project`

3. **Configure Backend Service**
   - **Name**: `amd-ppm-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

4. **Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB connection string

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL: `https://amd-ppm-backend.onrender.com`

## Step 3: Deploy Frontend

1. **Create Static Site**
   - Click "New +" and select "Static Site"
   - Connect the same repository

2. **Configure Frontend Service**
   - **Name**: `amd-ppm-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Plan**: Free

3. **Environment Variables**
   - `REACT_APP_API_URL`: `https://amd-ppm-backend.onrender.com`

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL: `https://amd-ppm-frontend.onrender.com`

## Step 4: Alternative - Use render.yaml (Recommended)

Instead of manual setup, you can use the provided `render.yaml`:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy via Blueprint**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" and select "Blueprint"
   - Connect your repository
   - Render will automatically create both services

## Environment Variables

### Backend (amd-ppm-backend)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Frontend (amd-ppm-frontend)
```
REACT_APP_API_URL=https://amd-ppm-backend.onrender.com
```

## Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 minutes of inactivity
- **Frontend**: Always available
- **Build Time**: Limited to 500 minutes per month

### Performance
- First request to backend may take 30-60 seconds (cold start)
- Subsequent requests are faster
- Consider upgrading to paid plan for better performance

### Database
- Ensure your MongoDB Atlas cluster allows connections from Render
- Add `0.0.0.0/0` to IP whitelist for development
- Use specific IP ranges for production

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Fails**
   - Verify `REACT_APP_API_URL` is correct
   - Check backend service is running
   - Ensure CORS is properly configured

3. **Database Connection Fails**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

### Logs
- View logs in Render dashboard
- Backend logs: Service → Logs
- Frontend logs: Service → Logs

## Monitoring

### Health Checks
- Backend health check: `https://amd-ppm-backend.onrender.com/api/health`
- Should return: `{"status":"OK","message":"AMD PPM Dashboard API is running normally"}`

### Performance
- Monitor response times in Render dashboard
- Set up alerts for service downtime
- Track build times and success rates

## Security

### Environment Variables
- Never commit sensitive data to Git
- Use Render's environment variable system
- Rotate database passwords regularly

### CORS
- Backend is configured to accept requests from any origin
- For production, restrict to specific domains

## Cost Optimization

### Free Tier
- Perfect for development and testing
- Limited but sufficient for small projects

### Paid Plans
- Consider upgrading for:
  - Faster cold starts
  - More build minutes
  - Custom domains
  - SSL certificates

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Community**: [community.render.com](https://community.render.com)
- **Status Page**: [status.render.com](https://status.render.com) 