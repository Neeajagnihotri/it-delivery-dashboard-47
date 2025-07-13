
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InternDataFormProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

export const InternDataForm = ({ formData, handleInputChange }: InternDataFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intern Details Section</CardTitle>
        <CardDescription>Information specific to intern positions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internshipStartDate">Internship Start Date</Label>
                <Input
                  id="internshipStartDate"
                  type="date"
                  value={formData.internshipStartDate}
                  onChange={(e) => handleInputChange("internshipStartDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="internshipEndDate">Internship End Date</Label>
                <Input
                  id="internshipEndDate"
                  type="date"
                  value={formData.internshipEndDate}
                  onChange={(e) => handleInputChange("internshipEndDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="assignedProject">Assigned Project</Label>
                <Input
                  id="assignedProject"
                  value={formData.assignedProject}
                  onChange={(e) => handleInputChange("assignedProject", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mentorName">Mentor Name</Label>
                <Input
                  id="mentorName"
                  value={formData.mentorName}
                  onChange={(e) => handleInputChange("mentorName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stipend">Stipend ($)</Label>
                <Input
                  id="stipend"
                  type="number"
                  value={formData.stipend}
                  onChange={(e) => handleInputChange("stipend", e.target.value)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
