export interface Team {
  id: string;
  name: string;
  submitted: boolean;
  submitted_at: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
}

export interface Submission {
  id: string;
  team_id: string;
  q1_ip: string | null;
  q2_funding: string | null;
  q3_partnership: string | null;
  q4_market: string | null;
  q5_product: string | null;
  slides_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamWithMembers extends Team {
  team_members: TeamMember[];
}

export interface TeamWithMembersAndSubmission extends TeamWithMembers {
  submissions: Submission[];
}

export interface QuestionOption {
  key: string;
  label: string;
}

export interface QuestionDef {
  id: string;
  dbColumn: string;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface DivergentPairResult {
  team1: TeamWithMembersAndSubmission;
  team2: TeamWithMembersAndSubmission;
  distance: number;
  maxDistance: number;
  breakdown: {
    q1_ip: number;
    q2_funding: number;
    q3_partnership: number;
    q4_market: number;
    q5_product: number;
  };
}
