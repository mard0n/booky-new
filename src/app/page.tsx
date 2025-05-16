import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        Main
      </main>
    </HydrateClient>
  );
}
