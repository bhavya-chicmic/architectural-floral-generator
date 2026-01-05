import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans overflow-hidden">
      {/* Navigation / Header */}
      <nav className="absolute top-0 w-full p-6 lg:px-8 flex justify-between items-center z-10">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-900 flex items-center gap-2">
          <span>🌸</span> Bouquet Builder
        </h1>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 max-w-lg text-5xl font-serif font-bold tracking-tight text-stone-900 sm:text-7xl">
              The Art of Floral Design, Reimagined.
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Create stunning, personalized bouquets in seconds. Whether you're a florist or a dreamer, our tools assist you in crafting the perfect arrangement with AI-powered suggestions or full creative control.
            </p>
            <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-5">
              <Link href="/design" className="rounded-full bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 transition-all text-center whitespace-nowrap">
                Start Manual Design
              </Link>
              <Link href="/design?mode=custom" className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:from-rose-600 hover:to-pink-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
                <span className="group-hover:scale-110 transition-transform">🎨</span> Custom Bouquet
              </Link>
              <Link href="/design?mode=ai" className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 hover:bg-rose-50 hover:ring-rose-200 transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
                <span className="group-hover:scale-110 transition-transform">✨</span> AI Assistant
              </Link>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <div className="relative rounded-2xl bg-stone-100/50 p-2 ring-1 ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-sm">
              <Image
                src="/hero.png"
                alt="Floral Workstation"
                width={1024}
                height={1024}
                priority
                className="rounded-xl shadow-2xl ring-1 ring-gray-900/10 w-[30rem] md:w-[48rem] max-w-none"
              />
            </div>
          </div>
        </div>
        {/* Bottom decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </div>
    </main>
  );
}