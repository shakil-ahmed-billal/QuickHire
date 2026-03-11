'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Job, JobCard } from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [type, setType] = useState(searchParams.get('type') || 'all');

  useEffect(() => {
    // Fetch categories for filter dropdown
    api.get('/categories').then(res => {
      if(res.data.success) {
        setCategories(res.data.data);
      }
    });
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if(search) queryParams.append('search', search);
      if(category && category !== 'all') queryParams.append('category', category);
      if(type && type !== 'all') queryParams.append('type', type);
      
      const res = await api.get(`/jobs?${queryParams.toString()}`);
      if(res.data.success) {
        setJobs(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, type, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if(search) params.set('search', search);
    else params.delete('search');
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 bg-muted/30 p-6  border">
        <h1 className="text-3xl font-bold mb-6">Find Your Next Job</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by title or company..." 
              className="pl-10 h-12 text-base bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={category} onValueChange={(val) => setCategory(val || 'all')}>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-background">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={(val) => setType(val || 'all')}>
              <SelectTrigger className="w-full md:w-[160px] h-12 bg-background">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" size="lg" className="h-12 w-full md:w-auto">
              Search
            </Button>
          </div>
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {loading ? 'Searching...' : `${meta.total} Jobs Found`}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-muted/20  border border-dashed">
          <h3 className="text-lg font-medium text-muted-foreground">No jobs found matching your criteria.</h3>
          <Button variant="link" onClick={() => { setSearch(''); setCategory('all'); setType('all'); }}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPageWrapper() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <JobsPage />
    </Suspense>
  );
}
