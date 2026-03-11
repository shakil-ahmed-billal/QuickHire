export interface ICreateApplicationPayload {
  applicantName: string;
  applicantEmail: string;
  resumeUrl?: string;
  coverNote?: string;
  jobId: string;
}
