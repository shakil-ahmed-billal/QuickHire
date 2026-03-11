'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NextImage from 'next/image';
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
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get('/applications/my-applications').catch(() => ({ data: { success: false } }))
        ]);

        if (jobRes.data.success) {
          setJob(jobRes.data.data);
        }

        if (appsRes.data.success) {
          const applied = appsRes.data.data.some((app: any) => app.job.id === id);
          setHasApplied(applied);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      <div className="bg-background border-b px-6 md:px-[124px]">
        <div className="container mx-auto py-8">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-white flex items-center justify-center font-bold text-3xl text-muted-foreground border shadow-sm relative overflow-hidden">
                {job.companyLogo ? (
                  <NextImage 
                    src={job.companyLogo} 
                    alt={job.company} 
                    fill 
                    className="object-contain p-3"
                  />
                ) : (
                  job.company.charAt(0)
                )}
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-clash font-semibold text-brand-dark">{job.title}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-lg md:text-xl text-brand-gray">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    {job.location}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <Badge variant="secondary" className="px-4 py-1 text-base">{typeMap[job.type]}</Badge>
                  <Badge variant="outline" className="px-4 py-1 text-base">{job.category.name}</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-w-[200px] w-full xl:w-auto">
               <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <Button 
                  size="lg" 
                  className={`w-full text-xl h-14 md:h-16 shadow-lg shadow-primary/20 ${hasApplied ? 'bg-green-600 hover:bg-green-600' : ''}`} 
                  onClick={() => !hasApplied && setIsApplyOpen(true)}
                  disabled={hasApplied}
                >
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </Button>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Apply for {job.title}</DialogTitle>
                    <DialogDescription className="text-lg">
                      Submit your application to {job.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <ApplyForm 
                    jobId={job.id} 
                    onSuccess={() => {
                      setIsApplyOpen(false);
                      setHasApplied(true);
                    }} 
                    onCancel={() => setIsApplyOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              <div className="flex items-center justify-center gap-2 text-brand-gray">
                <Clock className="h-5 w-5" />
                <span>Posted {timeDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-[124px] py-12">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-clash font-semibold text-brand-dark mb-6">Job Description</h2>
              <div className="prose prose-base md:prose-lg prose-gray max-w-none text-brand-gray whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </section>

            {job.requirements && (
              <section>
                <h2 className="text-2xl md:text-3xl font-clash font-semibold text-brand-dark mb-6">Requirements</h2>
                <div className="prose prose-base md:prose-lg prose-gray max-w-none text-brand-gray whitespace-pre-wrap leading-relaxed">
                  {job.requirements}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-8 border border-brand-border bg-white shadow-sm flex flex-col gap-8">
              <h3 className="text-2xl font-clash font-semibold text-brand-dark border-b border-brand-border pb-4">Job Overview</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-brand-dark">Location</p>
                    <p className="text-brand-gray">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-brand-dark">Job Type</p>
                    <p className="text-brand-gray">{typeMap[job.type]}</p>
                  </div>
                </div>
                {job.salary && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-lg text-brand-dark">Salary</p>
                      <p className="text-brand-gray">{job.salary}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-brand-dark">Date Posted</p>
                    <p className="text-brand-gray">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
