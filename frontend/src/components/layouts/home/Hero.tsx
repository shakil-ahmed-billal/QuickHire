import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-brand-light overflow-hidden pt-10 px-6 md:px-[124px]">
      {/* Background Shapes */}
      <div className="absolute right-0 top-0 w-[860px] h-full pointer-events-none hidden lg:block">
        <div className="absolute left-[480.75px] top-[51.75px] w-[192.20px] h-[416.47px] border-4 border-[#CCCCF5] opacity-60 rotate-[64deg] origin-top-left"></div>
        <div className="absolute left-[861.93px] top-[21.56px] w-[328.32px] h-[796.20px] border-4 border-[#CCCCF5] opacity-70 rotate-[64deg] origin-top-left"></div>
        <div className="absolute left-[681.77px] top-[240px] w-[319.78px] h-[778.51px] border-4 border-[#CCCCF5] opacity-70 rotate-[64deg] origin-top-left"></div>
        <div className="absolute left-[382.77px] top-[617px] w-[283.38px] h-[716.25px] border-4 border-[#CCCCF5] opacity-70 rotate-[64deg] origin-top-left"></div>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between pt-12 md:pt-20">
        {/* Text Content */}
        <div className="w-full lg:w-[629px] flex flex-col gap-6 text-center lg:text-left pb-12 md:pb-20">
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl md:text-[72px] font-clash font-semibold leading-[1.1] text-brand-dark">
              Discover <br /> more than <br />
              <span className="text-secondary">5000+ Jobs</span>
            </h1>
            <div className="absolute left-0 lg:left-0 bottom-1 sm:bottom-2 md:bottom-3 w-[150px] sm:w-[200px] md:w-[455px] h-2 md:h-4 bg-secondary/20 -z-10"></div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-brand-gray max-w-[521px] leading-relaxed mx-auto lg:mx-0">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>

          {/* Search Box */}
          <div className="mt-8 bg-white p-2 md:p-4 shadow-[0px_79px_128px_rgba(192,192,192,0.09)] flex flex-col xl:flex-row items-stretch xl:items-center gap-2 xl:gap-0 w-full xl:w-[852px]">
            <div className="flex-1 flex items-center gap-4 px-4 border-b xl:border-b-0 xl:border-r border-brand-border py-4 md:py-6 xl:py-4">
              <svg
                className="w-6 h-6 text-primary shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full outline-none text-brand-dark placeholder:text-brand-gray/50 font-medium bg-transparent text-lg"
              />
            </div>

            <div className="flex-1 flex items-center gap-4 px-4 border-b xl:border-b-0 border-brand-border py-4 md:py-6 xl:py-4">
              <svg
                className="w-6 h-6 text-primary shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="flex items-center justify-between w-full cursor-pointer">
                <span className="text-brand-dark font-medium text-lg">
                  Florence, Italy
                </span>
                <svg
                  className="w-4 h-4 text-brand-gray"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <div className="p-2 xl:pl-4 w-full xl:w-auto">
              <button className="w-full px-8 py-4 bg-primary text-white font-bold text-lg hover:bg-primary/95 transition-all shrink-0 shadow-lg shadow-primary/20">
                Search my job
              </button>
            </div>
          </div>

          <p className="mt-4 text-brand-dark/70 text-sm md:text-base">
            <span className="font-medium text-brand-dark/50">Popular : </span>
            UI Designer, UX Researcher, Android, Admin
          </p>
        </div>

        {/* Hero Image */}
        <div className="mt-16 lg:mt-0 relative w-full max-w-[501px] aspect-[501/707] lg:h-[707px] self-end">
          <Image
            src="/assets/images/hero-illustration.png"
            alt="Job Seeker Illustration"
            fill
            className="object-contain z-10 object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
}
