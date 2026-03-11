'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Calendar, Briefcase } from 'lucide-react';
import api from '@/lib/axios';
import { Job } from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ApplyForm } from '@/components/ApplyForm';

const typeMap = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    api.get(`/jobs/${id}`)
      .then(res => {
        if(res.data.success) {
          setJob(res.data.data);
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load job details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full " />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">{error || "The job you're looking for doesn't exist or has been removed."}</p>
        <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const daysAgo = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24));
  const timeDisplay = daysAgo === 0 ? 'Today' : `${daysAgo} days ago`;

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20  bg-muted flex items-center justify-center font-bold text-3xl text-muted-foreground border shadow-sm">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-xl text-muted-foreground mb-4">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{typeMap[job.type]}</Badge>
                  <Badge variant="outline">{job.category.name}</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
               <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <Button size="lg" className="w-full text-lg h-12 shadow-md" onClick={() => setIsApplyOpen(true)}>
                  Apply Now
                </Button>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application to {job.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <ApplyForm 
                    jobId={job.id} 
                    onSuccess={() => setIsApplyOpen(false)} 
                    onCancel={() => setIsApplyOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              <p className="text-sm text-center text-muted-foreground">
                Posted {timeDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </section>

          {job.requirements && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.requirements}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className=" border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Job Overview</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-muted-foreground text-sm">{job.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Job Type</p>
                  <p className="text-muted-foreground text-sm">{typeMap[job.type]}</p>
                </div>
              </div>
              {job.salary && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Salary</p>
                    <p className="text-muted-foreground text-sm">{job.salary}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Date Posted</p>
                  <p className="text-muted-foreground text-sm">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
