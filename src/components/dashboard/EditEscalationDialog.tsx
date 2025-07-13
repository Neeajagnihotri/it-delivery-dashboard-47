
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

interface EditEscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  escalation: Escalation | null;
}

export const EditEscalationDialog = ({ open, onOpenChange, escalation }: EditEscalationDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customer: "",
    projectOwner: "",
    priority: "medium",
    status: "open",
    dateRaised: "",
    resolutionETA: "",
    impactAssessment: "",
    actionsTaken: ""
  });

  useEffect(() => {
    if (escalation) {
      setFormData({
        title: escalation.title,
        description: escalation.description || "",
        customer: escalation.customer,
        projectOwner: escalation.owner,
        priority: escalation.priority.toLowerCase(),
        status: escalation.status.toLowerCase().replace(' ', '_'),
        dateRaised: escalation.dateRaised,
        resolutionETA: escalation.resolutionETA,
        impactAssessment: "Customer operations severely impacted with potential SLA breach if not resolved within 24 hours.",
        actionsTaken: "Infrastructure team notified and investigating. Database performance analysis initiated. Customer informed of ongoing investigation."
      });
    }
  }, [escalation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.customer || !formData.projectOwner) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Escalation Updated",
      description: "The escalation has been updated successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚠️ Edit Escalation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={formData.customer} onValueChange={(value) => handleInputChange("customer", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TechCorp Industries">TechCorp Industries</SelectItem>
                    <SelectItem value="InnovateCorp">InnovateCorp</SelectItem>
                    <SelectItem value="GlobalTech">GlobalTech</SelectItem>
                    <SelectItem value="DataFlow Systems">DataFlow Systems</SelectItem>
                    <SelectItem value="CloudSync Ltd">CloudSync Ltd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectOwner">Project Owner *</Label>
                <Select value={formData.projectOwner} onValueChange={(value) => handleInputChange("projectOwner", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                    <SelectItem value="James Wilson">James Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateRaised">Date Raised</Label>
                <Input
                  id="dateRaised"
                  type="date"
                  value={formData.dateRaised}
                  onChange={(e) => handleInputChange("dateRaised", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolutionETA">Resolution ETA</Label>
                <Input
                  id="resolutionETA"
                  type="date"
                  value={formData.resolutionETA}
                  onChange={(e) => handleInputChange("resolutionETA", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impactAssessment">Impact Assessment</Label>
              <Textarea
                id="impactAssessment"
                rows={3}
                value={formData.impactAssessment}
                onChange={(e) => handleInputChange("impactAssessment", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionsTaken">Actions Taken</Label>
              <Textarea
                id="actionsTaken"
                rows={3}
                value={formData.actionsTaken}
                onChange={(e) => handleInputChange("actionsTaken", e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
