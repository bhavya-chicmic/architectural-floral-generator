export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-4">
          Architectural Floral Decorator
        </h1>
        <p className="text-gray-500 text-xl mb-8">
          Professional photorealistic floral decoration for architectural designs
        </p>
        <a
          href="/generate"
          className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
