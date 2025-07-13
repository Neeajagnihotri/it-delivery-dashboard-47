
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ResourceData } from "@/types/resource";

interface ResourceViewModalProps {
  resource: ResourceData;
  onClose: () => void;
}

export const ResourceViewModal = ({ resource, onClose }: ResourceViewModalProps) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Resource Details - {resource.full_name}</CardTitle>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* HR Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">HR Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-medium">{resource.employee_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{resource.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium">{resource.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{resource.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience Level</p>
                <p className="font-medium">{resource.experience_level || resource.seniority_level || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{resource.years_of_experience || resource.experience || 0} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{resource.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joining Date</p>
                <p className="font-medium">{resource.joining_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <Badge variant="outline">{resource.employment_type || "FTE"}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reporting Manager</p>
                <p className="font-medium">{resource.reporting_manager || "-"}</p>
              </div>
            </div>
          </div>

          {/* Skills Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Skills & Resource Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Skill Category</p>
                <Badge variant="secondary">{resource.skill_category || "General"}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Primary Skills</p>
                <p className="font-medium">{resource.primary_skills || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Secondary Skills</p>
                <p className="font-medium">{resource.secondary_skills || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Resource Type</p>
                <Badge variant={resource.resource_type === 'billable' ? "default" : "secondary"}>
                  {resource.resource_type === 'billable' ? "Billable" : resource.resource_type === 'intern' ? "Intern" : "Non-Billable"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <Badge variant="outline">{resource.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Engagement</p>
                <p className="font-medium">{resource.current_engagement || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilization %</p>
                <p className="font-medium">{resource.utilization_percentage || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bench Days</p>
                <Badge 
                  variant={resource.bench_days > 60 ? "destructive" : 
                         resource.bench_days > 30 ? "outline" : "secondary"}
                >
                  {resource.bench_days || 0} days
                </Badge>
              </div>
            </div>
          </div>

          {/* Finance Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Finance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cost Rate</p>
                <p className="font-medium">{formatCurrency(resource.cost_rate || resource.monthly_salary_cost || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Rate</p>
                <p className="font-medium">{resource.billing_rate ? `$${resource.billing_rate}/hr` : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue Generated</p>
                <p className="font-medium">{formatCurrency(resource.monthly_revenue_generated || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cost Center</p>
                <p className="font-medium">{resource.cost_center || resource.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total YTD Cost</p>
                <p className="font-medium">{formatCurrency(resource.total_ytd_cost || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total YTD Revenue</p>
                <p className="font-medium">{formatCurrency(resource.total_ytd_revenue || 0)}</p>
              </div>
            </div>
          </div>

          {/* Intern Information (if applicable) */}
          {resource.resource_type === 'intern' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Intern Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Internship Start Date</p>
                  <p className="font-medium">{resource.internship_start_date || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Internship End Date</p>
                  <p className="font-medium">{resource.internship_end_date || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assigned Project</p>
                  <p className="font-medium">{resource.assigned_project || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mentor Name</p>
                  <p className="font-medium">{resource.mentor_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stipend</p>
                  <p className="font-medium">{resource.stipend ? `$${resource.stipend}` : "-"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
