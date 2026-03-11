export default function PostJobCTA() {
  return (
    <section className="w-full py-20 px-6 md:px-[124px] bg-white">
      <div className="container mx-auto">
        <div className="w-full bg-primary relative overflow-hidden flex flex-col lg:flex-row items-center min-h-[414px] rounded-lg relative">
          {/* Text Content */}
          <div className="p-10 md:p-16 relative z-10 w-full lg:w-1/2 flex flex-col items-start gap-6">
            <h2 className="text-4xl md:text-5xl font-clash font-semibold text-white leading-tight">
              Start posting <br /> jobs today
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-medium font-epilogue">
              Start posting jobs for only $10.
            </p>
            <button className="px-8 py-4 bg-white text-primary font-bold text-lg hover:bg-gray-100 transition-all rounded-sm shadow-xl shadow-black/10">
              Sign Up For Free
            </button>
          </div>

          {/* Dashboard Illustration ("Protitra" section) */}
          <div className="hidden lg:flex flex-1 justify-end h-full relative overflow-hidden self-stretch relative justify-center items-center absolute right-10 top-10">
            <img src="/dashboard.png" alt="" 
            className=" "
            
            />
          </div>
        </div>
      </div>
    </section>
  );
}
