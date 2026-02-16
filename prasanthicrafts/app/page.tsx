"use client";

import MaintenancePage from "./components/MaintenancePage";

export default function Home() {
  // Set this to true to show the maintenance page
  const isUnderMaintenance = true;

  if (isUnderMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Prasanthi Crafts
        </p>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold">Welcome to Prasanthi Crafts</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          This is the main website page. Set isUnderMaintenance to false to see this content.
        </p>
      </div>
    </main>
  );
}
