import Image from "next/image";

export default function FeaturedJobs() {
  const jobs = [
    {
      company: "Revolut",
      logo: "/assets/logos/revolut.png",
      title: "Email Marketing",
      location: "Madrid, Spain",
      type: "Full Time",
      description: "Revolut is looking for Email Marketing to help team ma ...",
      tags: ["Marketing", "Design"],
    },
    {
      company: "Dropbox",
      logo: "/assets/logos/dropbox.png",
      title: "Brand Designer",
      location: "San Fransisco, US",
      type: "Full Time",
      description:
        "Dropbox is looking for Brand Designer to help the team t ...",
      tags: ["Design", "Business"],
    },
    {
      company: "Pitch",
      logo: "/assets/logos/pitch.png",
      title: "Email Marketing",
      location: "Berlin, Germany",
      type: "Full Time",
      description:
        "Pitch is looking for Customer Manager to join marketing t ...",
      tags: ["Marketing"],
    },
    {
      company: "Blinkist",
      logo: "/assets/logos/blinkist.png",
      title: "Visual Designer",
      location: "Granada, Spain",
      type: "Full Time",
      description:
        "Blinkist is looking for Visual Designer to help team desi ...",
      tags: ["Design"],
    },
    {
      company: "ClassPass",
      logo: "/assets/logos/classpass.png",
      title: "Product Designer",
      location: "Manchester, UK",
      type: "Full Time",
      description: "ClassPass is looking for Product Designer to help us...",
      tags: ["Marketing", "Design"],
    },
    {
      company: "Canva",
      logo: "/assets/logos/canva.png",
      title: "Lead Designer",
      location: "Ontario, Canada",
      type: "Full Time",
      description: "Canva is looking for Lead Engineer to help develop n ...",
      tags: ["Design", "Business"],
    },
    {
      company: "GoDaddy",
      logo: "/assets/logos/godaddy.png",
      title: "Brand Designer",
      location: "San Fransisco, US",
      type: "Full Time",
      description: "GoDaddy is looking for Brand Designer to help us...",
      tags: ["Design"],
    },
    {
      company: "Twitter",
      logo: "/assets/logos/twitter.png",
      title: "Frontend Developer",
      location: "San Fransisco, US",
      type: "Full Time",
      description: "Twitter is looking for Frontend Developer to help us...",
      tags: ["Design", "Engineering"],
    },
  ];

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
          {jobs.map((job, index) => (
            <div
              key={index}
              className="p-8 border border-brand-border hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-6 group hover:shadow-[0px_48px_80px_rgba(192,192,192,0.1)]"
            >
              <div className="flex justify-between items-start">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Image
                    src={job.logo}
                    alt={job.company}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="px-3 py-1 border border-primary text-primary text-sm font-medium">
                  {job.type}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-brand-dark leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-brand-gray text-sm">
                  <span>{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-brand-gray/20 rounded-full"></span>
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
