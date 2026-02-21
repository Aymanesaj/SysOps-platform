export type DashboardSession = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
};

export type DashboardAssignment = {
  id: string;
  title: string;
  deadline: string;
  templateRepoUrl: string;
  instructions: string;
  isActive: boolean;
  sessionId: string;
};
