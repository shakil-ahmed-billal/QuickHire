export interface ICreateApplicationPayload {
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl?: string;
  coverNote?: string;
  jobId: string;
}
