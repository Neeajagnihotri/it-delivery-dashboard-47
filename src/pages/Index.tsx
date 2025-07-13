

import { KPICard } from "@/components/dashboard/KPICard";
import { ProjectHealthTable } from "@/components/dashboard/ProjectHealthTable";
import { EscalationTable } from "@/components/dashboard/EscalationTable";
import { ResourceOverviewCard } from "@/components/dashboard/ResourceOverviewCard";
import { useFilteredData } from "@/hooks/useFilteredData";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Users, AlertTriangle, AlertCircle } from "lucide-react";

const Index = () => {
  const filteredData = useFilteredData();

  if (!filteredData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const { kpis, resourceOverview, escalations, projectHealth } = filteredData;

  // Map string icons to actual Lucide components
  const iconMap = {
    FolderOpen,
    Users,
    AlertTriangle,
    AlertCircle
  };

  const kpisWithIcons = kpis.map(kpi => ({
    ...kpi,
    icon: iconMap[kpi.icon as keyof typeof iconMap] || FolderOpen
  }));

  const handleEditEscalation = (escalation: any) => {
    console.log('Edit escalation:', escalation);
    // TODO: Implement edit functionality
  };

  const handleDeleteEscalation = (id: string) => {
    console.log('Delete escalation:', id);
    // TODO: Implement delete functionality
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpisWithIcons.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Overview */}
        <ResourceOverviewCard {...resourceOverview} />

        {/* Project Health */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Project Health</h3>
          <ProjectHealthTable projects={projectHealth} />
        </div>
      </div>

      {/* Escalations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Escalations</h3>
        <EscalationTable 
          escalations={escalations} 
          onEdit={handleEditEscalation}
          onDelete={handleDeleteEscalation}
        />
      </div>
    </div>
  );
};

export default Index;
