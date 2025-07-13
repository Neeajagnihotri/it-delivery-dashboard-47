
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ResourceAnalyticsCard } from "@/components/dashboard/ResourceAnalyticsCard";
import { InternsSection } from "@/components/dashboard/InternsSection";
import { FinancialSummaryCard } from "@/components/dashboard/FinancialSummaryCard";
import { TrendingUp, DollarSign, GraduationCap, Database, UserMinus } from "lucide-react";
import { ResignationList } from "./ResignationList";

interface ResourceTabsProps {
  seniorityData: any[];
  skillData: any[];
  agingData: any[];
  engagementData: any[];
  internsData: any[];
  monthlyFinancialData: any[];
  ytdTotals: any;
}

export const ResourceTabs = ({
  seniorityData,
  skillData,
  agingData,
  engagementData,
  internsData,
  monthlyFinancialData,
  ytdTotals
}: ResourceTabsProps) => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Resource Analytics
        </TabsTrigger>
        <TabsTrigger value="interns" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Interns Management
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financial View
        </TabsTrigger>
        <TabsTrigger value="resignations" className="flex items-center gap-2">
          <UserMinus className="h-4 w-4" />
          Resignations
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          All Resources
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="space-y-6">
        <ResourceAnalyticsCard
          seniorityData={seniorityData}
          skillData={skillData}
          agingData={agingData}
          engagementData={engagementData}
        />
      </TabsContent>

      <TabsContent value="interns" className="space-y-6">
        <InternsSection 
          interns={internsData} 
          totalStipendCost={internsData.reduce((sum, intern) => sum + intern.stipend, 0)}
        />
      </TabsContent>

      <TabsContent value="financial" className="space-y-6">
        <FinancialSummaryCard
          monthlyData={monthlyFinancialData}
          ytdTotals={ytdTotals}
        />
      </TabsContent>

      <TabsContent value="resignations" className="space-y-6">
        <ResignationList resignations={[]} />
      </TabsContent>

      <TabsContent value="resources" className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">All Resources</h3>
            <Link to="/resources">
              <Button>
                <Database className="h-4 w-4 mr-2" />
                View Detailed Resources
              </Button>
            </Link>
          </div>
          <p className="text-gray-600">
            Access the complete resource database with advanced filtering, search, and management capabilities.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
