
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { 
  KPISummaryResponse, 
  ProjectResponse, 
  ResourceResponse, 
  FinancialResponse,
  EscalationResponse,
  BenchCostingResponse,
  ProjectAllocationResponse
} from '@/types/api';

export const useApiData = <T>(
  endpoint: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await endpoint();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await endpoint();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Specific hooks for different data types with proper typing
export const useResources = () => {
  return useApiData<ResourceResponse[]>(() => apiService.getResources());
};

export const useProjects = () => {
  return useApiData<ProjectResponse[]>(() => apiService.getProjects());
};

export const useFinancials = () => {
  return useApiData<FinancialResponse[]>(() => apiService.getFinancials());
};

export const useBenchCosting = () => {
  return useApiData<BenchCostingResponse[]>(() => apiService.getBenchCosting());
};

export const useProjectAllocations = () => {
  return useApiData<ProjectAllocationResponse[]>(() => apiService.getProjectAllocations());
};

export const useEscalations = () => {
  return useApiData<EscalationResponse[]>(() => apiService.getEscalations());
};

export const useKPISummary = () => {
  return useApiData<KPISummaryResponse>(() => apiService.getKPISummary());
};

export const useProjectMilestones = (projectId?: number) => {
  return useApiData(
    () => apiService.getProjectMilestones(projectId),
    [projectId]
  );
};
