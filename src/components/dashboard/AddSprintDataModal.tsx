
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface SprintData {
  sprintNumber: number;
  developmentMetrics: {
    velocity: number;
    burndownRate: number;
    codeQuality: number;
  };
  qaMetrics: {
    defectRate: number;
    testCoverage: number;
    automationRate: number;
  };
}

interface AddSprintDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const AddSprintDataModal = ({ isOpen, onClose, projectName }: AddSprintDataModalProps) => {
  const { toast } = useToast();
  const [sprintData, setSprintData] = useState<SprintData[]>([
    {
      sprintNumber: 1,
      developmentMetrics: { velocity: 25, burndownRate: 85, codeQuality: 92 },
      qaMetrics: { defectRate: 3, testCoverage: 78, automationRate: 65 }
    }
  ]);

  const handleSubmit = () => {
    toast({
      title: "Sprint Data Added",
      description: "Sprint data has been successfully added to the project.",
    });
    onClose();
  };

  const addSprintData = () => {
    const newSprint: SprintData = {
      sprintNumber: sprintData.length + 1,
      developmentMetrics: { velocity: 0, burndownRate: 0, codeQuality: 0 },
      qaMetrics: { defectRate: 0, testCoverage: 0, automationRate: 0 }
    };
    setSprintData([...sprintData, newSprint]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Sprint Data - {projectName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sprint Data</h3>
            <Button onClick={addSprintData} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Sprint
            </Button>
          </div>
          
          <div className="space-y-4">
            {sprintData.map((sprint, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Sprint {sprint.sprintNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Development Metrics</h4>
                      <div className="space-y-2">
                        <div>
                          <Label>Velocity</Label>
                          <Input
                            type="number"
                            value={sprint.developmentMetrics.velocity}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].developmentMetrics.velocity = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Burndown Rate (%)</Label>
                          <Input
                            type="number"
                            value={sprint.developmentMetrics.burndownRate}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].developmentMetrics.burndownRate = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Code Quality (%)</Label>
                          <Input
                            type="number"
                            value={sprint.developmentMetrics.codeQuality}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].developmentMetrics.codeQuality = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">QA Metrics</h4>
                      <div className="space-y-2">
                        <div>
                          <Label>Defect Rate</Label>
                          <Input
                            type="number"
                            value={sprint.qaMetrics.defectRate}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].qaMetrics.defectRate = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Test Coverage (%)</Label>
                          <Input
                            type="number"
                            value={sprint.qaMetrics.testCoverage}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].qaMetrics.testCoverage = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Automation Rate (%)</Label>
                          <Input
                            type="number"
                            value={sprint.qaMetrics.automationRate}
                            onChange={(e) => {
                              const newSprintData = [...sprintData];
                              newSprintData[index].qaMetrics.automationRate = parseInt(e.target.value);
                              setSprintData(newSprintData);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Sprint Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
