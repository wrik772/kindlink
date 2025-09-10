import Link from "next/link";

type Post = {
  id: string;
  orgName: string;
  type: "donation" | "volunteer" | "in-kind";
  message: string;
  timeAgo: string;
};

const demoPosts: Post[] = [
  {
    id: "1",
    orgName: "Green Paws Shelter",
    type: "in-kind",
    message: "Urgent: Puppy food 20kg, cleaning supplies, warm blankets",
    timeAgo: "5m",
  },
  {
    id: "2",
    orgName: "CareAid NGO",
    type: "volunteer",
    message: "Looking for 4 weekend volunteers for medical camp",
    timeAgo: "22m",
  },
  {
    id: "3",
    orgName: "City Animal Rescue",
    type: "donation",
    message: "Raising $2,000 for emergency vet procedures",
    timeAgo: "1h",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs rounded-full px-2 py-1 border border-black/[.08] dark:border-white/[.145]">
      {children}
    </span>
  );
}

export default function HomeFeedPage() {
  return (
    <section className="py-8">
      <div className="rounded-xl border border-[var(--brand-sorrell)]/50 p-6 bg-[#fffaf4]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Community feed</h1>
          <Link href="/login" className="text-sm underline text-[var(--brand-muesli)]">
            Post a need
          </Link>
        </div>

        <div className="grid gap-4">
          {demoPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border border-[var(--brand-sorrell)]/50 p-4 bg-[#fff]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{post.orgName}</div>
                <div className="text-xs text-foreground/60">{post.timeAgo}</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{post.type}</Badge>
              </div>
              <p className="text-sm text-foreground/85">{post.message}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md border border-black bg-black text-white px-3 py-1.5 text-sm transition-colors hover:bg-[#333]">
                  Contribute
                </button>
                <button className="rounded-md border border-black bg-black text-white px-3 py-1.5 text-sm transition-colors hover:bg-[#333]">
                  Share
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


