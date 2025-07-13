
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResourceData } from "@/types/resource";

interface ResourceTableProps {
  resources: ResourceData[];
  onEdit: (resource: ResourceData) => void;
  onView: (resource: ResourceData) => void;
}

export const ResourceTable = ({ resources, onEdit, onView }: ResourceTableProps) => {
  const exportToCSV = () => {
    const headers = [
      'Employee ID', 
      'Full Name', 
      'Designation',
      'Department',
      'Skill Category',
      'Primary Skills',
      'Status',
      'Monthly Cost'
    ];

    const csvContent = [
      headers.join(','),
      ...resources.map(resource => [
        resource.employee_id,
        `"${resource.full_name}"`,
        `"${resource.designation}"`,
        resource.department,
        resource.skill_category || resource.primary_skills || "",
        resource.primary_skills || "",
        resource.resource_type === 'billable' ? 'Billable' : 'Non-Billable',
        resource.cost_rate || resource.monthly_salary_cost || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'resources.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              Comprehensive list of all resources with their details
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Skill Category</TableHead>
                <TableHead>Primary Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.employee_id}>
                  <TableCell className="font-mono text-sm">{resource.employee_id}</TableCell>
                  <TableCell className="font-medium">{resource.full_name}</TableCell>
                  <TableCell>{resource.designation}</TableCell>
                  <TableCell>{resource.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{resource.skill_category || "General"}</Badge>
                  </TableCell>
                  <TableCell>{resource.primary_skills || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={resource.resource_type === 'billable' ? "default" : "secondary"}>
                      {resource.resource_type === 'billable' ? "Billable" : "Non-Billable"}
                    </Badge>
                  </TableCell>
                  <TableCell>${(resource.cost_rate || resource.monthly_salary_cost || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(resource)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(resource)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
