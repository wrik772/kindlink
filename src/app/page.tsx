import Link from "next/link";

export default function Home() {
  return (
    <section className="py-16 sm:py-24">
      <div className="grid gap-10 sm:gap-14 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Connect NGOs, Shelters, and Donors in real time
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-prose">
            KindLink is a community-driven platform where organizations post real needs
            — food, clothes, medicine, volunteers — and local donors step in instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-muesli)] text-white px-5 py-3 text-sm font-medium hover:opacity-90"
            >
              Explore causes
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-muesli)] text-[var(--brand-muesli)] px-5 py-3 text-sm font-medium hover:bg-[#f7efe5]"
            >
              Join as NGO / Donor
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--brand-sorrell)]/50 p-6 bg-[#fffaf4]">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-[#fff] border border-[var(--brand-sorrell)]/40 p-4">
              <p className="font-semibold">Shelter needs</p>
              <p className="text-foreground/70">Puppy food x 20kg, blankets</p>
            </div>
            <div className="rounded-lg bg-[#fff] border border-[var(--brand-sorrell)]/40 p-4">
              <p className="font-semibold">NGO request</p>
              <p className="text-foreground/70">Medical kits for field camp</p>
            </div>
            <div className="rounded-lg bg-[#fff] border border-[var(--brand-sorrell)]/40 p-4">
              <p className="font-semibold">Volunteer call</p>
              <p className="text-foreground/70">3 weekend helpers for adoption day</p>
            </div>
            <div className="rounded-lg bg-[#fff] border border-[var(--brand-sorrell)]/40 p-4">
              <p className="font-semibold">Local donor</p>
              <p className="text-foreground/70">Donated 10kg cat food</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
