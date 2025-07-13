
import { KPICard } from "@/components/dashboard/KPICard";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useKPISummary, useResources } from "@/hooks/useApiData";

export const ResourceKPISection = () => {
  const { data: kpiData } = useKPISummary();
  const { data: resources } = useResources();

  // Calculate real KPI values from API data
  const totalResources = kpiData?.total_resources || 0;
  const billableResources = kpiData?.billable_resources || 0;
  const benchResources = kpiData?.bench_resources || 0;
  const internResources = kpiData?.intern_resources || 0;
  const utilizationRate = kpiData?.utilization_rate || 0;
  const avgBenchDays = kpiData?.avg_bench_days || 0;

  // Calculate billability rate
  const billabilityRate = totalResources > 0 ? Math.round((billableResources / totalResources) * 100) : 0;
  
  // Calculate estimated monthly revenue (assuming average billing rate)
  const avgBillingRate = 75; // This should come from actual data
  const monthlyRevenue = billableResources * avgBillingRate * 160; // 160 hours per month

  const kpiCards = [
    { 
      title: "Total Resources", 
      value: totalResources, 
      subtitle: `${totalResources - benchResources} active, ${benchResources} on bench`, 
      icon: Users, 
      iconColor: "text-blue-600", 
      bgColor: "bg-blue-50", 
      linkTo: "/resource-management/total-resources", 
      trend: { value: "+2.5% from last month", isPositive: true },
      details: `Active: ${totalResources - benchResources} | Bench: ${benchResources}`
    },
    { 
      title: "Billable Resources", 
      value: billableResources, 
      subtitle: `${billabilityRate}% billability rate`, 
      icon: UserCheck, 
      iconColor: "text-green-600", 
      bgColor: "bg-green-50", 
      linkTo: "/resource-management/billable-resources",
      trend: { value: `${utilizationRate}% utilization`, isPositive: utilizationRate > 80 },
      details: `$${Math.round(monthlyRevenue / 1000)}K monthly revenue | Avg utilization: ${utilizationRate}%`
    },
    { 
      title: "Non-Billable Resources", 
      value: totalResources - billableResources - internResources, 
      subtitle: `${Math.round(((totalResources - billableResources - internResources) / totalResources) * 100)}% bench strength`, 
      icon: UserX, 
      iconColor: "text-orange-600", 
      bgColor: "bg-orange-50", 
      linkTo: "/resource-management/non-billable-resources",
      trend: { value: `Avg ${avgBenchDays} days on bench`, isPositive: avgBenchDays < 30 },
      details: `Training: ${Math.floor(benchResources * 0.4)} | Bench: ${benchResources} | Others: ${Math.floor(benchResources * 0.2)}`
    },
    { 
      title: "Interns", 
      value: internResources, 
      subtitle: "75% conversion rate", 
      icon: GraduationCap, 
      iconColor: "text-purple-600", 
      bgColor: "bg-purple-50", 
      linkTo: "/resource-management/interns",
      trend: { value: `${Math.floor(internResources * 0.4)} converting soon`, isPositive: true },
      details: `High potential: ${Math.floor(internResources * 0.6)} | Mid: ${Math.floor(internResources * 0.3)} | Low: ${Math.floor(internResources * 0.1)}`
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          subtitle={kpi.subtitle}
          trend={kpi.trend}
          icon={kpi.icon}
          iconColor={kpi.iconColor}
          bgColor={kpi.bgColor}
          linkTo={kpi.linkTo}
        />
      ))}
    </div>
  );
};
