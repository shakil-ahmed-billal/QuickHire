import Image from "next/image";

export default function TrustedCompanies() {
  const companies = [
    { name: "Talkit", icon: "/company/talkit 1.png", width: 154, height: 40 },
    { name: "AMD", icon: "/company/amd-logo-1.png", width: 82, height: 32 },
    { name: "Vodafone", icon: "/company/vodafone-2017-logo.svg", width: 183, height: 24 },
    { name: "Tesla", icon: "/company/tesla-9 1.png", width: 116, height: 28 },
    { name: "Intel", icon: "/company/intel-3.png", width: 108, height: 32 },
  ];

  return (
    <section className="w-full py-12 px-6 md:px-[124px] bg-white overflow-hidden">
      <div className="container mx-auto flex flex-col justify-start items-start gap-8">
        <div className="opacity-50 text-[#202430] text-[18px] font-epilogue font-normal leading-[28.80px] break-words">
          Companies we helped grow
        </div>
        <div className="self-stretch flex justify-between items-center flex-wrap gap-8">
          {companies.map((company, index) => (
            <div
              key={index}
              className="relative opacity-30 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shrink-0"
              style={{ width: company.width, height: company.height }}
            >
              <Image
                src={company.icon}
                alt={company.name}
                width={company.width}
                height={company.height}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
