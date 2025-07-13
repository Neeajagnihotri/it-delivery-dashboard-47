
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResourceManagementFormProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

const skillCategories = [
  "Frontend",
  "Backend", 
  "Full Stack",
  "QA",
  "DevOps",
  "Data Scientist",
  "HR",
  "Finance Analyst",
  "UI/UX",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Mobile Developer"
];

export const ResourceManagementForm = ({ formData, handleInputChange }: ResourceManagementFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management Section</CardTitle>
        <CardDescription>Skills and project allocation information</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillCategory">Skill Category</Label>
                <Select 
                  value={formData.skillCategory} 
                  onValueChange={(value) => handleInputChange("skillCategory", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="primarySkills">Primary Skills</Label>
                <Input
                  id="primarySkills"
                  placeholder="e.g., React, Node.js, Python"
                  value={formData.primarySkills}
                  onChange={(e) => handleInputChange("primarySkills", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="primarySkillsExperience">Relevant Experience in Primary Skills (Years)</Label>
                <Input
                  id="primarySkillsExperience"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 3.5"
                  value={formData.primarySkillsExperience}
                  onChange={(e) => handleInputChange("primarySkillsExperience", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondarySkills">Secondary Skills</Label>
                <Input
                  id="secondarySkills"
                  placeholder="e.g., Docker, AWS, MongoDB"
                  value={formData.secondarySkills}
                  onChange={(e) => handleInputChange("secondarySkills", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondarySkillsExperience">Relevant Experience in Secondary Skills (Years)</Label>
                <Input
                  id="secondarySkillsExperience"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2.0"
                  value={formData.secondarySkillsExperience}
                  onChange={(e) => handleInputChange("secondarySkillsExperience", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billableStatus">Billable Status</Label>
                <Select onValueChange={(value) => handleInputChange("billableStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billable status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentEngagement">Current Engagement</Label>
                <Select onValueChange={(value) => handleInputChange("currentEngagement", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engagement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Training">In Training</SelectItem>
                    <SelectItem value="Shadow">Shadow</SelectItem>
                    <SelectItem value="Internal Projects">Internal Projects</SelectItem>
                    <SelectItem value="PIP">PIP</SelectItem>
                    <SelectItem value="To Be Planned">To Be Planned</SelectItem>
                    <SelectItem value="Client Project">Client Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="projectName">Project Name (if any)</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="engagementDescription">Engagement Description</Label>
                <Input
                  id="engagementDescription"
                  value={formData.engagementDescription}
                  onChange={(e) => handleInputChange("engagementDescription", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="engagementStartDate">Engagement Start Date</Label>
                <Input
                  id="engagementStartDate"
                  type="date"
                  value={formData.engagementStartDate}
                  onChange={(e) => handleInputChange("engagementStartDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="engagementEndDate">Engagement End Date</Label>
                <Input
                  id="engagementEndDate"
                  type="date"
                  value={formData.engagementEndDate}
                  onChange={(e) => handleInputChange("engagementEndDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="agingInNonBillable">Aging in Non-Billable (Days)</Label>
                <Input
                  id="agingInNonBillable"
                  type="number"
                  value={formData.agingInNonBillable}
                  onChange={(e) => handleInputChange("agingInNonBillable", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentBenchStatus">Current Bench Status</Label>
                <Select onValueChange={(value) => handleInputChange("currentBenchStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bench status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="engagementDetail">Engagement Detail</Label>
                <Textarea
                  id="engagementDetail"
                  placeholder="Training Module, Project Name, etc."
                  value={formData.engagementDetail}
                  onChange={(e) => handleInputChange("engagementDetail", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
