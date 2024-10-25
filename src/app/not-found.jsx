import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center p-4 min-h-screen items-center gap-4">
      <div className="h-96 w-fit overflow-hidden rounded-xl mx-auto">
        <Image
          src="/404.gif"
          alt="website under construction"
          height={500}
          width={700}
          priority
          className="h-full w-full object-contain rounded-xl overflow-hidden"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold text-zinc-400 dark:text-zinc-500">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Page not found
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <Link href="/">
          <Button variant="secondary" className="mt-4">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
