'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Job, JobCard } from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, MapPin } from 'lucide-react';
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
    // Sync states with URL params when they change (e.g. navigating from home)
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'all');
    setType(searchParams.get('type') || 'all');
  }, [searchParams]);

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
    <div className="w-full py-20 px-6 md:px-[124px] bg-white min-h-screen">
      <div className="container mx-auto">
        <div className="mb-16">
          <div className="max-w-2xl mb-10">
            <h1 className="text-4xl md:text-6xl font-clash font-semibold text-brand-dark mb-6">
              Find Your <span className="text-secondary text-primary">dream job</span>
            </h1>
            <p className="text-lg text-brand-gray">
              Browse through thousands of job openings from top companies and find the perfect match for your career.
            </p>
          </div>
          
          <div className="bg-white border border-brand-border p-3 md:p-4 shadow-[0px_24px_48px_rgba(0,0,0,0.04)]">
            <form onSubmit={handleSearch} className="flex flex-col xl:flex-row items-stretch xl:items-center xl:divide-x divide-brand-border gap-4 xl:gap-0">
              {/* Search Title */}
              <div className="relative flex-[1.5] w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                <Input 
                  placeholder="Job title or keyword" 
                  className="pl-16 h-16 md:h-20 text-xl border-none focus-visible:ring-0 rounded-none font-medium placeholder:text-brand-gray/60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative flex-1 w-full flex items-center group border-t xl:border-t-0 border-brand-border">
                <div className="absolute left-6 z-10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <Select value={category} onValueChange={(val) => setCategory(val || 'all')}>
                  <SelectTrigger className="pl-16 h-16 md:h-20 text-xl border-none focus:ring-0 rounded-none font-medium text-brand-dark">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Filter */}
              <div className="relative flex-1 w-full border-t xl:border-t-0 border-brand-border">
                <Select value={type} onValueChange={(val) => setType(val || 'all')}>
                  <SelectTrigger className="px-6 h-16 md:h-20 text-xl border-none focus:ring-0 rounded-none font-medium text-brand-dark">
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
              </div>

              {/* Search Button */}
              <div className="w-full xl:w-auto p-1 border-t xl:border-t-0 border-brand-border">
                <Button type="submit" size="lg" className="h-16 md:h-20 w-full xl:px-12 text-xl font-bold rounded-none shadow-lg shadow-primary/20">
                  Search
                </Button>
              </div>
            </form>
          </div>
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
