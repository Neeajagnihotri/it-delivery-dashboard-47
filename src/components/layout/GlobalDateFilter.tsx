
import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalDateFilter } from "@/contexts/GlobalDateFilterContext";

export const GlobalDateFilter = () => {
  const { selectedPeriod, selectedOption, dateOptions, setSelectedPeriod } = useGlobalDateFilter();

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-black" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-48 justify-between text-black border-border">
            {selectedOption?.label}
            <ChevronDown className="h-4 w-4 text-black" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {dateOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={selectedPeriod === option.value ? "bg-accent" : ""}
            >
              <div className="flex flex-col">
                <span className="text-black">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {format(option.period.start, "MMM d")} - {format(option.period.end, "MMM d, yyyy")}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
