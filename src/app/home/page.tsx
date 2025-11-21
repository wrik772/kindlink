import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/auth";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-wide rounded-full px-3 py-1 border border-[var(--brand-muesli)] text-[var(--brand-muesli)] bg-[#fffaf4]">
      {children}
    </span>
  );
}

export const dynamic = "force-dynamic";

export default async function HomeFeedPage() {
  await connectToDatabase();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  const session = await auth();
  const ctaHref = session?.user ? "/create-post" : "/login";
  const ctaText = session?.user ? "Post a need" : "Login to post a need";

  return (
    <section className="py-8">
      <div className="rounded-2xl border border-[var(--brand-sorrell)]/60 p-6 sm:p-8 bg-[#fffaf4] shadow-sm space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground/60">Live requests from NGOs & shelters</p>
            <h1 className="text-2xl font-semibold text-[#6b4b34]">Community feed</h1>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full border border-[var(--brand-muesli)] text-[var(--brand-muesli)] px-4 py-2 text-sm font-medium hover:bg-[#f7efe5]"
          >
            {ctaText}
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post._id.toString()}
              className="rounded-2xl border border-[var(--brand-sorrell)]/60 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand-muesli)]">Organization</p>
                  <p className="text-lg font-semibold text-[#3b2415]">{post.orgName}</p>
                </div>
                <div className="text-xs text-foreground/60 text-right">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge>{post.type}</Badge>
              </div>
              <p className="mt-4 text-base text-foreground/80 leading-relaxed">{post.message}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full border border-black bg-black text-white px-4 py-2 text-sm transition-colors hover:bg-[#333]">
                  Contribute
                </button>
                <button className="rounded-full border border-black bg-transparent text-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white">
                  Share
                </button>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--brand-sorrell)]/60 p-8 text-center text-sm text-foreground/70 bg-white">
              No posts yet. Be the first to{" "}
              <Link href={ctaHref} className="underline font-medium text-[var(--brand-muesli)]">
                share a need
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


