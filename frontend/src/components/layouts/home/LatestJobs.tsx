"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  companyLogo: string;
  tags: string[];
}

export default function LatestJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await api.get("/jobs?sortBy=createdAt&sortOrder=desc&limit=8");
        if (response.data.success) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full py-20 bg-brand-light overflow-hidden px-6 md:px-[124px]">
        <div className="container mx-auto relative z-10">
          <div className="animate-pulse flex flex-col gap-12">
            <div className="h-12 bg-gray-200 w-1/3 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-white border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-20 bg-brand-light overflow-hidden px-6 md:px-[124px]">
      {/* Decorative Background Elements */}
      <div className="absolute right-0 top-20 w-[860px] h-[794px] pointer-events-none opacity-20">
        <div className="absolute w-[192px] h-[416px] left-[480px] top-[-298px] rotate-[64deg] border-4 border-[#CCCCF5] opacity-60"></div>
        <div className="absolute w-[319px] h-[778px] left-[681px] top-[220px] rotate-[64deg] border-4 border-[#CCCCF5]"></div>
        <div className="absolute w-[283px] h-[716px] left-[382px] top-[617px] rotate-[64deg] border-4 border-[#CCCCF5]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-semibold text-brand-dark">
            Latest <span className="text-secondary">jobs open</span>
          </h2>
          <Link href="/jobs" className="flex items-center gap-4 text-primary font-bold group">
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
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-white p-6 md:p-10 flex gap-6 items-start hover:shadow-xl transition-shadow cursor-pointer border border-transparent hover:border-brand-border"
            >
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={job.companyLogo || "/assets/logos/placeholder.png"}
                  alt={job.company}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-brand-dark leading-tight">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-brand-gray">
                  <span>{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-brand-gray/20 "></span>
                  <span>{job.location}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm font-semibold  ${
                        tag === "Full-Time" || tag === "FULL_TIME"
                          ? "bg-green-50 text-[#56CDAD]"
                          : tag === "Marketing"
                          ? "border border-[#FFB836] text-[#FFB836]"
                          : tag === "Design"
                          ? "border border-primary text-primary"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {tag.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

