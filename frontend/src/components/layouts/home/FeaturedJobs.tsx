"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

interface Job {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  location: string;
  type: string;
  description: string;
  tags: string[];
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.get("/jobs?isFeatured=true&limit=8");
        if (response.data.success) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 px-6 md:px-[124px] bg-white">
        <div className="container mx-auto">
          <div className="animate-pulse flex flex-col gap-12">
            <div className="h-12 bg-gray-200 w-1/3 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-6 md:px-[124px] bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-clash font-semibold text-brand-dark text-center md:text-left">
            Featured <span className="text-secondary">jobs</span>
          </h2>
          <div className="flex items-center gap-4 text-primary font-bold cursor-pointer group">
            <span>Show all jobs</span>
            <svg
              className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="p-8 border border-brand-border hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-6 group hover:shadow-[0px_48px_80px_rgba(192,192,192,0.1)]"
            >
              <div className="flex justify-between items-start">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Image
                    src={job.companyLogo || "/assets/logos/placeholder.png"}
                    alt={job.company}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="px-3 py-1 border border-primary text-primary text-sm font-medium">
                  {job.type.replace("_", " ")}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-brand-dark leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-brand-gray text-sm">
                  <span>{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-brand-gray/20 "></span>
                  <span>{job.location}</span>
                </div>
              </div>

              <p className="text-brand-gray line-clamp-2 text-sm">
                {job.description}
              </p>

              <div className="flex gap-2 flex-wrap mt-auto">
                {job.tags.map((tag, tIndex) => (
                  <span
                    key={tIndex}
                    className={`px-3 py-1  text-xs font-semibold ${
                      tag === "Marketing"
                        ? "bg-orange-50 text-orange-500"
                        : tag === "Design"
                          ? "bg-green-50 text-green-500"
                          : "bg-purple-50 text-purple-500"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

