
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { HRDataForm } from "@/components/forms/HRDataForm";
import { ResourceManagementForm } from "@/components/forms/ResourceManagementForm";
import { InternDataForm } from "@/components/forms/InternDataForm";
import { FinanceDataForm } from "@/components/forms/FinanceDataForm";
import { ResourceData } from "@/types/resource";

interface EditResourceModalProps {
  resource: ResourceData;
  onSave: () => void;
  onCancel: () => void;
}

export const EditResourceModal = ({ resource, onSave, onCancel }: EditResourceModalProps) => {
  const [formData, setFormData] = useState({
    // HR Fields - mapped from ResourceData
    employeeId: resource.employee_id,
    fullName: resource.full_name,
    designation: resource.designation,
    department: resource.department,
    reportingManager: resource.reporting_manager || "",
    location: resource.location,
    joiningDate: resource.joining_date,
    employmentType: resource.employment_type || "FTE",
    experience: (resource.years_of_experience || resource.experience || 0).toString(),
    seniorityLevel: resource.seniority_level || resource.experience_level || "junior",
    
    // Resource Management Fields - Updated Skills Structure
    skillCategory: resource.skill_category || "General",
    primarySkills: resource.primary_skills || "",
    primarySkillsExperience: Math.floor((resource.years_of_experience || 0) * 0.8).toString(),
    secondarySkills: resource.secondary_skills || "",
    secondarySkillsExperience: Math.floor((resource.years_of_experience || 0) * 0.6).toString(),
    billableStatus: (resource.resource_type === 'billable').toString(),
    currentEngagement: resource.current_engagement || "",
    projectName: resource.project_name || "",
    engagementDescription: resource.engagement_description || "",
    engagementStartDate: resource.engagement_start_date || "",
    engagementEndDate: resource.engagement_end_date || "",
    agingInNonBillable: (resource.aging_in_non_billable || resource.bench_days || 0).toString(),
    currentBenchStatus: (resource.current_bench_status || resource.status === 'bench').toString(),
    engagementDetail: resource.engagement_detail || resource.engagement_description || "",
    
    // Intern Fields
    isIntern: (resource.resource_type === 'intern').toString(),
    internshipStartDate: resource.internship_start_date || "",
    internshipEndDate: resource.internship_end_date || "",
    assignedProject: resource.assigned_project || "",
    mentorName: resource.mentor_name || "",
    stipend: resource.stipend?.toString() || "",
    
    // Finance Fields
    monthlySalaryCost: (resource.monthly_salary_cost || resource.cost_rate || 0).toString(),
    billingRate: resource.billing_rate?.toString() || "",
    monthlyRevenueGenerated: (resource.monthly_revenue_generated || 0).toString(),
    costCenter: resource.cost_center || resource.department,
    totalYTDCost: (resource.total_ytd_cost || (resource.monthly_salary_cost || resource.cost_rate || 0) * 6).toString(),
    totalYTDRevenue: (resource.total_ytd_revenue || (resource.monthly_revenue_generated || 0) * 6).toString()
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Edit Resource Details - {resource.full_name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="hr" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hr">HR Data</TabsTrigger>
              <TabsTrigger value="resource">Resource Management</TabsTrigger>
              <TabsTrigger value="intern">Intern Details</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            <TabsContent value="hr" className="space-y-6">
              <HRDataForm formData={formData} handleInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="resource" className="space-y-6">
              <ResourceManagementForm formData={formData} handleInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="intern" className="space-y-6">
              <InternDataForm formData={formData} handleInputChange={handleInputChange} />
            </TabsContent>

            <TabsContent value="finance" className="space-y-6">
              <FinanceDataForm formData={formData} handleInputChange={handleInputChange} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
