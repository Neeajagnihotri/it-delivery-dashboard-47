
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

interface DeliveryMetricsTabProps {
  formData: any;
  setFormData: (data: any) => void;
  onEditSprintDetails: () => void;
}

export const DeliveryMetricsTab = ({ formData, setFormData, onEditSprintDetails }: DeliveryMetricsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onEditSprintDetails}
        >
          <Users className="h-4 w-4" />
          Edit Sprint Details
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sprintVelocity">Sprint Velocity</Label>
          <Input
            id="sprintVelocity"
            type="number"
            value={formData.sprintVelocity}
            onChange={(e) => setFormData({...formData, sprintVelocity: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="predictability">Predictability (%)</Label>
          <Input
            id="predictability"
            type="number"
            min="0"
            max="100"
            value={formData.predictability}
            onChange={(e) => setFormData({...formData, predictability: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="defectLeakage">Defect Leakage</Label>
          <Input
            id="defectLeakage"
            type="number"
            value={formData.defectLeakage}
            onChange={(e) => setFormData({...formData, defectLeakage: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="onTimeDelivery">On-Time Delivery (%)</Label>
          <Input
            id="onTimeDelivery"
            type="number"
            min="0"
            max="100"
            value={formData.onTimeDelivery}
            onChange={(e) => setFormData({...formData, onTimeDelivery: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="currentSprint">Current Sprint</Label>
          <Input
            id="currentSprint"
            value={formData.currentSprint}
            onChange={(e) => setFormData({...formData, currentSprint: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="sprintProgress">Sprint Progress (%)</Label>
          <Input
            id="sprintProgress"
            type="number"
            min="0"
            max="100"
            value={formData.sprintProgress}
            onChange={(e) => setFormData({...formData, sprintProgress: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="burndownRate">Burndown Rate</Label>
          <Select value={formData.burndownRate} onValueChange={(value) => setFormData({...formData, burndownRate: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="Behind">Behind</SelectItem>
              <SelectItem value="Ahead">Ahead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="storyPointsComplete">Story Points Complete</Label>
          <Input
            id="storyPointsComplete"
            type="number"
            value={formData.storyPointsComplete}
            onChange={(e) => setFormData({...formData, storyPointsComplete: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="storyPointsTotal">Total Story Points</Label>
          <Input
            id="storyPointsTotal"
            type="number"
            value={formData.storyPointsTotal}
            onChange={(e) => setFormData({...formData, storyPointsTotal: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="qualityScore">Quality Score</Label>
          <Input
            id="qualityScore"
            type="number"
            step="0.1"
            value={formData.qualityScore}
            onChange={(e) => setFormData({...formData, qualityScore: parseFloat(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="customerSatisfaction">Customer Satisfaction (%)</Label>
          <Input
            id="customerSatisfaction"
            type="number"
            min="0"
            max="100"
            value={formData.customerSatisfaction}
            onChange={(e) => setFormData({...formData, customerSatisfaction: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="featureCompletionRate">Feature Completion Rate (%)</Label>
          <Input
            id="featureCompletionRate"
            type="number"
            min="0"
            max="100"
            value={formData.featureCompletionRate}
            onChange={(e) => setFormData({...formData, featureCompletionRate: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="velocityTrend">Velocity Trend</Label>
          <Select value={formData.velocityTrend} onValueChange={(value) => setFormData({...formData, velocityTrend: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Improving">Improving</SelectItem>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Declining">Declining</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
