
import { useResources, useKPISummary } from "./useApiData";
import { useMemo } from 'react';
import type { ResourceResponse, KPISummaryResponse } from '@/types/api';
import type { ReleaseResource } from '@/types/resource-management';

export interface ResourceMetrics {
  totalResources: number;
  billableResources: number;
  nonBillableResources: number;
  benchResources: number;
  utilizationRate: number;
  averageTenure: number;
  employeeSatisfaction: number;
}

export interface SeniorityData {
  level: string;
  count: number;
}

export interface SkillData {
  category: string;
  count: number;
}

export interface AgingData {
  ageRange: string;
  count: number;
}

export interface EngagementData {
  status: string;
  count: number;
}

export interface InternData {
  name: string;
  university: string;
  major: string;
  startDate: string;
  endDate: string;
  stipend: number;
}

export interface MonthlyFinancialData {
  month: string;
  revenue: number;
  cost: number;
}

export interface YTDData {
  totalRevenue: number;
  totalCost: number;
}

export { type ReleaseResource } from '@/types/resource-management';

export const useResourceData = () => {
  const { data: resources, loading: resourcesLoading } = useResources();
  const { data: kpiData, loading: kpiLoading } = useKPISummary();

  const processedData = useMemo(() => {
    if (resourcesLoading || kpiLoading) {
      return {
        loading: true,
        resourceMetrics: null,
        seniorityData: [],
        skillData: [],
        agingData: [],
        engagementData: [],
        internsData: [],
        monthlyFinancialData: [],
        ytdTotals: null,
        releaseResources: []
      };
    }

    // Mock resource metrics data
    const totalResources = kpiData?.total_resources || 150;
    const billableResources = kpiData?.billable_resources || 110;
    const nonBillableResources = totalResources - billableResources;
    const benchResources = kpiData?.bench_resources || 20;
    const utilizationRate = kpiData?.utilization_rate || 85;

    const resourceMetrics: ResourceMetrics = {
      totalResources: totalResources,
      billableResources: billableResources,
      nonBillableResources: nonBillableResources,
      benchResources: benchResources,
      utilizationRate: utilizationRate,
      averageTenure: 2.5,
      employeeSatisfaction: 4.2
    };

    // Mock seniority level distribution
    const seniorityData: SeniorityData[] = [
      { level: "Junior", count: Math.floor(totalResources * 0.3) },
      { level: "Mid-Level", count: Math.floor(totalResources * 0.4) },
      { level: "Senior", count: Math.floor(totalResources * 0.2) },
      { level: "Lead", count: Math.floor(totalResources * 0.1) }
    ];

    // Mock skill category distribution
    const skillData: SkillData[] = [
      { category: "Software Development", count: Math.floor(totalResources * 0.5) },
      { category: "Data Science", count: Math.floor(totalResources * 0.3) },
      { category: "Project Management", count: Math.floor(totalResources * 0.2) }
    ];

    // Mock aging in non-billable status
    const agingData: AgingData[] = [
      { ageRange: "0-30 days", count: Math.floor(benchResources * 0.6) },
      { ageRange: "31-60 days", count: Math.floor(benchResources * 0.3) },
      { ageRange: "61+ days", count: Math.floor(benchResources * 0.1) }
    ];

    // Mock engagement status distribution
    const engagementData: EngagementData[] = [
      { status: "Billable", count: billableResources },
      { status: "Non-Billable", count: nonBillableResources },
      { status: "Bench", count: benchResources }
    ];

    // Mock intern data
    const internsData: InternData[] = [
      {
        name: "Alice Johnson",
        university: "Stanford University",
        major: "Computer Science",
        startDate: "2023-09-01",
        endDate: "2023-12-31",
        stipend: 1500
      },
      {
        name: "Bob Williams",
        university: "MIT",
        major: "Electrical Engineering",
        startDate: "2023-09-01",
        endDate: "2023-12-31",
        stipend: 1600
      }
    ];

    // Mock monthly financial data
    const monthlyFinancialData: MonthlyFinancialData[] = [
      { month: "Jan", revenue: 120000, cost: 80000 },
      { month: "Feb", revenue: 125000, cost: 85000 },
      { month: "Mar", revenue: 130000, cost: 90000 },
      { month: "Apr", revenue: 135000, cost: 95000 },
      { month: "May", revenue: 140000, cost: 100000 },
      { month: "Jun", revenue: 145000, cost: 105000 }
    ];

    // Mock YTD totals
    const ytdTotals: YTDData = {
      totalRevenue: monthlyFinancialData.reduce((sum, data) => sum + data.revenue, 0),
      totalCost: monthlyFinancialData.reduce((sum, data) => sum + data.cost, 0)
    };

    // Generate release resources with proper typing - fix status comparison
    const releaseResources: ReleaseResource[] = (resources || [])
      .filter((resource: ResourceResponse) => {
        // Filter logic for resources that will be released in next 2 months
        return resource.status === 'allocated' && Math.random() > 0.7; // Use 'allocated' instead of 'active'
      })
      .slice(0, 5)
      .map((resource: ResourceResponse, index: number) => ({
        id: resource.id.toString(),
        name: resource.full_name || `${resource.first_name} ${resource.last_name}`,
        currentProject: resource.assigned_project || "Project Alpha",
        releaseDate: new Date(Date.now() + (30 + index * 15) * 24 * 60 * 60 * 1000).toISOString(),
        role: resource.designation,
        experience: resource.experience_level || `${resource.years_of_experience} years`,
        skillset: [resource.skill_category, "JavaScript", "React"].filter(Boolean),
        utilizationPercentage: resource.utilization_percentage || 85,
        status: index % 3 === 0 ? "confirmed" : index % 3 === 1 ? "tentative" : "at-risk"
      })) as ReleaseResource[];

    return {
      loading: false,
      resourceMetrics,
      seniorityData,
      skillData,
      agingData,
      engagementData,
      internsData,
      monthlyFinancialData,
      ytdTotals,
      releaseResources
    };
  }, [resources, kpiData, resourcesLoading, kpiLoading]);

  return processedData;
};
