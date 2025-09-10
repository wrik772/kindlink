export default function Footer() {
  return (
    <footer className="w-full border-t border-[#ae8563]/30 mt-12 bg-white text-[#6b4b34]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs flex items-center justify-between">
        <p>© {new Date().getFullYear()} KindLink. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}


