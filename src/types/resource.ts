
// Resource types aligned with backend models and database schema
export interface ResourceData {
  // Core identification
  id?: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  
  // HR Data Section
  designation: string;
  department: string;
  location: string;
  joining_date: string;
  
  // Resource Classification (aligned with backend enums)
  status: 'allocated' | 'bench' | 'training' | 'shadow' | 'internal' | 'pip' | 'inactive';
  resource_type: 'billable' | 'non_billable' | 'intern';
  experience_level: 'fresher' | 'junior' | 'senior' | 'lead' | 'architect';
  
  // Skills and Experience (aligned with backend structure)
  primary_skills?: string; // JSON string
  secondary_skills?: string; // JSON string
  years_of_experience: number;
  
  // Performance and Utilization
  utilization_percentage: number;
  productivity_score: number;
  bench_days: number;
  last_project_end_date?: string;
  bench_start_date?: string;
  
  // Financial Information
  cost_rate?: number;
  billing_rate?: number;
  
  // Legacy compatibility fields
  seniority_level?: string;
  skill_category?: string;
  experience?: number;
  employment_type?: string;
  reporting_manager?: string;
  
  // Resource Management Section
  billable_status?: boolean;
  current_engagement?: string;
  project_name?: string;
  engagement_description?: string;
  engagement_start_date?: string;
  engagement_end_date?: string;
  aging_in_non_billable?: number;
  current_bench_status?: boolean;
  engagement_detail?: string;
  
  // Intern Section
  is_intern?: boolean;
  internship_start_date?: string;
  internship_end_date?: string;
  assigned_project?: string;
  mentor_name?: string;
  stipend?: number;
  
  // Finance Section (legacy)
  monthly_salary_cost?: number;
  monthly_revenue_generated?: number;
  cost_center?: string;
  total_ytd_cost?: number;
  total_ytd_revenue?: number;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Simplified resource interface for forms and displays
export interface ResourceFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  designation: string;
  department: string;
  location: string;
  status: 'allocated' | 'bench' | 'training' | 'shadow' | 'internal' | 'pip' | 'inactive';
  resource_type: 'billable' | 'non_billable' | 'intern';
  experience_level: 'fresher' | 'junior' | 'senior' | 'lead' | 'architect';
  cost_rate?: number;
  billing_rate?: number;
  years_of_experience: number;
  joining_date: string;
  primary_skills?: string;
  secondary_skills?: string;
}

// Resource display interface for tables and cards
export interface ResourceDisplay {
  id: number;
  employee_id: string;
  full_name: string;
  designation: string;
  department: string;
  location: string;
  status: string;
  resource_type: string;
  experience_level: string;
  utilization_percentage: number;
  bench_days: number;
  primary_skills?: string[];
  secondary_skills?: string[];
  cost_rate?: number;
  billing_rate?: number;
}

// Utility functions for resource data transformation
export const transformResourceFromAPI = (apiResource: any): ResourceData => {
  return {
    id: apiResource.id,
    employee_id: apiResource.employee_id,
    first_name: apiResource.first_name,
    last_name: apiResource.last_name,
    full_name: apiResource.full_name || `${apiResource.first_name} ${apiResource.last_name}`,
    email: apiResource.email,
    designation: apiResource.designation,
    department: apiResource.department,
    location: apiResource.location,
    status: apiResource.status,
    resource_type: apiResource.resource_type,
    experience_level: apiResource.experience_level,
    utilization_percentage: apiResource.utilization_percentage || 0,
    productivity_score: apiResource.productivity_score || 0,
    bench_days: apiResource.bench_days || 0,
    years_of_experience: apiResource.years_of_experience || 0,
    joining_date: apiResource.joining_date,
    primary_skills: apiResource.primary_skills,
    secondary_skills: apiResource.secondary_skills,
    cost_rate: apiResource.cost_rate,
    billing_rate: apiResource.billing_rate,
    last_project_end_date: apiResource.last_project_end_date,
    bench_start_date: apiResource.bench_start_date,
    created_at: apiResource.created_at,
    updated_at: apiResource.updated_at,
    
    // Legacy field mappings
    seniority_level: apiResource.seniority_level || apiResource.experience_level,
    skill_category: apiResource.skill_category,
    experience: apiResource.experience || apiResource.years_of_experience,
    current_engagement: apiResource.current_engagement,
    aging_in_non_billable: apiResource.aging_in_non_billable || apiResource.bench_days,
    is_intern: apiResource.resource_type === 'intern',
    billable_status: apiResource.resource_type === 'billable'
  };
};

export const parseSkillsString = (skillsString?: string): string[] => {
  if (!skillsString) return [];
  try {
    return JSON.parse(skillsString);
  } catch {
    return skillsString.split(',').map(s => s.trim()).filter(Boolean);
  }
};

export const formatSkillsForAPI = (skills: string[]): string => {
  return JSON.stringify(skills);
};
