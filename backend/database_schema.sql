
-- IT Delivery Dashboard Database Schema - Production Ready with Enhanced Fields
-- PostgreSQL Database Schema with comprehensive fields for full CRUD operations

-- Users table for authentication and role management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('leadership', 'finance_head', 'delivery_owner', 'resource_manager', 'hr')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    profile_image_url VARCHAR(255),
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal information table (HR managed) - Enhanced with all fields
CREATE TABLE personal_info (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    designation VARCHAR(100),
    department VARCHAR(100),
    seniority_level VARCHAR(50) CHECK (seniority_level IN ('entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'director')),
    experience INTEGER DEFAULT 0,
    location VARCHAR(100),
    joining_date DATE,
    employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern', 'consultant')),
    reporting_manager VARCHAR(100),
    email VARCHAR(120),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Resources table aligned with backend Resource model
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    
    -- Resource classification matching backend enums
    status VARCHAR(50) CHECK (status IN ('allocated', 'bench', 'training', 'shadow', 'internal', 'pip', 'inactive')) DEFAULT 'bench',
    resource_type VARCHAR(50) CHECK (resource_type IN ('billable', 'non_billable', 'intern')) DEFAULT 'non_billable',
    experience_level VARCHAR(50) CHECK (experience_level IN ('fresher', 'junior', 'senior', 'lead', 'architect')) DEFAULT 'junior',
    
    -- Financial information
    cost_rate DECIMAL(10, 2),
    billing_rate DECIMAL(10, 2),
    utilization_percentage DECIMAL(5, 2) DEFAULT 0.0,
    
    -- Performance metrics
    productivity_score INTEGER DEFAULT 0,
    bench_days INTEGER DEFAULT 0,
    last_project_end_date DATE,
    
    -- Skills and experience
    primary_skills TEXT, -- JSON string
    secondary_skills TEXT, -- JSON string
    years_of_experience INTEGER DEFAULT 0,
    
    -- Dates
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bench_start_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (employee_id) REFERENCES personal_info(employee_id) ON DELETE CASCADE
);

-- Enhanced Projects table aligned with backend Project model
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    project_manager VARCHAR(255),
    
    -- Project classification matching backend enums
    status VARCHAR(50) CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled', 'at_risk')) DEFAULT 'active',
    project_type VARCHAR(50) CHECK (project_type IN ('fixed_price', 'time_material', 'retainer', 'internal')) DEFAULT 'time_material',
    health_status VARCHAR(50) CHECK (health_status IN ('green', 'amber', 'red')) DEFAULT 'green',
    
    -- Financial information
    sow_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
    budget_allocated DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    monthly_burn_rate DECIMAL(10, 2) DEFAULT 0,
    
    -- Timeline
    start_date DATE NOT NULL,
    end_date DATE,
    planned_end_date DATE,
    
    -- Performance metrics
    on_time_percentage DECIMAL(5, 2) DEFAULT 100.0,
    utilization_rate DECIMAL(5, 2) DEFAULT 0.0,
    profit_margin DECIMAL(5, 2) DEFAULT 0.0,
    
    -- Resource allocation counts
    billable_resources_count INTEGER DEFAULT 0,
    non_billable_resources_count INTEGER DEFAULT 0,
    shadow_resources_count INTEGER DEFAULT 0,
    
    -- Project details
    description TEXT,
    technology_stack TEXT, -- JSON string
    current_milestone VARCHAR(255),
    risk_level VARCHAR(50) DEFAULT 'Low',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project milestones table aligned with backend ProjectMilestone model
CREATE TABLE project_milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    milestone_name VARCHAR(255) NOT NULL,
    planned_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Enhanced Project allocations table aligned with backend ProjectAllocation model
CREATE TABLE project_allocations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    allocation_percentage DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    planned_end_date DATE,
    role_in_project VARCHAR(100),
    responsibilities TEXT,
    status VARCHAR(50) CHECK (status IN ('planned', 'active', 'paused', 'completed', 'released', 'cancelled')) DEFAULT 'planned',
    billing_rate DECIMAL(10, 2),
    cost_rate DECIMAL(10, 2),
    daily_hours DECIMAL(4, 2) DEFAULT 8.00,
    weekly_hours DECIMAL(4, 2) DEFAULT 40.00,
    overtime_hours DECIMAL(6, 2) DEFAULT 0.00,
    utilization_efficiency DECIMAL(5, 2),
    skill_match_percentage DECIMAL(5, 2),
    performance_rating DECIMAL(3, 2),
    allocation_notes TEXT,
    created_by INTEGER,
    approved_by INTEGER,
    approval_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- Financials table aligned with backend Financials model
CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    month_year DATE NOT NULL,
    revenue DECIMAL(12, 2),
    cost DECIMAL(12, 2),
    margin DECIMAL(12, 2),
    invoiced_amount DECIMAL(12, 2),
    collected_amount DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, month_year)
);

-- Bench costing table aligned with backend BenchCosting model
CREATE TABLE bench_costing (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    month_year DATE NOT NULL,
    bench_cost DECIMAL(10, 2),
    bench_days INTEGER,
    cost_center VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE(resource_id, month_year)
);

-- Escalations table aligned with backend Escalation model
CREATE TABLE escalations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50),
    raised_by VARCHAR(100),
    assigned_to VARCHAR(100),
    raised_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create comprehensive indexes for better performance
CREATE INDEX idx_resources_employee_id ON resources(employee_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_resource_type ON resources(resource_type);
CREATE INDEX idx_resources_experience_level ON resources(experience_level);
CREATE INDEX idx_project_allocations_project_id ON project_allocations(project_id);
CREATE INDEX idx_project_allocations_resource_id ON project_allocations(resource_id);
CREATE INDEX idx_project_allocations_status ON project_allocations(status);
CREATE INDEX idx_financials_project_month ON financials(project_id, month_year);
CREATE INDEX idx_bench_costing_resource_month ON bench_costing(resource_id, month_year);
CREATE INDEX idx_escalations_project_id ON escalations(project_id);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_health_status ON projects(health_status);
CREATE INDEX idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_personal_info_employee_id ON personal_info(employee_id);
CREATE INDEX idx_resource_resignations_employee_id ON resource_resignations(employee_id);
CREATE INDEX idx_resource_resignations_status ON resource_resignations(status);
CREATE INDEX idx_skills_master_category ON skills_master(skill_category);
CREATE INDEX idx_skills_master_group ON skills_master(skill_group);
CREATE INDEX idx_resource_skills_employee_id ON resource_skills(employee_id);
CREATE INDEX idx_resource_skills_skill_type ON resource_skills(skill_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_allocations_updated_at BEFORE UPDATE ON project_allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bench_costing_updated_at BEFORE UPDATE ON bench_costing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resource_resignations_updated_at BEFORE UPDATE ON resource_resignations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_master_updated_at BEFORE UPDATE ON skills_master FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resource_skills_updated_at BEFORE UPDATE ON resource_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data aligned with backend models
INSERT INTO personal_info (employee_id, full_name, first_name, last_name, designation, department, seniority_level, experience, location, joining_date, employment_type, reporting_manager, email, phone) VALUES
('EMP001', 'John Doe', 'John', 'Doe', 'Senior React Developer', 'Engineering', 'senior', 8, 'Bangalore', '2023-01-15', 'full_time', 'Jane Smith', 'john.doe@company.com', '+91-9876543210'),
('EMP002', 'Sarah Wilson', 'Sarah', 'Wilson', 'QA Engineer', 'Quality Assurance', 'mid', 5, 'Hyderabad', '2022-08-20', 'full_time', 'Mike Johnson', 'sarah.wilson@company.com', '+91-9876543211'),
('EMP003', 'David Brown', 'David', 'Brown', 'DevOps Engineer', 'DevOps', 'mid', 4, 'Pune', '2023-03-10', 'full_time', 'Lisa Davis', 'david.brown@company.com', '+91-9876543212'),
('EMP004', 'Priya Sharma', 'Priya', 'Sharma', 'Junior Developer', 'Engineering', 'junior', 2, 'Bangalore', '2024-02-15', 'full_time', 'John Doe', 'priya.sharma@company.com', '+91-9876543213'),
('EMP005', 'Alex Johnson', 'Alex', 'Johnson', 'Data Scientist', 'Data Science', 'senior', 7, 'Mumbai', '2022-11-01', 'full_time', 'Emily Chen', 'alex.johnson@company.com', '+91-9876543214');

INSERT INTO resources (
    employee_id, first_name, last_name, email, designation, department, location,
    status, resource_type, experience_level, cost_rate, billing_rate, 
    utilization_percentage, productivity_score, bench_days, primary_skills, 
    secondary_skills, years_of_experience, joining_date
) VALUES
('EMP001', 'John', 'Doe', 'john.doe@company.com', 'Senior React Developer', 'Engineering', 'Bangalore', 'allocated', 'billable', 'senior', 120.00, 150.00, 100.00, 85, 0, '["React.js", "TypeScript", "JavaScript"]', '["Node.js", "GraphQL"]', 8, '2023-01-15'),
('EMP002', 'Sarah', 'Wilson', 'sarah.wilson@company.com', 'QA Engineer', 'Quality Assurance', 'Hyderabad', 'bench', 'non_billable', 'junior', 80.00, NULL, 0.00, 75, 45, '["Test Automation", "Selenium", "Cypress"]', '["Performance Testing", "API Testing"]', 5, '2022-08-20'),
('EMP003', 'David', 'Brown', 'david.brown@company.com', 'DevOps Engineer', 'DevOps', 'Pune', 'allocated', 'billable', 'senior', 100.00, 120.00, 100.00, 90, 0, '["Kubernetes", "Docker", "AWS"]', '["Terraform", "Jenkins"]', 4, '2023-03-10'),
('EMP004', 'Priya', 'Sharma', 'priya.sharma@company.com', 'Junior Developer', 'Engineering', 'Bangalore', 'bench', 'non_billable', 'junior', 60.00, NULL, 0.00, 70, 30, '["JavaScript", "HTML", "CSS"]', '["React.js", "Git"]', 2, '2024-02-15'),
('EMP005', 'Alex', 'Johnson', 'alex.johnson@company.com', 'Data Scientist', 'Data Science', 'Mumbai', 'allocated', 'billable', 'senior', 140.00, 180.00, 90.00, 95, 0, '["Python", "Machine Learning", "TensorFlow"]', '["SQL", "Data Visualization"]', 7, '2022-11-01');

INSERT INTO projects (
    project_code, project_name, client_name, project_manager, start_date, end_date,
    status, health_status, project_type, sow_value, budget_allocated, actual_cost,
    on_time_percentage, utilization_rate, profit_margin, billable_resources_count,
    non_billable_resources_count, current_milestone, risk_level
) VALUES
('PROJ001', 'E-commerce Platform Development', 'TechCorp Solutions', 'John Doe', '2024-01-15', '2024-08-15', 'active', 'green', 'time_material', 250000.00, 220000.00, 180000.00, 95.00, 85.00, 25.00, 3, 1, 'Backend API Development', 'Low'),
('PROJ002', 'Mobile Banking Application', 'FinanceFirst Bank', 'Sarah Wilson', '2024-02-01', '2024-09-30', 'active', 'amber', 'fixed_price', 400000.00, 380000.00, 300000.00, 80.00, 90.00, 20.00, 4, 0, 'Security Testing', 'Medium'),
('PROJ003', 'Data Analytics Dashboard', 'Analytics Corp', 'Alex Johnson', '2023-11-01', '2024-05-01', 'completed', 'green', 'time_material', 150000.00, 140000.00, 130000.00, 100.00, 95.00, 30.00, 2, 1, 'Project Delivery', 'Low');

-- Sample project milestones
INSERT INTO project_milestones (project_id, milestone_name, planned_date, actual_date, status, progress_percentage) VALUES
(1, 'Project Kickoff', '2024-01-15', '2024-01-15', 'Completed', 100.00),
(1, 'UI/UX Design Complete', '2024-03-01', '2024-02-28', 'Completed', 100.00),
(1, 'Backend API Development', '2024-05-01', NULL, 'In Progress', 70.00),
(2, 'Security Framework Setup', '2024-03-01', '2024-02-29', 'Completed', 100.00),
(2, 'Core Banking Features', '2024-06-01', NULL, 'In Progress', 60.00);

-- Sample project allocations
INSERT INTO project_allocations (project_id, resource_id, allocation_percentage, start_date, end_date, role_in_project, status, billing_rate, cost_rate) VALUES
(1, 1, 100.00, '2024-01-15', '2024-08-15', 'Lead Developer', 'active', 150.00, 120.00),
(1, 3, 100.00, '2024-02-01', '2024-08-15', 'DevOps Engineer', 'active', 120.00, 100.00),
(2, 5, 90.00, '2024-02-01', '2024-09-30', 'Data Scientist', 'active', 180.00, 140.00);

-- Sample financials
INSERT INTO financials (project_id, month_year, revenue, cost, margin, invoiced_amount, collected_amount) VALUES
(1, '2024-01-01', 25000.00, 18000.00, 7000.00, 25000.00, 20000.00),
(1, '2024-02-01', 32000.00, 19000.00, 13000.00, 32000.00, 32000.00),
(2, '2024-02-01', 45000.00, 32000.00, 13000.00, 45000.00, 40000.00),
(3, '2024-01-01', 35000.00, 22000.00, 13000.00, 35000.00, 35000.00);

-- Resource resignations table for tracking resignations
CREATE TABLE resource_resignations (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    emp_name VARCHAR(200) NOT NULL,
    date_of_resignation DATE NOT NULL,
    skill VARCHAR(500),
    client VARCHAR(200),
    project_name VARCHAR(200),
    replacement_plans_needed TEXT,
    customer_feedback TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed')) DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES personal_info(employee_id) ON DELETE CASCADE
);

-- Skills master table for skill grouping and management
CREATE TABLE skills_master (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    skill_category VARCHAR(100) NOT NULL,
    skill_group VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource skills table for detailed skill tracking with experience
CREATE TABLE resource_skills (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    skill_id INTEGER NOT NULL,
    skill_type VARCHAR(50) CHECK (skill_type IN ('primary', 'secondary')) NOT NULL,
    experience_years INTEGER DEFAULT 0,
    experience_months INTEGER DEFAULT 0,
    proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
    last_used_date DATE,
    certification_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES personal_info(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills_master(id) ON DELETE CASCADE,
    UNIQUE(employee_id, skill_id, skill_type)
);

-- Sample bench costing
INSERT INTO bench_costing (resource_id, month_year, bench_cost, bench_days, cost_center) VALUES
(2, '2024-01-01', 8000.00, 22, 'Quality Assurance'),
(4, '2024-01-01', 6000.00, 22, 'Engineering');

-- Sample escalations
INSERT INTO escalations (project_id, title, description, priority, status, raised_by, assigned_to, raised_date) VALUES
(1, 'Budget Overrun Alert', 'Project exceeding allocated budget due to scope changes', 'high', 'open', 'John Doe', 'Finance Team', '2024-03-15'),
(2, 'Performance Issues', 'Application showing slow response times during peak usage', 'critical', 'in_progress', 'Sarah Wilson', 'Tech Team', '2024-03-10');

-- Sample skills master data
INSERT INTO skills_master (skill_name, skill_category, skill_group, description) VALUES
-- Frontend Skills
('React.js', 'Frontend', 'JavaScript Frameworks', 'React JavaScript library for building user interfaces'),
('Vue.js', 'Frontend', 'JavaScript Frameworks', 'Progressive JavaScript framework for building UIs'),
('Angular', 'Frontend', 'JavaScript Frameworks', 'TypeScript-based web application framework'),
('TypeScript', 'Frontend', 'Languages', 'Typed superset of JavaScript'),
('JavaScript', 'Frontend', 'Languages', 'Programming language for web development'),
('HTML', 'Frontend', 'Web Technologies', 'HyperText Markup Language'),
('CSS', 'Frontend', 'Web Technologies', 'Cascading Style Sheets'),
('Tailwind CSS', 'Frontend', 'Styling', 'Utility-first CSS framework'),

-- Backend Skills
('Node.js', 'Backend', 'Runtime Environment', 'JavaScript runtime built on Chrome V8 engine'),
('Python', 'Backend', 'Languages', 'High-level programming language'),
('Java', 'Backend', 'Languages', 'Object-oriented programming language'),
('Spring Boot', 'Backend', 'Frameworks', 'Java-based framework for microservices'),
('Django', 'Backend', 'Frameworks', 'Python web framework'),
('Express.js', 'Backend', 'Frameworks', 'Node.js web application framework'),
('GraphQL', 'Backend', 'API Technologies', 'Query language for APIs'),
('REST API', 'Backend', 'API Technologies', 'Representational State Transfer API'),

-- Database Skills
('PostgreSQL', 'Database', 'Relational Databases', 'Open-source relational database'),
('MySQL', 'Database', 'Relational Databases', 'Open-source relational database'),
('MongoDB', 'Database', 'NoSQL Databases', 'Document-oriented NoSQL database'),
('Redis', 'Database', 'Cache/In-Memory', 'In-memory data structure store'),

-- DevOps Skills
('Docker', 'DevOps', 'Containerization', 'Platform for developing, shipping, and running applications'),
('Kubernetes', 'DevOps', 'Orchestration', 'Container orchestration platform'),
('AWS', 'DevOps', 'Cloud Platforms', 'Amazon Web Services cloud platform'),
('Jenkins', 'DevOps', 'CI/CD', 'Automation server for CI/CD'),
('Terraform', 'DevOps', 'Infrastructure as Code', 'Infrastructure as Code tool'),

-- Testing Skills
('Selenium', 'Testing', 'Automation', 'Web application testing framework'),
('Cypress', 'Testing', 'Automation', 'End-to-end testing framework'),
('Jest', 'Testing', 'Unit Testing', 'JavaScript testing framework'),
('PyTest', 'Testing', 'Unit Testing', 'Python testing framework'),

-- Data Science Skills
('Machine Learning', 'Data Science', 'ML/AI', 'Machine learning and artificial intelligence'),
('TensorFlow', 'Data Science', 'ML Frameworks', 'Open-source machine learning framework'),
('Data Visualization', 'Data Science', 'Analytics', 'Creating visual representations of data'),
('SQL', 'Data Science', 'Query Languages', 'Structured Query Language');

-- Sample resource skills data
INSERT INTO resource_skills (employee_id, skill_id, skill_type, experience_years, experience_months, proficiency_level) VALUES
-- John Doe skills
('EMP001', 1, 'primary', 5, 0, 'expert'),       -- React.js
('EMP001', 4, 'primary', 4, 6, 'advanced'),     -- TypeScript
('EMP001', 5, 'primary', 8, 0, 'expert'),       -- JavaScript
('EMP001', 9, 'secondary', 3, 0, 'intermediate'), -- Node.js
('EMP001', 17, 'secondary', 2, 6, 'intermediate'), -- GraphQL

-- Sarah Wilson skills
('EMP002', 25, 'primary', 3, 0, 'advanced'),     -- Selenium
('EMP002', 26, 'primary', 2, 6, 'intermediate'), -- Cypress
('EMP002', 27, 'secondary', 4, 0, 'advanced'),   -- Jest
('EMP002', 18, 'secondary', 3, 0, 'intermediate'), -- REST API

-- David Brown skills
('EMP003', 23, 'primary', 3, 0, 'advanced'),     -- Docker
('EMP003', 24, 'primary', 2, 6, 'intermediate'), -- Kubernetes
('EMP003', 25, 'primary', 4, 0, 'advanced'),     -- AWS
('EMP003', 27, 'secondary', 2, 0, 'intermediate'), -- Terraform
('EMP003', 26, 'secondary', 3, 6, 'intermediate'), -- Jenkins

-- Priya Sharma skills
('EMP004', 5, 'primary', 2, 0, 'intermediate'),  -- JavaScript
('EMP004', 6, 'primary', 1, 6, 'beginner'),      -- HTML
('EMP004', 7, 'primary', 1, 6, 'beginner'),      -- CSS
('EMP004', 1, 'secondary', 0, 6, 'beginner'),    -- React.js

-- Alex Johnson skills
('EMP005', 10, 'primary', 7, 0, 'expert'),       -- Python
('EMP005', 29, 'primary', 5, 0, 'advanced'),     -- Machine Learning
('EMP005', 30, 'primary', 3, 6, 'advanced'),     -- TensorFlow
('EMP005', 31, 'secondary', 4, 0, 'advanced'),   -- Data Visualization
('EMP005', 32, 'secondary', 6, 0, 'expert');     -- SQL

-- Views for KPI calculations
CREATE VIEW kpi_summary_view AS
SELECT 
    COUNT(*) as total_resources,
    COUNT(CASE WHEN r.status = 'allocated' THEN 1 END) as active_resources,
    COUNT(CASE WHEN r.resource_type = 'billable' THEN 1 END) as billable_resources,
    COUNT(CASE WHEN r.status = 'bench' THEN 1 END) as bench_resources,
    COUNT(CASE WHEN r.resource_type = 'intern' THEN 1 END) as intern_resources,
    ROUND(AVG(r.utilization_percentage), 2) as avg_utilization,
    ROUND(AVG(CASE WHEN r.status = 'bench' THEN r.bench_days END), 2) as avg_bench_days,
    SUM(r.cost_rate * 160) as total_monthly_cost, -- Assuming 160 hours per month
    SUM(CASE WHEN r.billing_rate IS NOT NULL THEN r.billing_rate * 160 * (r.utilization_percentage/100) ELSE 0 END) as total_monthly_revenue
FROM resources r;

CREATE VIEW project_summary_view AS
SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN health_status = 'red' OR status = 'at_risk' THEN 1 END) as at_risk_projects,
    SUM(sow_value) as total_sow_value,
    SUM(actual_cost) as total_actual_cost,
    ROUND(AVG(on_time_percentage), 2) as avg_on_time_percentage,
    ROUND(AVG(utilization_rate), 2) as avg_utilization_rate
FROM projects;
