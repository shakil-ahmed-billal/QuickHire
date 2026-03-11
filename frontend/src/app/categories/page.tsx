'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{name: string, slug: string, icon: string | null}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        if(res.data.success) {
          setCategories(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Job Categories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore opportunities across all our supported industries and professions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/jobs?category=${category.slug}`}>
              <div className="group relative overflow-hidden  border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center  bg-primary/10 text-2xl group-hover:scale-110 transition-transform">
                    {category.icon || '📁'}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-primary group-hover:underline">View Jobs</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
