
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinanceDataFormProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

export const FinanceDataForm = ({ formData, handleInputChange }: FinanceDataFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Section</CardTitle>
        <CardDescription>Financial information and cost management</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlySalaryCost">Monthly Salary Cost ($) *</Label>
                <Input
                  id="monthlySalaryCost"
                  type="number"
                  value={formData.monthlySalaryCost}
                  onChange={(e) => handleInputChange("monthlySalaryCost", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="billingRate">Billing Rate ($/hour)</Label>
                <Input
                  id="billingRate"
                  type="number"
                  value={formData.billingRate}
                  onChange={(e) => handleInputChange("billingRate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyRevenueGenerated">Monthly Revenue Generated ($)</Label>
                <Input
                  id="monthlyRevenueGenerated"
                  type="number"
                  value={formData.monthlyRevenueGenerated}
                  onChange={(e) => handleInputChange("monthlyRevenueGenerated", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="costCenter">Cost Center *</Label>
                <Input
                  id="costCenter"
                  value={formData.costCenter}
                  onChange={(e) => handleInputChange("costCenter", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalYTDCost">Total YTD Cost ($)</Label>
                <Input
                  id="totalYTDCost"
                  type="number"
                  value={formData.totalYTDCost}
                  onChange={(e) => handleInputChange("totalYTDCost", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="totalYTDRevenue">Total YTD Revenue ($)</Label>
                <Input
                  id="totalYTDRevenue"
                  type="number"
                  value={formData.totalYTDRevenue}
                  onChange={(e) => handleInputChange("totalYTDRevenue", e.target.value)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
