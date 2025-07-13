
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { ResourceReleaseSection } from "@/components/dashboard/ResourceReleaseSection";
import { ResourceKPISection } from "@/components/resource-management/ResourceKPISection";
import { ResourceManagerActions } from "@/components/resource-management/ResourceManagerActions";
import { ResourceTabs } from "@/components/resource-management/ResourceTabs";
import { useResourceData } from "@/hooks/useResourceData";
import { useGlobalDateFilter } from "@/contexts/GlobalDateFilterContext";

const ResourceManagement = () => {
  const { getCurrentDateRange } = useGlobalDateFilter();
  const {
    seniorityData,
    skillData,
    agingData,
    engagementData,
    internsData,
    monthlyFinancialData,
    ytdTotals,
    releaseResources
  } = useResourceData();

  // You can now use getCurrentDateRange() to filter resource data based on selected period
  const dateRange = getCurrentDateRange();

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Management Dashboard</h1>
        <p className="text-gray-600">Track billable vs non-billable resources with detailed analytics</p>
      </div>

      <ResourceKPISection />

      <ResourceManagerActions />

      <ResourceReleaseSection resources={releaseResources} />

      <ResourceTabs
        seniorityData={seniorityData}
        skillData={skillData}
        agingData={agingData}
        engagementData={engagementData}
        internsData={internsData}
        monthlyFinancialData={monthlyFinancialData}
        ytdTotals={ytdTotals}
      />
    </div>
  );
};

export default ResourceManagement;
