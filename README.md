# IT Delivery Dashboard

A comprehensive IT delivery management system with role-based access control, built with React frontend and Flask backend.

## 🚀 Quick Start

### Frontend Only (Development Mode)
The frontend is currently running in **fallback mode** with mock authentication. You can login with these credentials:

- **Admin**: admin@zapcg.com / admin123  
- **Finance**: finance@zapcg.com / finance123
- **HR**: hr@zapcg.com / hr123
- **Manager**: manager@zapcg.com / manager123

### Backend Setup (Full Functionality)

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Set up Environment Variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
DATABASE_URL=postgresql://username:password@localhost:5432/it_delivery_db
JWT_SECRET_KEY=your-jwt-secret-key
```

3. **Set up PostgreSQL Database**
```bash
# Create database
createdb it_delivery_db

# Run the schema
psql -d it_delivery_db -f database_schema.sql

# Insert sample data (optional)
psql -d it_delivery_db -f sample_data.sql
```

4. **Start the Backend Server**
```bash
python start_server.py
```

5. **Switch to Backend Mode**
```bash
# In src/services/api.ts, change:
const FALLBACK_MODE = false;
```

## 🔧 Troubleshooting Login Issues

### "Failed to fetch" Error Solutions:

1. **Use Fallback Mode** (Current setup):
   - Already configured - just login with mock credentials above

2. **Backend Connection Issues**:
   ```bash
   # Test if backend is running
   curl http://localhost:5000/api/health
   
   # Start backend server
   cd backend
   python start_server.py
   ```

3. **CORS Issues**:
   - Backend is configured for your Lovable domain
   - Make sure CORS settings include your domain

## 🔐 Authentication & Roles

### Role Permissions
- **Leadership**: Read-only access to all modules
- **Finance Head**: Full CRUD on financials, costing, revenue  
- **Delivery Owner**: Read-only on projects, milestones, allocations
- **Resource Manager**: CRUD on resources, projects, allocations
- **HR**: Full CRUD on personal info, restricted from financials

## 📡 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/resources` - Get resources
- `GET /api/projects` - Get projects
- `GET /api/kpis/summary` - Get KPI data

## 🛠️ Development Features

- **Fallback Authentication**: Works without backend
- **Mock Data**: Static data for frontend development  
- **CORS Configured**: Ready for production deployment
- **Role-Based Security**: Frontend and backend validation

## Project Info

**Lovable URL**: https://lovable.dev/projects/8236ee3c-9ce6-40f7-b234-5151ed868ac4

## How to Edit

- **Use Lovable**: Visit the project URL and start prompting
- **Use your IDE**: Clone this repo and push changes