import CategorySection from "@/components/layouts/home/CategorySection";
import FeaturedJobs from "@/components/layouts/home/FeaturedJobs";
import Hero from "@/components/layouts/home/Hero";
import LatestJobs from "@/components/layouts/home/LatestJobs";
import PostJobCTA from "@/components/layouts/home/PostJobCTA";
import TrustedCompanies from "@/components/layouts/home/TrustedCompanies";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <TrustedCompanies />
        <CategorySection />
        <FeaturedJobs />
        <LatestJobs />
        <PostJobCTA />
      </main>
    </div>
  );
}
