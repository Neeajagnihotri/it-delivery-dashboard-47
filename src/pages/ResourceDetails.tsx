
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { ResourceData } from "@/types/resource";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { EditResourceModal } from "@/components/resources/EditResourceModal";

const ResourceDetails = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleData: ResourceData[] = [
      {
        id: 1,
        employee_id: "EMP001",
        first_name: "John",
        last_name: "Smith",
        full_name: "John Smith",
        email: "john.smith@company.com",
        designation: "Senior Developer",
        department: "Engineering",
        location: "New York",
        joining_date: "2019-03-15",
        status: type === "billable" ? "allocated" : "bench",
        resource_type: type === "billable" ? "billable" : type === "interns" ? "intern" : "non_billable",
        experience_level: "senior",
        years_of_experience: 8,
        cost_rate: type === "interns" ? 2500 : 12000,
        billing_rate: type === "billable" ? 150 : undefined,
        utilization_percentage: type === "billable" ? 85 : 0,
        productivity_score: 85,
        bench_days: type === "billable" ? 0 : 45,
        primary_skills: "React.js, TypeScript, JavaScript",
        secondary_skills: "Node.js, GraphQL",
        
        // Legacy compatibility fields
        seniority_level: "Senior (6+ yrs)",
        skill_category: "Full Stack",
        experience: 8,
        employment_type: "FTE",
        reporting_manager: "Jane Doe",
        current_engagement: type === "billable" ? "Client Project" : "In Training",
        project_name: type === "billable" ? "E-commerce Platform" : undefined,
        engagement_description: type === "billable" ? "Frontend development for client" : "React Advanced Training",
        engagement_start_date: "2025-01-01",
        engagement_end_date: type === "billable" ? "2025-12-31" : "2025-07-30",
        aging_in_non_billable: type === "billable" ? 0 : 45,
        current_bench_status: type !== "billable",
        engagement_detail: type === "billable" ? "Lead Frontend Developer" : "Advanced React Training Module",
        is_intern: type === "interns",
        internship_start_date: type === "interns" ? "2025-06-01" : undefined,
        internship_end_date: type === "interns" ? "2025-08-31" : undefined,
        assigned_project: type === "interns" ? "Dashboard Redesign" : undefined,
        mentor_name: type === "interns" ? "Sarah Wilson" : undefined,
        stipend: type === "interns" ? 2500 : undefined,
        monthly_salary_cost: type === "interns" ? 2500 : 12000,
        monthly_revenue_generated: type === "billable" ? 18000 : 0,
        cost_center: "Engineering",
        total_ytd_cost: type === "interns" ? 15000 : 72000,
        total_ytd_revenue: type === "billable" ? 108000 : 0,
        created_at: "2019-03-15T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z"
      },
      // Add more sample data...
    ];

    // Filter based on type
    let filteredData = sampleData;
    if (type === "billable") {
      filteredData = sampleData.filter(r => r.resource_type === 'billable');
    } else if (type === "non-billable") {
      filteredData = sampleData.filter(r => r.resource_type === 'non_billable');
    } else if (type === "interns") {
      filteredData = sampleData.filter(r => r.resource_type === 'intern');
    }

    setResources(filteredData);
  }, [type]);

  const getTypeTitle = () => {
    switch (type) {
      case "billable": return "Billable Resources";
      case "non-billable": return "Non-Billable Resources";
      case "interns": return "Intern Resources";
      default: return "All Resources";
    }
  };

  const handleEdit = (resource: ResourceData) => {
    setSelectedResource(resource);
    setIsEditing(true);
  };

  const handleView = (resource: ResourceData) => {
    navigate(`/resource-view/${resource.employee_id}`);
  };

  const handleSave = () => {
    // Save logic here
    toast({
      title: "Success",
      description: "Resource details updated successfully",
    });
    setIsEditing(false);
    setSelectedResource(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedResource(null);
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTypeTitle()}</h1>
          <p className="text-gray-600">Detailed view and management of {type} resources</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <X className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <ResourceTable 
        resources={resources} 
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Edit Resource Modal */}
      {isEditing && selectedResource && (
        <EditResourceModal
          resource={selectedResource}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ResourceDetails;
