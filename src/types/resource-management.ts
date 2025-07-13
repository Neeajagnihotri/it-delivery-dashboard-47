
export interface ReleaseResource {
  id: string;
  name: string;
  currentProject: string;
  releaseDate: string;
  role: string;
  experience: string;
  skillset: string[];
  utilizationPercentage: number;
  status: "confirmed" | "tentative" | "at-risk";
}
