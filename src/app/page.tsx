import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 pb-10 bg-background">
      <div className="flex flex-col items-center max-w-sm w-full">
        {/* Logo mark */}
        <div className="mb-6">
          <Image
            src="/logo.svg"
            alt="Whiskly logo"
            width={72}
            height={80}
            priority
          />
        </div>

        {/* Wordmark */}
        <h1
          className="text-[40px] leading-none tracking-tight text-matcha-700"
          style={{ fontFamily: "var(--font-nunito-sans)", fontWeight: 600 }}
        >
          Whiskly
        </h1>

        {/* Slogan */}
        <p className="mt-3 text-lg text-gray-500 text-center">
          Discover your matcha taste profile
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 w-full mt-12">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl bg-matcha-600 text-white font-medium text-base hover:bg-matcha-700 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-matcha-600 font-medium hover:text-matcha-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
