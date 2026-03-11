export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'JOB_SEEKER';
  adminSecret?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
