// API Response Types aligned with backend database schema
export interface KPISummaryResponse {
  total_resources: number;
  active_projects: number;
  completed_projects: number;
  at_risk_projects: number;
  billable_resources: number;
  bench_resources: number;
  training_resources: number;
  intern_resources: number;
  total_revenue: number;
  total_cost: number;
  total_margin: number;
  utilization_rate: number;
  bench_percentage: number;
  avg_bench_days: number;
  non_billable_resources: number;
  avg_utilization: number;
  avg_bench_aging: number;
  total_monthly_cost: number;
  total_monthly_revenue: number;
  escalation_score?: number;
}

// Enhanced Project Response with all fields
export interface ProjectResponse {
  id: number;
  project_code: string;
  project_name: string;
  client_name: string;
  client_contact_email?: string;
  client_contact_phone?: string;
  project_manager?: string;
  project_manager_id?: number;
  technical_lead?: string;
  technical_lead_id?: number;
  delivery_owner?: string;
  delivery_owner_id?: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'delayed' | 'at_risk';
  project_type: 'development' | 'maintenance' | 'consulting' | 'support' | 'training' | 'research' | 'fixed_price' | 'time_material' | 'retainer' | 'internal';
  health_status: 'green' | 'yellow' | 'amber' | 'red' | 'unknown';
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  project_priority?: 'low' | 'medium' | 'high' | 'critical';
  methodology?: 'agile' | 'waterfall' | 'hybrid' | 'kanban' | 'scrum';
  billing_type?: 'fixed_price' | 'time_material' | 'retainer' | 'outcome_based';
  start_date: string;
  end_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  sow_value: number;
  budget_allocated?: number;
  actual_cost: number;
  revenue?: number;
  profit_margin?: number;
  monthly_burn_rate: number;
  currency?: string;
  on_time_percentage: number;
  utilization_rate: number;
  completion_percentage?: number;
  scope_change_requests?: number;
  change_request_value?: number;
  defect_count?: number;
  critical_defects?: number;
  code_coverage_percentage?: number;
  client_satisfaction_score?: number;
  last_client_feedback_date?: string;
  billable_resources_count: number;
  non_billable_resources_count: number;
  shadow_resources_count: number;
  description?: string;
  objectives?: string;
  deliverables?: string;
  success_criteria?: string;
  constraints?: string;
  assumptions?: string;
  technology_stack?: string;
  current_milestone?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Resource Response with all fields
export interface ResourceResponse {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  personal_email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  address?: string;
  designation: string;
  department: string;
  location: string;
  work_location?: 'office' | 'remote' | 'hybrid';
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'consultant';
  employment_status?: 'active' | 'inactive' | 'terminated' | 'resigned' | 'on_leave';
  joining_date: string;
  probation_end_date?: string;
  reporting_manager?: string;
  reporting_manager_id?: string;
  status: 'allocated' | 'bench' | 'training' | 'shadow' | 'internal' | 'pip' | 'inactive';
  resource_type: 'billable' | 'non_billable' | 'intern' | 'contractor';
  experience_level: 'fresher' | 'junior' | 'senior' | 'lead' | 'architect';
  years_of_experience: number;
  experience_months?: number;
  primary_skills?: string;
  secondary_skills?: string;
  primary_skills_experience?: number;
  secondary_skills_experience?: number;
  certifications?: string;
  education_qualification?: string;
  training_completed?: string;
  cost_center?: string;
  cost_rate: number;
  billing_rate?: number;
  overtime_rate?: number;
  currency?: string;
  rate_effective_date?: string;
  salary_currency?: string;
  utilization_percentage: number;
  utilization_target?: number;
  current_utilization?: number;
  average_utilization_3m?: number;
  average_utilization_6m?: number;
  billable_hours_target?: number;
  productivity_score: number;
  performance_rating?: number;
  last_performance_review_date?: string;
  next_performance_review_date?: string;
  bench_days: number;
  bench_start_date?: string;
  bench_reason?: string;
  available_from_date?: string;
  last_project_end_date?: string;
  career_level?: string;
  promotion_eligible_date?: string;
  learning_budget?: number;
  learning_budget_used?: number;
  current_project_allocation?: number;
  max_allocation_percentage?: number;
  passport_number?: string;
  visa_status?: string;
  visa_expiry_date?: string;
  tax_id?: string;
  bank_account_number?: string;
  
  // Legacy fields for backward compatibility
  seniority_level?: string;
  skill_category?: string;
  current_engagement?: string;
  aging_in_non_billable?: number;
  is_intern?: boolean;
  internship_start_date?: string;
  internship_end_date?: string;
  assigned_project?: string;
  mentor_name?: string;
  stipend?: number;
  
  created_at: string;
  updated_at: string;
}

export interface FinancialResponse {
  id: number;
  project_id: number;
  month_year: string;
  revenue?: number;
  cost?: number;
  margin?: number;
  invoiced_amount?: number;
  collected_amount?: number;
  created_at: string;
  updated_at: string;
}

// Enhanced Escalation Response with all fields
export interface EscalationResponse {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  customer?: string;
  client_contact_email?: string;
  project_owner?: string;
  escalation_owner?: string;
  escalated_to?: string;
  raised_by?: string;
  assigned_to?: string;
  escalation_type?: 'technical' | 'commercial' | 'resource' | 'timeline' | 'quality' | 'scope';
  category?: 'bug' | 'feature_request' | 'performance' | 'security' | 'compliance' | 'process';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity?: 'minor' | 'major' | 'critical' | 'blocker';
  status: 'open' | 'acknowledged' | 'in_progress' | 'pending_client' | 'resolved' | 'closed' | 'cancelled';
  resolution_status?: 'pending' | 'fixed' | 'workaround' | 'wont_fix' | 'duplicate';
  raised_date: string;
  date_acknowledged?: string;
  target_resolution_date?: string;
  actual_resolution_date?: string;
  resolved_date?: string;
  date_closed?: string;
  response_time_hours?: number;
  resolution_time_hours?: number;
  business_impact?: string;
  financial_impact?: number;
  affected_users?: number;
  downtime_hours?: number;
  root_cause?: string;
  resolution_summary?: string;
  actions_taken?: string;
  preventive_measures?: string;
  client_communication?: string;
  internal_notes?: string;
  communication_log?: string; // JSON array
  client_signoff_required?: boolean;
  client_signoff_date?: string;
  client_satisfaction_rating?: number;
  
  // Computed fields for display
  project_name?: string;
  client_name?: string;
  
  created_at: string;
  updated_at: string;
}

export interface BenchCostingResponse {
  id: number;
  resource_id: number;
  month_year: string;
  bench_cost?: number;
  bench_days?: number;
  cost_center?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectAllocationResponse {
  id: number;
  project_id: number;
  resource_id: number;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
  planned_end_date?: string;
  role_in_project?: string;
  responsibilities?: string;
  status: 'planned' | 'active' | 'paused' | 'completed' | 'released' | 'cancelled';
  billing_rate?: number;
  cost_rate?: number;
  daily_hours: number;
  weekly_hours: number;
  overtime_hours: number;
  utilization_efficiency?: number;
  skill_match_percentage?: number;
  performance_rating?: number;
  allocation_notes?: string;
  created_by?: number;
  approved_by?: number;
  approval_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestoneResponse {
  id: number;
  project_id: number;
  milestone_name: string;
  planned_date: string;
  actual_date?: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: 'leadership' | 'finance_head' | 'delivery_owner' | 'resource_manager' | 'hr';
  };
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: 'leadership' | 'finance_head' | 'delivery_owner' | 'resource_manager' | 'hr';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Request types for creating/updating resources
export interface CreateResourceRequest {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  designation: string;
  department: string;
  location: string;
  status?: 'allocated' | 'bench' | 'training' | 'shadow' | 'internal' | 'pip' | 'inactive';
  resource_type?: 'billable' | 'non_billable' | 'intern' | 'contractor';
  experience_level?: 'fresher' | 'junior' | 'senior' | 'lead' | 'architect';
  cost_rate?: number;
  billing_rate?: number;
  primary_skills?: string;
  secondary_skills?: string;
  years_of_experience?: number;
  joining_date?: string;
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
  id: number;
}

// Request types for projects
export interface CreateProjectRequest {
  project_code: string;
  project_name: string;
  client_name: string;
  project_manager?: string;
  start_date: string;
  end_date?: string;
  planned_end_date?: string;
  status?: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled' | 'at_risk' | 'delayed';
  project_type?: 'development' | 'maintenance' | 'consulting' | 'support' | 'training' | 'research' | 'fixed_price' | 'time_material' | 'retainer' | 'internal';
  health_status?: 'green' | 'yellow' | 'amber' | 'red' | 'unknown';
  sow_value: number;
  budget_allocated?: number;
  description?: string;
  technology_stack?: string;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
}

// Enhanced KPI Summary Response with all metrics
export interface KPISummaryResponse {
  // Resource KPIs
  total_resources: number;
  billable_resources: number;
  non_billable_resources: number;
  bench_resources: number;
  intern_resources: number;
  contractor_resources: number;
  training_resources: number;
  
  // Project KPIs
  active_projects: number;
  completed_projects: number;
  delayed_projects: number;
  at_risk_projects: number;
  
  // Financial KPIs
  total_revenue: number;
  total_cost: number;
  total_margin: number;
  margin_percentage: number;
  monthly_revenue: number;
  monthly_cost: number;
  monthly_margin: number;
  
  // Utilization KPIs
  overall_utilization: number;
  billable_utilization: number;
  target_utilization: number;
  utilization_rate: number;
  bench_percentage: number;
  avg_bench_days: number;
  
  // Quality KPIs
  average_project_health: number;
  client_satisfaction_average: number;
  defect_density: number;
  
  // Performance KPIs
  on_time_delivery_rate: number;
  budget_adherence_rate: number;
  scope_change_frequency: number;
  
  // Escalation KPIs
  total_escalations: number;
  open_escalations: number;
  critical_escalations: number;
}

// Enhanced Analytics Response Types
export interface ResourceAnalyticsResponse {
  department_distribution: Array<{
    name: string;
    count: number;
    avg_utilization: number;
    bench_count: number;
  }>;
  location_distribution: Array<{
    name: string;
    count: number;
    avg_cost_rate: number;
  }>;
  experience_distribution: Array<{
    name: string;
    count: number;
    avg_billing_rate: number;
  }>;
  bench_aging: Array<{
    bucket: string;
    count: number;
    avg_monthly_cost: number;
    total_monthly_cost: number;
  }>;
  utilization_trends: Array<{
    department: string;
    current_utilization: number;
    three_month_avg: number;
    six_month_avg: number;
  }>;
}

export interface EscalationAnalyticsResponse {
  kpis: {
    total_escalations: number;
    open_escalations: number;
    critical_escalations: number;
    overdue_escalations: number;
    avg_resolution_time_hours: number;
    resolution_rate_percentage: number;
    avg_client_satisfaction: number;
  };
  status_distribution: Array<{
    status: string;
    count: number;
  }>;
  priority_distribution: Array<{
    priority: string;
    count: number;
  }>;
  type_distribution: Array<{
    type: string;
    count: number;
  }>;
  monthly_trend: Array<{
    year: number;
    month: number;
    total: number;
    resolved: number;
    avg_resolution_time: number;
  }>;
  project_escalations: Array<{
    project_name: string;
    client_name: string;
    total_escalations: number;
    critical_escalations: number;
    avg_satisfaction: number;
  }>;
  resolution_time_analysis: Array<{
    bucket: string;
    count: number;
  }>;
}

// Additional interfaces for new tables

export interface TimeEntry {
  id: number;
  resource_id: number;
  project_id: number;
  task_description?: string;
  work_date: string;
  hours_worked: number;
  overtime_hours?: number;
  billable_hours?: number;
  activity_type?: 'development' | 'testing' | 'design' | 'meeting' | 'planning' | 'documentation' | 'training' | 'support';
  billing_status?: 'billable' | 'non_billable' | 'internal';
  approved_by?: number;
  approval_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRisk {
  id: number;
  project_id: number;
  risk_title: string;
  risk_description?: string;
  risk_category?: 'technical' | 'business' | 'resource' | 'external' | 'financial' | 'timeline';
  probability?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  impact?: 'negligible' | 'minor' | 'moderate' | 'major' | 'severe';
  risk_score?: number;
  status?: 'identified' | 'assessed' | 'mitigation_planned' | 'mitigating' | 'monitoring' | 'closed';
  owner_id?: number;
  identified_date?: string;
  mitigation_plan?: string;
  contingency_plan?: string;
  review_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDeliverable {
  id: number;
  project_id: number;
  deliverable_name: string;
  description?: string;
  deliverable_type?: 'document' | 'software' | 'report' | 'training' | 'hardware' | 'service';
  planned_delivery_date?: string;
  actual_delivery_date?: string;
  status?: 'not_started' | 'in_progress' | 'review' | 'delivered' | 'accepted' | 'rejected';
  quality_score?: number;
  responsible_resource_id?: number;
  reviewer_id?: number;
  client_acceptance_date?: string;
  revision_count?: number;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientFeedback {
  id: number;
  project_id: number;
  feedback_date?: string;
  feedback_type?: 'formal_review' | 'informal' | 'escalation' | 'appreciation' | 'complaint';
  overall_satisfaction?: number;
  communication_rating?: number;
  quality_rating?: number;
  timeline_rating?: number;
  value_rating?: number;
  feedback_summary?: string;
  improvement_suggestions?: string;
  action_items?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceSkillsAssessment {
  id: number;
  resource_id: number;
  skill_name: string;
  skill_category?: string;
  proficiency_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  proficiency_score?: number;
  years_experience?: number;
  last_assessed_date?: string;
  assessed_by?: number;
  certification_obtained?: boolean;
  certification_name?: string;
  certification_date?: string;
  certification_expiry?: string;
  created_at: string;
  updated_at: string;
}
