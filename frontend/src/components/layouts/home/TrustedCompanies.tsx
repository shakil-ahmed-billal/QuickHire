import Image from "next/image";

export default function TrustedCompanies() {
  const companies = [
    { name: "Nomad", icon: "/assets/logos/nomad.png", width: 153, height: 40 },
    {
      name: "Netlify",
      icon: "/assets/logos/netlify.png",
      width: 116,
      height: 28,
    },
    {
      name: "Dropbox",
      icon: "/assets/logos/dropbox.png",
      width: 182,
      height: 24,
    },
    {
      name: "GoDaddy",
      icon: "/assets/logos/godaddy.png",
      width: 108,
      height: 32,
    },
    {
      name: "Twitter",
      icon: "/assets/logos/twitter.png",
      width: 82,
      height: 32,
    },
  ];

  return (
    <section className="w-full py-12 px-6 md:px-[124px] bg-white border-b border-brand-border/50 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <p className="text-lg text-brand-dark/50 font-epilogue whitespace-nowrap text-center lg:text-left">
          Companies we helped grow
        </p>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex items-center gap-10 md:gap-16 animate-marquee w-max">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="relative grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all cursor-pointer duration-300 transform hover:scale-105 shrink-0"
              >
                <Image
                  src={company.icon}
                  alt={company.name}
                  width={company.width}
                  height={company.height}
                  className="object-contain max-h-[40px] w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
