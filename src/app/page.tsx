import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {

  return (
    <HydrateClient>
      <main>
        Main
      </main>
    </HydrateClient>
  );
}
