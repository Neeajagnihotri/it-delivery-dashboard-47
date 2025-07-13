
import { useMemo } from 'react';
import { useProjects, useFinancials, useKPISummary } from './useApiData';

export interface MonthlyData {
  month: string;
  revenue: number;
  cost: number;
  margin: number;
}

export interface YTDSummary {
  totalRevenue: number;
  totalCost: number;
  totalMargin: number;
  marginPercentage: number;
}

export interface ProjectFinancialSummary {
  projectName: string;
  revenue: number;
  cost: number;
  margin: number;
  marginPercentage: number;
  budgetUtilization: number;
}

export interface ProjectFinancial {
  projectId: string;
  projectName: string;
  projectType: string;
  startDate: string;
  sowValue: number;
  billingRate: string;
  monthlyBurn: number;
  billableResources: number;
  nonBillableResources: number;
  shadowResources: number;
  utilizationRate: number;
  actualCostToDate: number;
  profitMargin: number;
  projectedCompletion: string;
  healthStatus: string;
}

export interface BenchResource {
  totalBenchResources: number;
  monthlyCost: number;
  skillBreakdown: Array<{
    skill: string;
    count: number;
    monthlyCost: number;
  }>;
}

export interface KPIData {
  totalSOWValue: number;
  projectActuals: number;
  benchCostMonthly: number;
  overallMargin: number;
  avgUtilization: number;
}

export const useFinancialData = () => {
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: financials, loading: financialsLoading } = useFinancials();
  const { data: kpiData, loading: kpiLoading } = useKPISummary();

  const processedData = useMemo(() => {
    if (projectsLoading || financialsLoading || kpiLoading) {
      return {
        loading: true,
        monthlyData: [],
        ytdSummary: null,
        projectSummaries: [],
        projectFinancials: [],
        benchResources: null,
        kpis: null,
        formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
        formatPercentage: (value: number) => `${value.toFixed(1)}%`
      };
    }

    // Mock monthly financial data
    const monthlyData: MonthlyData[] = [
      { month: 'Jan', revenue: 150000, cost: 120000, margin: 30000 },
      { month: 'Feb', revenue: 180000, cost: 140000, margin: 40000 },
      { month: 'Mar', revenue: 165000, cost: 130000, margin: 35000 },
      { month: 'Apr', revenue: 200000, cost: 160000, margin: 40000 },
      { month: 'May', revenue: 185000, cost: 145000, margin: 40000 },
      { month: 'Jun', revenue: 190000, cost: 150000, margin: 40000 }
    ];

    // Calculate YTD summary
    const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
    const totalCost = monthlyData.reduce((sum, data) => sum + data.cost, 0);
    const totalMargin = totalRevenue - totalCost;
    const marginPercentage = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;

    const ytdSummary: YTDSummary = {
      totalRevenue,
      totalCost,
      totalMargin,
      marginPercentage
    };

    // Process project financial summaries
    const projectSummaries: ProjectFinancialSummary[] = (projects || []).map(project => {
      const revenue = project.sow_value || 0;
      const cost = project.actual_cost || 0;
      const margin = revenue - cost;
      const marginPercentage = revenue > 0 ? (margin / revenue) * 100 : 0;
      const budgetAllocated = project.budget_allocated || project.sow_value || 0;
      const budgetUtilization = budgetAllocated > 0 ? (cost / budgetAllocated) * 100 : 0;

      return {
        projectName: project.project_name,
        revenue,
        cost,
        margin,
        marginPercentage,
        budgetUtilization
      };
    });

    // Mock project financials data
    const projectFinancials: ProjectFinancial[] = (projects || []).map(project => ({
      projectId: project.id.toString(),
      projectName: project.project_name,
      projectType: project.project_type || 'time_material',
      startDate: project.start_date,
      sowValue: project.sow_value || 0,
      billingRate: '$150/hr',
      monthlyBurn: project.monthly_burn_rate || 50000,
      billableResources: project.billable_resources_count || 5,
      nonBillableResources: project.non_billable_resources_count || 2,
      shadowResources: project.shadow_resources_count || 1,
      utilizationRate: project.utilization_rate || 85,
      actualCostToDate: project.actual_cost || 0,
      profitMargin: project.profit_margin || 15,
      projectedCompletion: project.planned_end_date || project.end_date || 'Q4 2024',
      healthStatus: project.health_status === 'green' ? 'Positive' : 'Negative'
    }));

    // Mock bench resources data
    const benchResources: BenchResource = {
      totalBenchResources: kpiData?.bench_resources || 15,
      monthlyCost: (kpiData?.bench_resources || 15) * 8000,
      skillBreakdown: [
        { skill: 'React Development', count: 5, monthlyCost: 40000 },
        { skill: 'Java Development', count: 4, monthlyCost: 32000 },
        { skill: 'DevOps', count: 3, monthlyCost: 36000 },
        { skill: 'QA Testing', count: 3, monthlyCost: 24000 }
      ]
    };

    // Mock KPI data
    const kpis: KPIData = {
      totalSOWValue: kpiData?.total_revenue || 2400000,
      projectActuals: totalCost,
      benchCostMonthly: benchResources.monthlyCost,
      overallMargin: marginPercentage,
      avgUtilization: kpiData?.utilization_rate || 85
    };

    const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    return {
      loading: false,
      monthlyData,
      ytdSummary,
      projectSummaries,
      projectFinancials,
      benchResources,
      kpis,
      formatCurrency,
      formatPercentage
    };
  }, [projects, financials, kpiData, projectsLoading, financialsLoading, kpiLoading]);

  return processedData;
};
