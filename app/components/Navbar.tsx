export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo */}
          <div className="flex items-center w-48">
            <a href="/" className="text-lg font-bold text-black tracking-tight hover:text-gray-700 transition-colors">
              Freedom Fund
            </a>
          </div>
          
          {/* Center - Nav Links */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <a 
              href="/charities" 
              className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
            >
              Charities
            </a>
            <a 
              href="/claims" 
              className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
            >
              Submit Claim
            </a>
            <a 
              href="https://medium.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-all"
            >
              Medium
            </a>
          </div>
          
          {/* Right - Social Links */}
          <div className="flex items-center justify-end w-48">
            <a 
              href="https://x.com/valorfundbonk" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:bg-gray-100 p-2 rounded-full transition-all"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
