export default function CategorySection() {
  const categories = [
    {
      name: "Design",
      jobs: 235,
      icon: (
        <>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </>
      ),
      active: false,
    },
    {
      name: "Sales",
      jobs: 756,
      icon: (
        <>
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </>
      ),
      active: false,
    },
    {
      name: "Marketing",
      jobs: 140,
      icon: (
        <>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </>
      ),
      active: true,
    },
    {
      name: "Finance",
      jobs: 325,
      icon: (
        <>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </>
      ),
      active: false,
    },
    {
      name: "Technology",
      jobs: 436,
      icon: (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </>
      ),
      active: false,
    },
    {
      name: "Engineering",
      jobs: 542,
      icon: (
        <>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </>
      ),
      active: false,
    },
    {
      name: "Business",
      jobs: 211,
      icon: (
        <>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </>
      ),
      active: false,
    },
    {
      name: "Human Resource",
      jobs: 346,
      icon: (
        <>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </>
      ),
      active: false,
    },
  ];

  return (
    <section className="w-full py-20 px-6 md:px-[124px] bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-clash font-semibold text-brand-dark text-center md:text-left">
            Explore by <span className="text-secondary">category</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`p-8 border transition-all cursor-pointer group flex flex-col items-start gap-8 ${
                category.active
                  ? "bg-primary border-primary shadow-[0px_48px_80px_rgba(70,64,222,0.1)]"
                  : "bg-white border-brand-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                  category.active ? "text-white" : "text-primary"
                }`}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {category.icon}
                </svg>
              </div>

              <div className="space-y-4 w-full">
                <h3
                  className={`text-2xl font-clash font-semibold ${
                    category.active ? "text-white" : "text-brand-dark"
                  }`}
                >
                  {category.name}
                </h3>
                <div className="flex justify-between items-center group/item text-lg">
                  <span
                    className={
                      category.active ? "text-white/80" : "text-brand-gray"
                    }
                  >
                    {category.jobs} jobs available
                  </span>
                  <svg
                    className={`w-6 h-6 transform group-hover/item:translate-x-1 transition-transform ${
                      category.active ? "text-white" : "text-brand-dark"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
