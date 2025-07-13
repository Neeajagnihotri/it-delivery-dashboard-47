# IT Delivery Dashboard API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints except `/auth/login` require JWT token authentication.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Role-Based Access Control

### Roles and Permissions

#### Leadership
- **Access**: Read-only access to all modules
- **Modules**: PersonalInfo, Projects, Milestones, Financials (limited), BenchCosting, KPIs
- **Restrictions**: No edit/delete permissions

#### Finance Head
- **Access**: Full CRUD on financial data
- **Modules**: Financials, Costing, Revenue, BenchCosting
- **Restrictions**: Cannot edit personal info

#### Delivery Owner
- **Access**: Read-only on project delivery data
- **Modules**: ProjectMilestones, ProjectStatus, Allocations
- **Restrictions**: No access to financial/personal info

#### Resource Manager
- **Access**: CRUD on resource and project data
- **Modules**: Resources, Projects, Allocations
- **Restrictions**: No personal info edit, no financial details

#### HR
- **Access**: Full CRUD on personal information
- **Modules**: PersonalInfo
- **Restrictions**: No access to financials/delivery status

---

## Authentication Endpoints

### POST /auth/login
Login user and get JWT token.

**Request Body:**
```json
{
  "email": "hr@zapcg.com",
  "password": "hr123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "hr@zapcg.com",
    "name": "Sarah Johnson",
    "role": "hr"
  }
}
```

### POST /auth/register
Create new user (HR only).

**Required Role:** HR

**Request Body:**
```json
{
  "email": "newuser@zapcg.com",
  "password": "password123",
  "name": "New User",
  "role": "resource_manager"
}
```

---

## Personal Info Endpoints

### GET /personal-info
Get all personal information records.

**Required Roles:** Leadership, HR

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": "EMP001",
    "full_name": "John Smith",
    "designation": "Senior Software Engineer",
    "department": "Engineering",
    "seniority_level": "Senior (6+ yrs)",
    "experience": 8,
    "location": "Bangalore",
    "joining_date": "2020-03-15",
    "employment_type": "FTE",
    "reporting_manager": "Michael Chen",
    "email": "john.smith@zapcg.com",
    "phone": "+91-9876543210"
  }
]
```

### POST /personal-info
Create new personal info record.

**Required Role:** HR

**Request Body:**
```json
{
  "employee_id": "EMP006",
  "full_name": "New Employee",
  "designation": "Software Engineer",
  "department": "Engineering",
  "seniority_level": "Mid-Senior (3-6 yrs)",
  "experience": 4,
  "location": "Mumbai",
  "joining_date": "2023-12-01",
  "employment_type": "FTE",
  "reporting_manager": "John Smith",
  "email": "new.employee@zapcg.com",
  "phone": "+91-9876543220"
}
```

### PUT /personal-info/{id}
Update personal info record.

**Required Role:** HR

### DELETE /personal-info/{id}
Delete personal info record.

**Required Role:** HR

---

## Resource Endpoints

### GET /resources
Get all resources with personal info.

**Required Roles:** Leadership, Resource Manager

**Response:**
```json
[
  {
    "id": 1,
    "employee_id": "EMP001",
    "full_name": "John Smith",
    "designation": "Senior Software Engineer",
    "department": "Engineering",
    "resource_type": "billable",
    "status": "allocated",
    "current_bench_status": "allocated",
    "engagement_detail": "Project Alpha - Backend Development",
    "cost_center": "CC001",
    "billing_rate": 3500.00,
    "cost_rate": 2800.00,
    "utilization_percentage": 85.50
  }
]
```

### POST /resources
Create new resource.

**Required Role:** Resource Manager

**Request Body:**
```json
{
  "employee_id": "EMP006",
  "resource_type": "billable",
  "status": "bench",
  "current_bench_status": "available",
  "cost_center": "CC001",
  "billing_rate": 3000.00,
  "cost_rate": 2400.00,
  "utilization_percentage": 0.00
}
```

---

## Project Endpoints

### GET /projects
Get all projects.

**Required Roles:** Leadership, Resource Manager, Delivery Owner

**Response:**
```json
[
  {
    "id": 1,
    "project_code": "PROJ001",
    "project_name": "E-commerce Platform",
    "client_name": "TechCorp Ltd",
    "project_manager": "Jane Doe",
    "start_date": "2023-01-15",
    "end_date": "2024-06-30",
    "status": "active",
    "project_type": "Development",
    "budget": 1500000.00,
    "actual_cost": 800000.00,
    "revenue": 1200000.00
  }
]
```

### POST /projects
Create new project.

**Required Role:** Resource Manager

### PUT /projects/{id}
Update project.

**Required Role:** Resource Manager

---

## Project Milestone Endpoints

### GET /project-milestones
Get project milestones.

**Required Roles:** Leadership, Delivery Owner

**Query Parameters:**
- `project_id` (optional): Filter by project ID

**Response:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "milestone_name": "Requirements Analysis",
    "description": "Complete business requirements gathering",
    "planned_date": "2023-02-15",
    "actual_date": "2023-02-10",
    "status": "completed",
    "completion_percentage": 100.00
  }
]
```

---

## Financial Endpoints

### GET /financials
Get financial records.

**Required Roles:** Leadership (limited), Finance Head (full)

**Response for Leadership:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "month_year": "2023-01-01",
    "revenue": 100000.00,
    "margin": 20000.00
  }
]
```

**Response for Finance Head:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "month_year": "2023-01-01",
    "revenue": 100000.00,
    "cost": 80000.00,
    "margin": 20000.00,
    "invoiced_amount": 100000.00,
    "collected_amount": 95000.00
  }
]
```

### POST /financials
Create financial record.

**Required Role:** Finance Head

**Request Body:**
```json
{
  "project_id": 1,
  "month_year": "2023-12-01",
  "revenue": 150000.00,
  "cost": 120000.00,
  "margin": 30000.00,
  "invoiced_amount": 150000.00,
  "collected_amount": 140000.00
}
```

### PUT /financials/{id}
Update financial record.

**Required Role:** Finance Head

### DELETE /financials/{id}
Delete financial record.

**Required Role:** Finance Head

---

## Bench Costing Endpoints

### GET /bench-costing
Get bench costing records.

**Required Roles:** Leadership, Finance Head

**Response:**
```json
[
  {
    "id": 1,
    "resource_id": 3,
    "month_year": "2023-10-01",
    "bench_cost": 88000.00,
    "bench_days": 22,
    "cost_center": "CC001"
  }
]
```

### POST /bench-costing
Create bench cost record.

**Required Role:** Finance Head

---

## Project Allocation Endpoints

### GET /project-allocations
Get project allocations.

**Required Roles:** Leadership, Resource Manager, Delivery Owner

**Response:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "resource_id": 1,
    "allocation_percentage": 100.00,
    "start_date": "2023-02-01",
    "end_date": "2024-06-30",
    "role_in_project": "Lead Backend Developer",
    "status": "active"
  }
]
```

### POST /project-allocations
Create project allocation.

**Required Role:** Resource Manager

---

## Escalation Endpoints

### GET /escalations
Get escalations.

**Required Roles:** Leadership, Resource Manager, Delivery Owner

**Response:**
```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "Performance Issues",
    "description": "Backend API response time is slow",
    "priority": "high",
    "status": "in_progress",
    "raised_by": "Jane Doe",
    "assigned_to": "John Smith",
    "raised_date": "2023-10-15T10:30:00",
    "resolved_date": null
  }
]
```

### POST /escalations
Create escalation.

**Required Roles:** Resource Manager, Delivery Owner

---

## KPI Endpoints

### GET /kpis/summary
Get KPI summary.

**Required Roles:** Leadership, Finance Head, Resource Manager, Delivery Owner

**Response:**
```json
{
  "total_resources": 6,
  "active_projects": 3,
  "billable_resources": 5,
  "bench_resources": 2,
  "monthly_revenue": 430000.00,
  "monthly_cost": 335000.00,
  "monthly_margin": 95000.00
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/it_delivery_db
JWT_SECRET_KEY=your-super-secret-jwt-key
FLASK_DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Database Setup
```bash
# Create database
createdb it_delivery_db

# Run schema
psql -d it_delivery_db -f database_schema.sql

# Insert sample data
psql -d it_delivery_db -f sample_data.sql
```

### 4. Run Application
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Sample Login Credentials

- **HR**: hr@zapcg.com / hr123
- **Manager**: manager@zapcg.com / manager123  
- **Leadership**: leadership@zapcg.com / leadership123
- **Finance**: finance@zapcg.com / finance123
- **Delivery**: delivery@zapcg.com / delivery123

All passwords are hashed using bcrypt in the sample data.