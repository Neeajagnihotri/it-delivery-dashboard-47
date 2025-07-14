// API service for backend integration
const API_BASE_URL = 'http://localhost:5000/api';

import type { 
  KPISummaryResponse, 
  ProjectResponse, 
  ResourceResponse, 
  FinancialResponse,
  EscalationResponse,
  BenchCostingResponse,
  ProjectAllocationResponse,
  AuthResponse,
  UserResponse
} from '@/types/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    console.log(`Making API request to: ${url}`);
    console.log('Request options:', options);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
        ...options,
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response ok: ${response.ok}`);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          throw new Error('Authentication failed. Please login again.');
        }
        
        let errorMessage = `API request failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore JSON parsing errors for error messages
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data.data || data;
    } catch (error) {
      console.error('API request error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:5000');
      }
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Connection blocked by CORS policy. The Lovable preview cannot connect to localhost. Please deploy your backend or use a service like ngrok to expose it.');
      }
      
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('Attempting login for:', email);
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/me');
  }

  async register(userData: any): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>('/auth/users');
  }

  async getResources(): Promise<ResourceResponse[]> {
    return this.request<ResourceResponse[]>('/resources');
  }

  async getResource(id: number): Promise<ResourceResponse> {
    return this.request<ResourceResponse>(`/resources/${id}`);
  }

  async createResource(data: any): Promise<ResourceResponse> {
    return this.request<ResourceResponse>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResource(id: number, data: any): Promise<ResourceResponse> {
    return this.request<ResourceResponse>(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResource(id: number): Promise<void> {
    return this.request<void>(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  async getBenchResources(): Promise<ResourceResponse[]> {
    return this.request<ResourceResponse[]>('/resources/bench');
  }

  async getBillableResources(): Promise<ResourceResponse[]> {
    return this.request<ResourceResponse[]>('/resources/billable');
  }

  async getInternResources(): Promise<ResourceResponse[]> {
    return this.request<ResourceResponse[]>('/resources/interns');
  }

  async getProjects(): Promise<ProjectResponse[]> {
    return this.request<ProjectResponse[]>('/projects');
  }

  async getProject(id: number): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/projects/${id}`);
  }

  async createProject(data: any): Promise<ProjectResponse> {
    return this.request<ProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number, data: any): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getProjectMilestones(projectId?: number): Promise<any[]> {
    const endpoint = projectId ? `/projects/${projectId}/milestones` : '/milestones';
    return this.request<any[]>(endpoint);
  }

  async getProjectAllocations(): Promise<ProjectAllocationResponse[]> {
    return this.request<ProjectAllocationResponse[]>('/project-allocations');
  }

  async createProjectAllocation(data: any): Promise<ProjectAllocationResponse> {
    return this.request<ProjectAllocationResponse>('/project-allocations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProjectAllocation(id: number, data: any): Promise<ProjectAllocationResponse> {
    return this.request<ProjectAllocationResponse>(`/project-allocations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProjectAllocation(id: number): Promise<void> {
    return this.request<void>(`/project-allocations/${id}`, {
      method: 'DELETE',
    });
  }

  async getFinancials(): Promise<FinancialResponse[]> {
    return this.request<FinancialResponse[]>('/financials');
  }

  async getProjectFinancials(projectId: number): Promise<FinancialResponse[]> {
    return this.request<FinancialResponse[]>(`/projects/${projectId}/financials`);
  }

  async getBenchCosting(): Promise<BenchCostingResponse[]> {
    return this.request<BenchCostingResponse[]>('/bench-costing');
  }

  async getResourceBenchCosting(resourceId: number): Promise<BenchCostingResponse[]> {
    return this.request<BenchCostingResponse[]>(`/resources/${resourceId}/bench-costing`);
  }

  async getEscalations(): Promise<EscalationResponse[]> {
    return this.request<EscalationResponse[]>('/escalations');
  }

  async createEscalation(data: any): Promise<EscalationResponse> {
    return this.request<EscalationResponse>('/escalations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEscalation(id: number, data: any): Promise<EscalationResponse> {
    return this.request<EscalationResponse>(`/escalations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getKPISummary(): Promise<KPISummaryResponse> {
    return this.request<KPISummaryResponse>('/kpis/summary');
  }

  async getResourceKPIs(): Promise<any> {
    return this.request<any>('/kpis/resources');
  }

  async getProjectKPIs(): Promise<any> {
    return this.request<any>('/kpis/projects');
  }

  async getFinancialKPIs(): Promise<any> {
    return this.request<any>('/kpis/financials');
  }

  async getDepartmentDistribution(): Promise<any> {
    return this.request<any>('/kpis/department-distribution');
  }

  async getLocationDistribution(): Promise<any> {
    return this.request<any>('/kpis/location-distribution');
  }

  async getSkillDistribution(): Promise<any> {
    return this.request<any>('/kpis/skill-distribution');
  }

  async getBenchAgingAnalysis(): Promise<any> {
    return this.request<any>('/kpis/bench-aging');
  }

  async getUtilizationTrends(): Promise<any> {
    return this.request<any>('/kpis/utilization-trends');
  }

  async getRevenueTrends(): Promise<any> {
    return this.request<any>('/kpis/revenue-trends');
  }

  async getProjectHealthMetrics(): Promise<any> {
    return this.request<any>('/kpis/project-health');
  }

  async getEscalationDashboardKpis(): Promise<any> {
    return this.request<any>('/escalations/dashboard-kpis');
  }

  async getTimeEntries(resourceId?: number, projectId?: number): Promise<any[]> {
    let endpoint = '/time-entries';
    const params = new URLSearchParams();
    
    if (resourceId) params.append('resource_id', resourceId.toString());
    if (projectId) params.append('project_id', projectId.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.request<any[]>(endpoint);
  }

  async createTimeEntry(data: any): Promise<any> {
    return this.request<any>('/time-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDashboardMetrics(): Promise<any> {
    return this.request<any>('/dashboard/metrics');
  }

  async getResourceAnalytics(): Promise<any> {
    return this.request<any>('/analytics/resources');
  }

  async getProjectAnalytics(): Promise<any> {
    return this.request<any>('/analytics/projects');
  }

  async getFinancialAnalytics(): Promise<any> {
    return this.request<any>('/analytics/financials');
  }
}

export const apiService = new ApiService();
export default apiService;
