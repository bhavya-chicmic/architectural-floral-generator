import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-center p-10">
      <h1 className="text-4xl font-bold mb-4">🌸 Design Your Own Bouquet</h1>
      <p className="text-gray-600 mb-8">
        Create a personalized bouquet in seconds using AI or manual design.
      </p>

      <div className="flex gap-6">
        <Link href="/design" className="btn-primary">
          🎨 Design from Scratch
        </Link>
        <Link href="/design?mode=ai" className="btn-secondary">
          🤖 Upload Image & Use AI
        </Link>
      </div>
    </main>
  );
}