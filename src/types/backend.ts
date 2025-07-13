// Backend API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Enhanced User interface
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'leadership' | 'finance_head' | 'delivery_owner' | 'resource_manager' | 'hr';
  is_active: boolean;
  last_login?: string;
  profile_image_url?: string;
  phone?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Personal Info interface
export interface PersonalInfo {
  id: number;
  employee_id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  designation?: string;
  department?: string;
  seniority_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'director';
  experience_years?: number;
  experience_months?: number;
  location?: string;
  work_location?: 'office' | 'remote' | 'hybrid';
  joining_date?: string;
  probation_end_date?: string;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern' | 'consultant';
  employment_status?: 'active' | 'inactive' | 'terminated' | 'resigned' | 'on_leave';
  reporting_manager?: string;
  reporting_manager_id?: string;
  email?: string;
  personal_email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  passport_number?: string;
  visa_status?: string;
  visa_expiry_date?: string;
  salary_currency?: string;
  bank_account_number?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Resource interface with comprehensive tracking
export interface Resource {
  id: number;
  employee_id: string;
  resource_type: 'billable' | 'non_billable' | 'intern' | 'shadow' | 'contractor';
  status: 'active' | 'bench' | 'allocated' | 'unavailable' | 'training';
  
  // Skills and Qualifications
  skill_category?: string;
  primary_skills?: string; // JSON array
  primary_skills_experience?: number;
  secondary_skills?: string; // JSON array
  secondary_skills_experience?: number;
  certifications?: string; // JSON array
  education_qualification?: string;
  training_completed?: string; // JSON array
  
  // Performance and Utilization
  performance_rating?: number;
  last_performance_review_date?: string;
  next_performance_review_date?: string;
  utilization_target?: number;
  current_utilization?: number;
  average_utilization_3m?: number;
  average_utilization_6m?: number;
  billable_hours_target?: number;
  
  // Bench and Allocation
  bench_start_date?: string;
  bench_reason?: string;
  available_from_date?: string;
  current_project_allocation?: number;
  max_allocation_percentage?: number;
  
  // Financial Information
  cost_center?: string;
  billing_rate?: number;
  cost_rate?: number;
  overtime_rate?: number;
  currency?: string;
  rate_effective_date?: string;
  
  // Career Development
  career_level?: string;
  promotion_eligible_date?: string;
  learning_budget?: number;
  learning_budget_used?: number;
  
  created_at: string;
  updated_at: string;
}

// Enhanced Project interface with comprehensive tracking
export interface Project {
  id: number;
  project_code: string;
  project_name: string;
  client_name?: string;
  client_contact_email?: string;
  client_contact_phone?: string;
  project_manager?: string;
  project_manager_id?: number;
  technical_lead?: string;
  technical_lead_id?: number;
  delivery_owner?: string;
  delivery_owner_id?: number;
  
  // Timeline
  start_date?: string;
  end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  
  // Status and Health
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'delayed';
  health_status?: 'green' | 'yellow' | 'red' | 'unknown';
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  
  // Project Details
  project_type?: 'development' | 'maintenance' | 'consulting' | 'support' | 'training' | 'research';
  methodology?: 'agile' | 'waterfall' | 'hybrid' | 'kanban' | 'scrum';
  project_priority?: 'low' | 'medium' | 'high' | 'critical';
  
  // Financial
  budget?: number;
  actual_cost?: number;
  revenue?: number;
  profit_margin?: number;
  currency?: string;
  billing_type?: 'fixed_price' | 'time_material' | 'retainer' | 'outcome_based';
  
  // Descriptions
  description?: string;
  objectives?: string;
  deliverables?: string;
  success_criteria?: string;
  constraints?: string;
  assumptions?: string;
  
  // Progress
  completion_percentage?: number;
  scope_change_requests?: number;
  change_request_value?: number;
  
  // Quality
  defect_count?: number;
  critical_defects?: number;
  code_coverage_percentage?: number;
  
  // Client Satisfaction
  client_satisfaction_score?: number;
  last_client_feedback_date?: string;
  
  created_at: string;
  updated_at: string;
}

// Enhanced Project Milestone interface
export interface ProjectMilestone {
  id: number;
  project_id: number;
  milestone_name: string;
  description?: string;
  milestone_type?: 'planning' | 'development' | 'testing' | 'deployment' | 'review' | 'delivery';
  planned_date?: string;
  baseline_date?: string;
  actual_date?: string;
  status: 'not_started' | 'planned' | 'in_progress' | 'completed' | 'delayed' | 'at_risk' | 'cancelled';
  completion_percentage?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string; // JSON array
  deliverables?: string;
  acceptance_criteria?: string;
  owner_id?: number;
  estimated_effort_hours?: number;
  actual_effort_hours?: number;
  budget_allocated?: number;
  budget_consumed?: number;
  created_at: string;
  updated_at: string;
}

// Enhanced Project Financials interface (renamed from Financial)
export interface ProjectFinancial {
  id: number;
  project_id: number;
  month_year: string;
  
  // Revenue Tracking
  planned_revenue?: number;
  actual_revenue?: number;
  invoiced_amount?: number;
  collected_amount?: number;
  outstanding_amount?: number;
  
  // Cost Tracking
  planned_cost?: number;
  actual_cost?: number;
  resource_cost?: number;
  infrastructure_cost?: number;
  vendor_cost?: number;
  overhead_cost?: number;
  
  // Margin Analysis
  gross_margin?: number;
  net_margin?: number;
  margin_percentage?: number;
  
  // Budget Analysis
  budget_variance?: number;
  budget_variance_percentage?: number;
  cost_variance?: number;
  schedule_variance?: number;
  
  // Forecasting
  forecasted_revenue?: number;
  forecasted_cost?: number;
  forecasted_margin?: number;
  
  // Billing Information
  billing_cycle?: 'weekly' | 'monthly' | 'quarterly' | 'milestone_based';
  currency?: string;
  exchange_rate?: number;
  
  // Notes
  financial_notes?: string;
  risk_factors?: string;
  
  created_at: string;
  updated_at: string;
}

// Enhanced Bench Costing interface
export interface BenchCosting {
  id: number;
  resource_id: number;
  month_year: string;
  
  // Cost Details
  bench_cost?: number;
  salary_cost?: number;
  benefits_cost?: number;
  overhead_cost?: number;
  training_cost?: number;
  
  // Time Tracking
  bench_days?: number;
  total_working_days?: number;
  training_days?: number;
  available_days?: number;
  
  // Bench Information
  bench_reason?: string;
  bench_category?: 'project_gap' | 'skill_development' | 'awaiting_allocation' | 'performance_improvement' | 'client_delay';
  expected_allocation_date?: string;
  upskilling_activities?: string;
  
  // Cost Center
  cost_center?: string;
  department_code?: string;
  
  created_at: string;
  updated_at: string;
}

// Enhanced Project Allocation interface
export interface ProjectAllocation {
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
  daily_hours?: number;
  weekly_hours?: number;
  overtime_hours?: number;
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

// Enhanced Escalation interface
export interface Escalation {
  id: number;
  title: string;
  description?: string;
  
  // Stakeholder Information
  customer?: string;
  client_contact_email?: string;
  project_id?: number;
  project_owner?: string;
  escalation_owner?: string;
  escalated_to?: string;
  
  // Classification
  escalation_type?: 'technical' | 'commercial' | 'resource' | 'timeline' | 'quality' | 'scope';
  category?: 'bug' | 'feature_request' | 'performance' | 'security' | 'compliance' | 'process';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity?: 'minor' | 'major' | 'critical' | 'blocker';
  
  // Status Tracking
  status: 'open' | 'acknowledged' | 'in_progress' | 'pending_client' | 'resolved' | 'closed' | 'cancelled';
  resolution_status?: 'pending' | 'fixed' | 'workaround' | 'wont_fix' | 'duplicate';
  
  // Timeline
  date_raised: string;
  date_acknowledged?: string;
  target_resolution_date?: string;
  actual_resolution_date?: string;
  date_closed?: string;
  response_time_hours?: number;
  resolution_time_hours?: number;
  
  // Impact and Business
  business_impact?: string;
  financial_impact?: number;
  affected_users?: number;
  downtime_hours?: number;
  
  // Resolution Details
  root_cause?: string;
  resolution_summary?: string;
  actions_taken?: string;
  preventive_measures?: string;
  
  // Communication
  client_communication?: string;
  internal_notes?: string;
  communication_log?: string; // JSON array
  
  // Approval and Sign-off
  client_signoff_required?: boolean;
  client_signoff_date?: string;
  client_satisfaction_rating?: number;
  
  created_at: string;
  updated_at: string;
}

// Enhanced KPI Summary interface
export interface KPISummary {
  // Resource KPIs
  total_resources: number;
  billable_resources: number;
  non_billable_resources: number;
  bench_resources: number;
  intern_resources: number;
  contractor_resources: number;
  
  // Project KPIs
  active_projects: number;
  completed_projects: number;
  delayed_projects: number;
  at_risk_projects: number;
  
  // Financial KPIs
  total_revenue?: number;
  total_cost?: number;
  total_margin?: number;
  margin_percentage?: number;
  monthly_revenue?: number;
  monthly_cost?: number;
  monthly_margin?: number;
  
  // Utilization KPIs
  overall_utilization?: number;
  billable_utilization?: number;
  target_utilization?: number;
  bench_percentage?: number;
  
  // Quality KPIs
  average_project_health?: number;
  client_satisfaction_average?: number;
  defect_density?: number;
  
  // Performance KPIs
  on_time_delivery_rate?: number;
  budget_adherence_rate?: number;
  scope_change_frequency?: number;
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