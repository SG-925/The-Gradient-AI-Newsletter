export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} The Gradient. All rights reserved.
      </div>
    </footer>
  );
}
