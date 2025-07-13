
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscalationTable } from "@/components/dashboard/EscalationTable";
import { CreateEscalationDialog } from "@/components/dashboard/CreateEscalationDialog";
import { EditEscalationDialog } from "@/components/dashboard/EditEscalationDialog";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import dashboardData from "@/data/dashboardData.json";

interface Escalation {
  id: string;
  title: string;
  customer: string;
  project: string;
  owner: string;
  priority: string;
  status: string;
  dateRaised: string;
  resolutionETA: string;
  description?: string;
}

const Escalations = () => {
  const { toast } = useToast();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);

  useEffect(() => {
    // Simulate API call - replace with actual API call later
    setEscalations(dashboardData.escalations);
  }, []);

  const handleEdit = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEscalations(prev => prev.filter(esc => esc.id !== id));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              ⚠️ Customer Escalations
            </h1>
            <p className="text-muted-foreground">Track and manage project escalations and exceptions</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            Create New Escalation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Escalations</CardTitle>
        </CardHeader>
        <CardContent>
          <EscalationTable 
            escalations={escalations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CreateEscalationDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      <EditEscalationDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        escalation={selectedEscalation}
      />
    </div>
  );
};

export default Escalations;
