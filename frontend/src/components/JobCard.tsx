import Link from 'next/link';
import { Building2, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'INTERNSHIP' | 'CONTRACT';
  salary?: string;
  description?: string;
  requirements?: string;
  createdAt: string;
  category: { name: string; slug: string };
  _count?: { applications: number };
}

const typeMap = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
};

const badgeColors = {
  FULL_TIME: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  PART_TIME: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  REMOTE: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
  INTERNSHIP: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  CONTRACT: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
};

export function JobCard({ job }: { job: Job }) {
  // Format dates: "2 days ago" etc.
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24));
  const timeDisplay = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;

  return (
    <Card className="group hover:border-primary/50 transition-all hover:shadow-md flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12  bg-muted flex items-center justify-center font-bold text-xl text-muted-foreground border">
            {job.company.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              <Link href={`/jobs/${job.id}`}>
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" /> {job.company}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 mt-2 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className={badgeColors[job.type]}>
            {typeMap[job.type]}
          </Badge>
          <Badge variant="outline" className="bg-muted/50">
            {job.category.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{timeDisplay}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5 col-span-2">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 justify-between items-center border-t mt-4 border-muted/50 p-4">
        {typeof job._count?.applications === 'number' && (
          <span className="text-xs text-muted-foreground font-medium">
            {job._count.applications} applicants
          </span>
        )}
        <Link href={`/jobs/${job.id}`} className="ml-auto block">
          <Button size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
