export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="w-full px-6 py-2">
        <div className="flex justify-between items-center">
          {/* Left - Nav Links */}
          <div className="flex gap-6">
            <a href="/" className="text-xs text-gray-600 hover:text-black transition-colors">Home</a>
            <a href="/charities" className="text-xs text-gray-600 hover:text-black transition-colors">Charities</a>
            <a href="/claims" className="text-xs text-gray-600 hover:text-black transition-colors">Submit Claim</a>
            <a href="https://medium.com/@valorfund/valor-fund-8cccab6a6093" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-black transition-colors">Medium</a>
          </div>
          
          {/* Center - Copyright */}
          <p className="text-xs text-gray-600 absolute left-1/2 -translate-x-1/2">© 2026 Valor Fund. Supporting our veterans.</p>
          
          {/* Right - Social Icon */}
          <a 
            href="https://x.com/valorfundbonk" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:bg-gray-100 p-1.5 rounded-full transition-all"
            aria-label="Twitter/X"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
