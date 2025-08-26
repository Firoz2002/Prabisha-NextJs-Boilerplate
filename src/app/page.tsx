import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="grid grid-cols-[auto_auto] gap-4">
        <Link href="/login" className="btn btn-primary w-full sm:w-auto">
          Login
        </Link>
        <Link href="/register" className="btn w-full sm:w-auto">
          Register
        </Link>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/icons/logo.png"
          alt="Prabisha logo"
          width={180}
          height={38}
          priority
        />
      </main>

      <footer className="row-end-4 text-sm">© Prabisha</footer>
    </div>
  );
}
