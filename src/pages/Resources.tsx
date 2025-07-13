import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Eye, Search, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { EditResourceModal } from "@/components/resources/EditResourceModal";
import { ResourceViewModal } from "@/components/resources/ResourceViewModal";
import { ResourceData } from "@/types/resource";

const Resources = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditingResource, setIsEditingResource] = useState<ResourceData | null>(null);
  const [isViewingResource, setIsViewingResource] = useState<ResourceData | null>(null);

  // Sample data with updated snake_case structure
  const resources: ResourceData[] = [
    {
      employee_id: "EMP001",
      first_name: "John",
      last_name: "Doe",
      full_name: "John Doe",
      email: "john.doe@company.com",
      designation: "Senior React Developer",
      department: "Engineering",
      location: "Bangalore",
      joining_date: "2023-01-15",
      status: "allocated",
      resource_type: "billable",
      experience_level: "senior",
      years_of_experience: 8,
      cost_rate: 12000,
      billing_rate: 150,
      utilization_percentage: 85,
      productivity_score: 85,
      bench_days: 0,
      primary_skills: "React.js, TypeScript, JavaScript",
      secondary_skills: "Node.js, GraphQL",
      
      // Legacy compatibility fields
      seniority_level: "Senior (6+ yrs)",
      skill_category: "Frontend",
      experience: 8,
      employment_type: "FTE",
      reporting_manager: "Jane Smith",
      current_engagement: "Client Project",
      project_name: "E-commerce Platform",
      engagement_description: "Frontend development for client",
      engagement_start_date: "2023-01-15",
      engagement_end_date: "2024-12-31",
      aging_in_non_billable: 0,
      current_bench_status: false,
      engagement_detail: "Working on client project - E-commerce Platform",
      is_intern: false,
      internship_start_date: undefined,
      internship_end_date: undefined,
      assigned_project: undefined,
      mentor_name: undefined,
      stipend: undefined,
      monthly_salary_cost: 12000,
      monthly_revenue_generated: 18000,
      cost_center: "Engineering",
      total_ytd_cost: 72000,
      total_ytd_revenue: 108000,
    },
    {
      employee_id: "EMP002",
      first_name: "Sarah",
      last_name: "Wilson",
      full_name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      designation: "QA Engineer",
      department: "Quality Assurance",
      location: "Hyderabad",
      joining_date: "2022-08-20",
      status: "bench",
      resource_type: "non_billable",
      experience_level: "senior",
      years_of_experience: 5,
      cost_rate: 8000,
      utilization_percentage: 0,
      productivity_score: 75,
      bench_days: 30,
      primary_skills: "Test Automation, Selenium, Cypress",
      secondary_skills: "Performance Testing, API Testing",
      
      // Legacy compatibility fields
      seniority_level: "Mid-Senior (3-6 yrs)",
      skill_category: "QA",
      experience: 5,
      employment_type: "FTE",
      reporting_manager: "Mike Johnson",
      current_engagement: "In Training",
      project_name: undefined,
      engagement_description: "Advanced QA Training Module",
      engagement_start_date: "2024-01-01",
      engagement_end_date: "2024-03-31",
      aging_in_non_billable: 30,
      current_bench_status: true,
      engagement_detail: "Currently in training - Advanced QA Module",
      is_intern: false,
      internship_start_date: undefined,
      internship_end_date: undefined,
      assigned_project: undefined,
      mentor_name: undefined,
      stipend: undefined,
      monthly_salary_cost: 8000,
      billing_rate: undefined,
      monthly_revenue_generated: 0,
      cost_center: "Quality Assurance",
      total_ytd_cost: 48000,
      total_ytd_revenue: 0,
    },
    {
      employee_id: "EMP003",
      first_name: "David",
      last_name: "Brown",
      full_name: "David Brown",
      email: "david.brown@company.com",
      designation: "DevOps Engineer",
      department: "DevOps",
      location: "Pune",
      joining_date: "2023-03-10",
      status: "allocated",
      resource_type: "billable",
      experience_level: "senior",
      years_of_experience: 4,
      cost_rate: 10000,
      billing_rate: 120,
      utilization_percentage: 90,
      productivity_score: 90,
      bench_days: 0,
      primary_skills: "Kubernetes, Docker, AWS",
      secondary_skills: "Terraform, Jenkins, Monitoring",
      
      // Legacy compatibility fields
      seniority_level: "Mid-Senior (3-6 yrs)",
      skill_category: "DevOps",
      experience: 4,
      employment_type: "FTE",
      reporting_manager: "Lisa Davis",
      current_engagement: "Client Project",
      project_name: "Infrastructure Setup",
      engagement_description: "Cloud infrastructure management",
      engagement_start_date: "2023-03-15",
      engagement_end_date: "2024-12-31",
      aging_in_non_billable: 0,
      current_bench_status: false,
      engagement_detail: "Managing cloud infrastructure for client project",
      is_intern: false,
      internship_start_date: undefined,
      internship_end_date: undefined,
      assigned_project: undefined,
      mentor_name: undefined,
      stipend: undefined,
      monthly_salary_cost: 10000,
      monthly_revenue_generated: 14400,
      cost_center: "DevOps",
      total_ytd_cost: 60000,
      total_ytd_revenue: 86400,
    },
    {
      employee_id: "EMP005",
      first_name: "Alex",
      last_name: "Johnson",
      full_name: "Alex Johnson",
      email: "alex.johnson@company.com",
      designation: "Data Scientist",
      department: "Data Science",
      location: "Mumbai",
      joining_date: "2022-11-01",
      status: "allocated",
      resource_type: "billable",
      experience_level: "senior",
      years_of_experience: 7,
      cost_rate: 15000,
      billing_rate: 180,
      utilization_percentage: 85,
      productivity_score: 90,
      bench_days: 0,
      primary_skills: "Python, Machine Learning, TensorFlow",
      secondary_skills: "SQL, Data Visualization, R",
      
      // Legacy compatibility fields
      seniority_level: "Senior (6+ yrs)",
      skill_category: "Data Scientist",
      experience: 7,
      employment_type: "FTE",
      reporting_manager: "Emily Chen",
      current_engagement: "Client Project",
      project_name: "AI/ML Analytics",
      engagement_description: "Machine learning model development",
      engagement_start_date: "2022-11-01",
      engagement_end_date: "2024-10-31",
      aging_in_non_billable: 0,
      current_bench_status: false,
      engagement_detail: "Working on AI/ML project for client",
      is_intern: false,
      internship_start_date: undefined,
      internship_end_date: undefined,
      assigned_project: undefined,
      mentor_name: undefined,
      stipend: undefined,
      monthly_salary_cost: 15000,
      monthly_revenue_generated: 21600,
      cost_center: "Data Science",
      total_ytd_cost: 90000,
      total_ytd_revenue: 129600,
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter;
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "billable" && resource.resource_type === "billable") ||
                         (statusFilter === "non-billable" && resource.resource_type === "non_billable") ||
                         (statusFilter === "intern" && resource.resource_type === "intern");
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (employee_id: string) => {
    const resource = resources.find(r => r.employee_id === employee_id);
    if (resource) {
      setIsEditingResource(resource);
    }
  };

  const handleView = (employee_id: string) => {
    const resource = resources.find(r => r.employee_id === employee_id);
    if (resource) {
      setIsViewingResource(resource);
    }
  };

  const handleSaveEdit = () => {
    // Save logic here - would update the resource in the backend
    console.log('Saving resource changes...');
    setIsEditingResource(null);
  };

  const handleCancelEdit = () => {
    setIsEditingResource(null);
  };

  const handleCloseView = () => {
    setIsViewingResource(null);
  };

  const handleExport = () => {
    console.log('Exporting resources...');
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Records ({filteredResources.length})</h1>
          <p className="text-gray-600">Manage and view all employee resources</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or designation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="billable">Billable</SelectItem>
                <SelectItem value="non-billable">Non-Billable</SelectItem>
                <SelectItem value="intern">Interns</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setDepartmentFilter("all");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Table with updated snake_case display */}
      <Tabs defaultValue="hr" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hr">HR Data Section</TabsTrigger>
          <TabsTrigger value="resource">Resource Management Section</TabsTrigger>
          <TabsTrigger value="intern">Intern Section</TabsTrigger>
          <TabsTrigger value="finance">Finance Section</TabsTrigger>
        </TabsList>

        <TabsContent value="resource">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Skill Category</TableHead>
                      <TableHead>Primary Skills</TableHead>
                      <TableHead>Primary Skills Exp.</TableHead>
                      <TableHead>Secondary Skills</TableHead>
                      <TableHead>Secondary Skills Exp.</TableHead>
                      <TableHead>Billable Status</TableHead>
                      <TableHead>Current Engagement</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.employee_id}>
                        <TableCell className="font-medium">{resource.employee_id}</TableCell>
                        <TableCell>{resource.full_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{resource.skill_category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={resource.primary_skills}>
                          {resource.primary_skills}
                        </TableCell>
                        <TableCell>{resource.years_of_experience} yrs</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={resource.secondary_skills}>
                          {resource.secondary_skills}
                        </TableCell>
                        <TableCell>{Math.floor(resource.years_of_experience * 0.6)} yrs</TableCell>
                        <TableCell>
                          <Badge variant={resource.resource_type === "billable" ? "default" : "secondary"}>
                            {resource.resource_type === "billable" ? "Billable" : "Non-Billable"}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.current_engagement}</TableCell>
                        <TableCell>{resource.project_name || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(resource.employee_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employee_id)}>
                              <Edit2 className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="hr">
          <Card>
            <CardHeader>
              <CardTitle>HR Data Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Seniority Level</TableHead>
                      <TableHead>Experience (Years)</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Employment Type</TableHead>
                      <TableHead>Reporting Manager</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.employee_id}>
                        <TableCell className="font-medium">{resource.employee_id}</TableCell>
                        <TableCell>{resource.full_name}</TableCell>
                        <TableCell>{resource.designation}</TableCell>
                        <TableCell>{resource.department}</TableCell>
                        <TableCell>{resource.seniority_level}</TableCell>
                        <TableCell>{resource.experience}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>{resource.joining_date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.employment_type}</Badge>
                        </TableCell>
                        <TableCell>{resource.reporting_manager}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(resource.employee_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employee_id)}>
                              <Edit2 className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="intern">
          <Card>
            <CardHeader>
              <CardTitle>Intern Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Is Intern</TableHead>
                      <TableHead>Internship Start Date</TableHead>
                      <TableHead>Internship End Date</TableHead>
                      <TableHead>Assigned Project</TableHead>
                      <TableHead>Mentor Name</TableHead>
                      <TableHead>Stipend</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.employee_id}>
                        <TableCell className="font-medium">{resource.employee_id}</TableCell>
                        <TableCell>{resource.full_name}</TableCell>
                        <TableCell>
                          <Badge variant={resource.is_intern ? "default" : "secondary"}>
                            {resource.is_intern ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.internship_start_date || "-"}</TableCell>
                        <TableCell>{resource.internship_end_date || "-"}</TableCell>
                        <TableCell>{resource.assigned_project || "-"}</TableCell>
                        <TableCell>{resource.mentor_name || "-"}</TableCell>
                        <TableCell>{resource.stipend ? `$${resource.stipend}` : "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(resource.employee_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employee_id)}>
                              <Edit2 className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Finance Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Monthly Salary Cost</TableHead>
                      <TableHead>Billing Rate</TableHead>
                      <TableHead>Monthly Revenue Generated</TableHead>
                      <TableHead>Cost Center</TableHead>
                      <TableHead>Total YTD Cost</TableHead>
                      <TableHead>Total YTD Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.employee_id}>
                        <TableCell className="font-medium">{resource.employee_id}</TableCell>
                        <TableCell>{resource.full_name}</TableCell>
                        <TableCell>{formatCurrency(resource.monthly_salary_cost || 0)}</TableCell>
                        <TableCell>{resource.billing_rate ? `$${resource.billing_rate}/hr` : "-"}</TableCell>
                        <TableCell>{formatCurrency(resource.monthly_revenue_generated || 0)}</TableCell>
                        <TableCell>{resource.cost_center}</TableCell>
                        <TableCell>{formatCurrency(resource.total_ytd_cost || 0)}</TableCell>
                        <TableCell>{formatCurrency(resource.total_ytd_revenue || 0)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(resource.employee_id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(resource.employee_id)}>
                              <Edit2 className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Edit Resource Modal */}
      {isEditingResource && (
        <EditResourceModal
          resource={isEditingResource}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* View Resource Modal */}
      {isViewingResource && (
        <ResourceViewModal
          resource={isViewingResource}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
};

export default Resources;
