import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#202430] py-20 px-6 md:px-[124px] text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary  flex items-center justify-center relative overflow-hidden">
              {/* Same Logo as Navbar */}
              <div className="w-[18px] h-1.5 border-[3px] border-white rounded-[0.5px]"></div>
              <div className="absolute w-5 h-5 border-2 border-white  translate-y-1 -rotate-90"></div>
            </div>
            <span className="text-2xl font-bold font-red-hat">QuickHire</span>
          </div>
          <p className="text-gray-400 leading-relaxed font-epilogue">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold">About</h4>
          <ul className="space-y-4 text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Companies
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Advice
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold">Resources</h4>
          <ul className="space-y-4 text-gray-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Help Docs
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Updates
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold">Get job notifications</h4>
          <p className="text-gray-400">
            The latest job news, articles, sent to your inbox weekly.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-white/5 border border-white/10 px-4 py-3 flex-1 outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary px-6 py-3 font-bold hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <p>2026 @ QuickHire. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white">
            Facebook
          </Link>
          <Link href="#" className="hover:text-white">
            Instagram
          </Link>
          <Link href="#" className="hover:text-white">
            Twitter
          </Link>
          <Link href="#" className="hover:text-white">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
