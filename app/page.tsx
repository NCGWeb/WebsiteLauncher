import SetupForm from "@/components/SetupForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8 max-w-2xl text-center sm:mb-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Website <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Launcher</span>
        </h1>
        <p className="mt-4 text-base text-muted sm:text-lg">
          Set a timer, add a message, and take your site live with a launch.
        </p>
      </header>
      <SetupForm />
    </main>
  );
}
