import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ResignationRecord {
  id: number;
  employee_id: string;
  emp_name: string;
  date_of_resignation: string;
  skill: string;
  client: string;
  project_name: string;
  replacement_plans_needed: string;
  customer_feedback: string;
  status: 'pending' | 'processing' | 'completed';
}

interface ResignationListProps {
  resignations: ResignationRecord[];
}

export const ResignationList = ({ resignations }: ResignationListProps) => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResignation, setEditingResignation] = useState<ResignationRecord | null>(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    emp_name: "",
    date_of_resignation: undefined as Date | undefined,
    skill: "",
    client: "",
    project_name: "",
    replacement_plans_needed: "",
    customer_feedback: "",
    status: "pending" as 'pending' | 'processing' | 'completed'
  });

  const isResourceManager = hasRole(['resource_manager']);
  const canEdit = isResourceManager;

  const resetForm = () => {
    setFormData({
      employee_id: "",
      emp_name: "",
      date_of_resignation: undefined,
      skill: "",
      client: "",
      project_name: "",
      replacement_plans_needed: "",
      customer_feedback: "",
      status: "pending"
    });
    setEditingResignation(null);
  };

  const handleEdit = (resignation: ResignationRecord) => {
    if (!canEdit) return;
    
    setEditingResignation(resignation);
    setFormData({
      employee_id: resignation.employee_id,
      emp_name: resignation.emp_name,
      date_of_resignation: new Date(resignation.date_of_resignation),
      skill: resignation.skill,
      client: resignation.client,
      project_name: resignation.project_name,
      replacement_plans_needed: resignation.replacement_plans_needed,
      customer_feedback: resignation.customer_feedback,
      status: resignation.status
    });
    setIsDialogOpen(true);
  };

  const handleView = (resignation: ResignationRecord) => {
    setEditingResignation(resignation);
    setFormData({
      employee_id: resignation.employee_id,
      emp_name: resignation.emp_name,
      date_of_resignation: new Date(resignation.date_of_resignation),
      skill: resignation.skill,
      client: resignation.client,
      project_name: resignation.project_name,
      replacement_plans_needed: resignation.replacement_plans_needed,
      customer_feedback: resignation.customer_feedback,
      status: resignation.status
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    if (!canEdit) return;
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to modify resignation records.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would make API call to save/update resignation
      console.log('Submitting resignation:', formData);
      
      toast({
        title: editingResignation ? "Resignation Updated" : "Resignation Added",
        description: `Resignation record has been ${editingResignation ? 'updated' : 'created'} successfully.`
      });
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resignation record.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete resignation records.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would make API call to delete resignation
      console.log('Deleting resignation:', id);
      
      toast({
        title: "Resignation Deleted",
        description: "Resignation record has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resignation record.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resignation List</h3>
          <p className="text-sm text-gray-600">Track and manage employee resignations</p>
        </div>
        {canEdit && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resignation
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr.No</TableHead>
              <TableHead>Emp ID</TableHead>
              <TableHead>Emp Name</TableHead>
              <TableHead>Date of Resignation</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resignations.map((resignation, index) => (
              <TableRow key={resignation.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{resignation.employee_id}</TableCell>
                <TableCell>{resignation.emp_name}</TableCell>
                <TableCell>{format(new Date(resignation.date_of_resignation), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{resignation.skill}</TableCell>
                <TableCell>{resignation.client}</TableCell>
                <TableCell>{resignation.project_name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(resignation.status)}>
                    {resignation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(resignation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(resignation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(resignation.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResignation ? (canEdit ? 'Edit Resignation' : 'View Resignation') : 'Add New Resignation'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                  disabled={!canEdit}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emp_name">Employee Name</Label>
                <Input
                  id="emp_name"
                  value={formData.emp_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, emp_name: e.target.value }))}
                  disabled={!canEdit}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Date of Resignation</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_resignation && "text-muted-foreground"
                    )}
                    disabled={!canEdit}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_resignation ? format(formData.date_of_resignation, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_resignation}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date_of_resignation: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skill">Skill</Label>
                <Input
                  id="skill"
                  value={formData.skill}
                  onChange={(e) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                value={formData.project_name}
                onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="replacement_plans_needed">Replacement Plans Needed</Label>
              <Textarea
                id="replacement_plans_needed"
                value={formData.replacement_plans_needed}
                onChange={(e) => setFormData(prev => ({ ...prev, replacement_plans_needed: e.target.value }))}
                disabled={!canEdit}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="customer_feedback">Customer Feedback</Label>
              <Textarea
                id="customer_feedback"
                value={formData.customer_feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_feedback: e.target.value }))}
                disabled={!canEdit}
                rows={3}
              />
            </div>

            {canEdit && (
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'pending' | 'processing' | 'completed') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {canEdit && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingResignation ? 'Update' : 'Add'} Resignation
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};