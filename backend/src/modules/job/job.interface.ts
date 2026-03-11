export interface ICreateJobPayload {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type?: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'INTERNSHIP' | 'CONTRACT';
  salary?: string;
  description: string;
  requirements?: string;
  tags?: string[];
  isFeatured?: boolean;
  deadline?: string;
  categoryId: string;
}

export interface IJobQueryParams {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  isFeatured?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
