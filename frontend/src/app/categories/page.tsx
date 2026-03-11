'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  _count: {
    jobPosts: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Design":
        return <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
      case "Sales":
        return (
          <>
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </>
        );
      case "Marketing":
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case "Finance":
        return (
          <>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </>
        );
      case "Technology":
        return (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </>
        );
      case "Engineering":
        return <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />;
      case "Business":
        return (
          <>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </>
        );
      case "Human Resource":
        return (
          <>
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full py-20 px-6 md:px-[124px] bg-white min-h-screen">
      <div className="container mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-clash font-semibold text-brand-dark mb-4">
            Browse by <span className="text-secondary">category</span>
          </h1>
          <p className="text-lg text-brand-gray max-w-2xl">
            Explore opportunities across all our supported industries and professions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.slug}`}
                className="p-8 border border-brand-border transition-all cursor-pointer group flex flex-col items-start gap-8 bg-white hover:border-primary/50 hover:shadow-[0px_48px_80px_rgba(192,192,192,0.1)]"
              >
                <div className="w-12 h-12 flex items-center justify-center shrink-0 text-primary">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    {getIcon(category.icon)}
                  </svg>
                </div>

                <div className="space-y-4 w-full">
                  <h3 className="text-2xl font-clash font-semibold text-brand-dark group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex justify-between items-center group/item text-lg">
                    <span className="text-brand-gray">
                      {category._count.jobPosts} jobs available
                    </span>
                    <svg
                      className="w-6 h-6 transform group-hover/item:translate-x-1 transition-transform text-brand-dark"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
