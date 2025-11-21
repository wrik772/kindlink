import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreatePostForm from "@/components/CreatePostForm";

export default async function CreatePostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/create-post");
  }

  return (
    <section className="py-12 max-w-2xl mx-auto">
      <div className="rounded-xl border border-[var(--brand-sorrell)]/50 bg-[#fffaf4] p-6">
        <h1 className="text-2xl font-semibold mb-4">Create a new post</h1>
        <div className="rounded-lg border border-[var(--brand-sorrell)]/50 bg-white p-5">
          <CreatePostForm />
        </div>
      </div>
    </section>
  );
}


