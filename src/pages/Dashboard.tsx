
import { useState } from "react";
import { KPICardEnhanced } from "@/components/dashboard/KPICardEnhanced";
import { EscalationCard } from "@/components/dashboard/EscalationCard";
import { ResourceOverviewCard } from "@/components/dashboard/ResourceOverviewCard";
import { ProjectHealthTable } from "@/components/dashboard/ProjectHealthTable";
import { CreateEscalationDialog } from "@/components/dashboard/CreateEscalationDialog";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useToast } from "@/hooks/use-toast";
import { useFilteredData } from "@/hooks/useFilteredData";

const Dashboard = () => {
  const [createEscalationOpen, setCreateEscalationOpen] = useState(false);
  const { toast } = useToast();
  const data = useFilteredData();

  const handleEditEscalation = (id: string) => {
    toast({
      title: "Edit Escalation",
      description: `Editing escalation with ID: ${id}`,
    });
  };

  const handleDeleteEscalation = (id: string) => {
    toast({
      title: "Delete Escalation",
      description: `Deleting escalation with ID: ${id}`,
      variant: "destructive",
    });
  };

  const handleCreateEscalation = () => {
    setCreateEscalationOpen(true);
  };

  if (!data || !data.kpis || !data.resourceOverview || !data.escalations || !data.projectHealth) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />

      {/* KPIs Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {data.kpis.map((kpi: any) => (
          <KPICardEnhanced
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            subtitle={kpi.subtitle}
            icon={kpi.icon}
            iconColor={kpi.iconColor}
            bgColor={kpi.bgColor}
          />
        ))}
      </div>

      {/* Project Health Overview Section */}
      <ProjectHealthTable projects={data.projectHealth} />

      {/* Grid with Resource Overview and Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceOverviewCard
          totalEngineers={data.resourceOverview.totalEngineers}
          benchPercentage={data.resourceOverview.benchPercentage}
          allocationPercentage={data.resourceOverview.allocationPercentage}
          roleDistribution={data.resourceOverview.roleDistribution}
          experienceDistribution={data.resourceOverview.experienceDistribution}
          billableRatio={data.resourceOverview.billableRatio}
        />

        <EscalationCard
          escalations={data.escalations}
          onCreateNew={handleCreateEscalation}
        />
      </div>
      
      <CreateEscalationDialog 
        open={createEscalationOpen} 
        onOpenChange={setCreateEscalationOpen} 
      />
    </div>
  );
};

export default Dashboard;
