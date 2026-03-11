'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Loader2, Briefcase, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Application {
  id: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';
  createdAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    companyLogo: string | null;
    location: string;
    type: string;
  };
}

const statusMap = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  REVIEWED: { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Declined', color: 'bg-red-100 text-red-800' },
};

const typeMap = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
};

export default function UserApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/applications/my-applications')
        .then(res => {
          if (res.data.success) {
            setApplications(res.data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full py-20 px-6 md:px-[124px] bg-white min-h-screen">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-clash font-semibold text-brand-dark mb-4">
            My <span className="text-primary">Applications</span>
          </h1>
          <p className="text-lg text-brand-gray">
            Track the status of your submitted job applications.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-brand-border ">
            <Briefcase className="h-16 w-16 mx-auto text-brand-gray/30 mb-6" />
            <h3 className="text-2xl font-semibold text-brand-dark mb-2">No applications yet</h3>
            <p className="text-brand-gray mb-8">Start applying for jobs to see them here.</p>
            <Link href="/jobs">
              <Button size="lg" className="px-10 h-14 text-lg font-bold">Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="p-6 md:p-8 border border-brand-border bg-white flex flex-col md:flex-row items-center gap-6 md:gap-8 group hover:border-primary/50 transition-all hover:shadow-[0px_48px_80px_rgba(192,192,192,0.1)]">
                {/* Company Logo */}
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-brand-light flex items-center justify-center border border-brand-border relative overflow-hidden">
                  {app.job.companyLogo ? (
                    <Image src={app.job.companyLogo} alt={app.job.company} fill className="object-contain p-2" />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-primary">{app.job.company.charAt(0)}</span>
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-grow space-y-3 w-full text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-clash font-semibold text-brand-dark group-hover:text-primary transition-colors">
                    {app.job.title}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-base md:text-lg text-brand-gray">
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                      {app.job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                      {app.job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 md:h-5 md:w-5" />
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1">
                     <Badge variant="outline" className="px-3 py-0.5 text-sm md:text-base">{typeMap[app.job.type as keyof typeof typeMap] || app.job.type}</Badge>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0 flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                  <div className={`px-5 py-1.5 font-bold text-base md:text-lg border-2 ${statusMap[app.status].color.split(' ')[0]} ${statusMap[app.status].color.split(' ')[1]} border-current`}>
                    {statusMap[app.status].label}
                  </div>
                  <Link href={`/jobs/${app.job.id}`} className="w-full md:w-auto">
                    <Button variant="outline" className="h-11 md:h-12 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white px-6 w-full">View Job</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
