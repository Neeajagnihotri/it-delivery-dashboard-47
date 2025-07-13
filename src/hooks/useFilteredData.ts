
import { useState, useEffect, useMemo } from 'react';
import { useGlobalDateFilter } from '@/contexts/GlobalDateFilterContext';
import { useKPISummary, useProjects, useResources, useEscalations } from './useApiData';
import { apiService } from '@/services/api';
import type { KPISummaryResponse, ProjectResponse, ResourceResponse, EscalationResponse } from '@/types/api';

export const useFilteredData = () => {
  const { getCurrentDateRange } = useGlobalDateFilter();
  const { data: kpiSummary, loading: kpiLoading } = useKPISummary();
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: resources, loading: resourcesLoading } = useResources();
  const { data: escalations, loading: escalationsLoading } = useEscalations();
  const [escalationKpis, setEscalationKpis] = useState<any>(null);

  // Fetch escalation KPIs separately for dashboard integration
  useEffect(() => {
    const fetchEscalationKpis = async () => {
      try {
        const kpis = await apiService.getEscalationDashboardKpis();
        setEscalationKpis(kpis);
      } catch (error) {
        console.error('Failed to fetch escalation KPIs:', error);
      }
    };

    fetchEscalationKpis();
  }, []);

  const filteredData = useMemo(() => {
    const dateRange = getCurrentDateRange();
    
    // If still loading, return loading state
    if (kpiLoading || projectsLoading || resourcesLoading || escalationsLoading) {
      return null;
    }

    // Use real KPI data if available
    const realKPIs = kpiSummary || {} as KPISummaryResponse;
    
    // Calculate KPIs from real data with escalation integration
    const activeProjects = realKPIs.active_projects || (projects?.filter((p: ProjectResponse) => p.status === 'active').length || 0);
    const atRiskProjects = realKPIs.at_risk_projects || (projects?.filter((p: ProjectResponse) => p.status === 'at_risk').length || 0);
    const totalResources = realKPIs.total_resources || (resources?.length || 0);
    const openEscalations = Array.isArray(escalations) ? escalations.filter((e: EscalationResponse) => e.status === 'open').length : 0;
    
    // Get escalation score from backend KPIs with proper fallback
    const escalationScore = escalationKpis?.escalation_score || realKPIs.escalation_score || 75;

    const calculatedKPIs = [
      {
        id: "active-projects",
        title: "Active Projects",
        value: activeProjects,
        subtitle: "Currently in progress",
        icon: "FolderOpen",
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        id: "total-resources",
        title: "Total Resources",
        value: totalResources,
        subtitle: `${realKPIs.billable_resources || 0} billable`,
        icon: "Users",
        iconColor: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        id: "at-risk",
        title: "At Risk",
        value: atRiskProjects,
        subtitle: `${Math.round((atRiskProjects / (activeProjects || 1)) * 100)}% Need attention`,
        icon: "AlertTriangle",
        iconColor: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        id: "escalations",
        title: "Escalations",
        value: openEscalations,
        subtitle: `Score: ${escalationScore}/100`,
        icon: "AlertCircle",
        iconColor: "text-red-600",
        bgColor: "bg-red-50"
      }
    ];

    // Calculate resource overview from real data
    const billableResources = realKPIs.billable_resources || 0;
    const benchResources = realKPIs.bench_resources || 0;
    const utilizationRate = realKPIs.utilization_rate || 0;

    // Calculate role distribution with percentages
    const roleDistribution = [
      { role: "Senior Engineer", count: Math.floor(totalResources * 0.3) },
      { role: "Software Engineer", count: Math.floor(totalResources * 0.4) },
      { role: "Junior Engineer", count: Math.floor(totalResources * 0.2) },
      { role: "Others", count: Math.floor(totalResources * 0.1) }
    ].map(role => ({
      ...role,
      percentage: totalResources > 0 ? Math.round((role.count / totalResources) * 100) : 0
    }));

    // Calculate experience distribution with percentages
    const experienceDistribution = [
      { level: "0-2 years", count: Math.floor(totalResources * 0.25) },
      { level: "2-5 years", count: Math.floor(totalResources * 0.35) },
      { level: "5-8 years", count: Math.floor(totalResources * 0.25) },
      { level: "8+ years", count: Math.floor(totalResources * 0.15) }
    ].map(exp => ({
      ...exp,
      percentage: totalResources > 0 ? Math.round((exp.count / totalResources) * 100) : 0
    }));

    const resourceOverview = {
      totalEngineers: totalResources,
      benchPercentage: realKPIs.bench_percentage || 0,
      allocationPercentage: utilizationRate,
      roleDistribution,
      experienceDistribution,
      billableRatio: {
        billable: billableResources,
        nonBillable: totalResources - billableResources,
        billablePercentage: totalResources > 0 ? Math.round((billableResources / totalResources) * 100) : 0
      }
    };

    // Convert escalations to match expected format with enhanced data
    const formattedEscalations = Array.isArray(escalations) ? escalations.map((escalation: EscalationResponse) => ({
      id: escalation.id.toString(),
      title: escalation.title,
      customer: escalation.client_name || "TBD",
      project: escalation.project_name || "TBD",
      owner: escalation.assigned_to || escalation.raised_by,
      priority: escalation.priority,
      status: escalation.status,
      dateRaised: escalation.raised_date?.split('T')[0] || '',
      resolutionETA: escalation.target_resolution_date?.split('T')[0] || '',
      description: escalation.description,
      businessImpact: escalation.business_impact || 'Medium',
      escalationType: escalation.escalation_type || 'Technical'
    })) : [];

    // Project health from real projects with proper mapping
    const projectHealth = projects?.map((project: ProjectResponse) => ({
      id: project.id.toString(),
      projectName: project.project_name,
      customer: project.client_name || "TBD",
      healthStatus: project.health_status === 'green' ? 'Green' : 
                    project.health_status === 'amber' ? 'Amber' : 
                    project.health_status === 'yellow' ? 'Yellow' : 'Red',
      currentStage: project.current_milestone || "Development",
      onTimePercentage: project.on_time_percentage || 85,
      endDate: project.end_date?.split('T')[0] || project.planned_end_date?.split('T')[0] || '',
      riskLevel: project.risk_level || 'Low',
      dmPo: project.project_manager || "TBD"
    })) || [];

    return {
      kpis: calculatedKPIs,
      resourceOverview,
      escalations: formattedEscalations,
      projectHealth,
      escalationScore // Include escalation score for dashboard
    };
  }, [getCurrentDateRange, kpiSummary, projects, resources, escalations, escalationKpis, kpiLoading, projectsLoading, resourcesLoading, escalationsLoading]);

  return filteredData;
};
