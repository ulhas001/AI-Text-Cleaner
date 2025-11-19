import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [stats, setStats] = useState({ removed: 0 });
  const [copied, setCopied] = useState(false);

  const cleanText = (text) => {
    let cleaned = text;
    let removedCount = 0;

    const zeroWidthChars = /[\u200B-\u200D\uFEFF\u2060]/g;
    const zeroWidthMatches = cleaned.match(zeroWidthChars);
    if (zeroWidthMatches) removedCount += zeroWidthMatches.length;
    cleaned = cleaned.replace(zeroWidthChars, '');

    const invisibleChars = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200A\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFFB]/g;
    const invisibleMatches = cleaned.match(invisibleChars);
    if (invisibleMatches) removedCount += invisibleMatches.length;
    cleaned = cleaned.replace(invisibleChars, '');

    cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');
    cleaned = cleaned.replace(/[\u2018\u2019]/g, "'");
    cleaned = cleaned.replace(/[\u2013\u2014]/g, '-');
    cleaned = cleaned.replace(/\u00A0/g, ' ');

    return { text: cleaned, removedCount };
  };

  const handleClean = () => {
    const result = cleanText(inputText);
    setCleanedText(result.text);
    setStats({ removed: result.removedCount });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = cleanedText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setInputText('');
    setCleanedText('');
    setStats({ removed: 0 });
    setCopied(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-8 sm:py-10 lg:py-12">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="floating-shape floating-shape-1 absolute w-[500px] h-[500px] rounded-full -top-40 -left-40" />
        <div className="floating-shape floating-shape-2 absolute w-[400px] h-[400px] rounded-full -bottom-32 -right-32" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with shimmer effect */}
        <header className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-gradient tracking-tight leading-tight">
            Clean AI Text
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-normal px-4">
            Remove invisible characters & watermarks instantly
          </p>
        </header>

        {/* Stats Badge with glass effect */}
        {stats.removed > 0 && (
          <div className="flex justify-center mb-8">
            <div className="badge-glass inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full animate-[slideDown_0.4s_ease-out] max-w-[90%] text-center">
              <span className="text-xl">✓</span>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                {stats.removed} invisible characters removed
              </span>
            </div>
          </div>
        )}

        {/* Main Card with enhanced glass effect */}
        <div className="glass-card rounded-[24px] p-6 sm:p-8 lg:p-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 mb-8">
            {/* Input Section */}
            <div className="relative pb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Input
              </label>
              <textarea
                className="textarea-glass w-full p-4 border-[1.5px] border-gray-200 rounded-2xl text-[15px] font-mono leading-relaxed resize-y text-gray-900 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] preserve-format appearance-none focus:outline-none focus:border-gray-800 placeholder:text-gray-300"
                placeholder="Paste AI-generated text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                spellCheck="false"
              />
              <div className="absolute bottom-0 right-0 text-xs text-gray-400 font-medium">
                {inputText.length} chars
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px lg:w-px lg:h-auto bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-gray-300 to-transparent my-2 lg:my-8 opacity-50" />

            {/* Output Section */}
            <div className="relative pb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Cleaned
              </label>
              <textarea
                className="textarea-glass w-full p-4 border-[1.5px] border-gray-200 rounded-2xl text-[15px] font-mono leading-relaxed resize-y text-gray-900 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] preserve-format appearance-none focus:outline-none focus:border-gray-800 placeholder:text-gray-300"
                placeholder="Clean text appears here..."
                value={cleanedText}
                readOnly
                rows={12}
                spellCheck="false"
              />
              <div className="absolute bottom-0 right-0 text-xs text-gray-400 font-medium">
                {cleanedText.length} chars
              </div>
            </div>
          </div>

          {/* Buttons with glass effect */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              className="btn-glass flex-1 sm:flex-initial min-h-[48px] min-w-[120px] sm:min-w-[140px] px-6 py-3.5 text-[15px] font-semibold rounded-xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed no-tap-highlight touch-manipulation select-none"
              onClick={handleClean}
              disabled={!inputText}
            >
              <span className="pointer-events-none relative z-10">Clean Text</span>
            </button>

            <button
              className="btn-glass flex-1 sm:flex-initial min-h-[48px] min-w-[120px] px-6 py-3.5 text-[15px] font-semibold rounded-xl transition-all duration-300 bg-white/40 backdrop-blur-md text-gray-800 border-[1.5px] border-white/60 hover:bg-white/60 hover:scale-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed no-tap-highlight touch-manipulation select-none shadow-lg"
              onClick={handleCopy}
              disabled={!cleanedText}
            >
              <span className="pointer-events-none relative z-10">
                {copied ? '✓ Copied' : 'Copy'}
              </span>
            </button>

            <button
              className="btn-glass min-h-[48px] min-w-[100px] px-6 py-3.5 text-[15px] font-semibold rounded-xl transition-all duration-300 bg-white/20 backdrop-blur-md text-gray-600 border-[1.5px] border-white/40 hover:bg-white/40 hover:scale-105 active:scale-[0.98] no-tap-highlight touch-manipulation select-none shadow-md"
              onClick={handleClear}
            >
              <span className="pointer-events-none relative z-10">Clear</span>
            </button>
          </div>
        </div>

        {/* Features with enhanced glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="feature-glass flex items-start gap-4 p-5 rounded-2xl">
            <div className="text-3xl flex-shrink-0">⚡</div>
            <div>
              <h3 className="text-[15px] font-semibold mb-1 text-gray-800">Zero-Width Chars</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Removes ZWSP, ZWNJ, ZWJ</p>
            </div>
          </div>

          <div className="feature-glass flex items-start gap-4 p-5 rounded-2xl">
            <div className="text-3xl flex-shrink-0">📐</div>
            <div>
              <h3 className="text-[15px] font-semibold mb-1 text-gray-800">Format Preserved</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Keeps line breaks & spaces</p>
            </div>
          </div>

          <div className="feature-glass flex items-start gap-4 p-5 rounded-2xl">
            <div className="text-3xl flex-shrink-0">✨</div>
            <div>
              <h3 className="text-[15px] font-semibold mb-1 text-gray-800">Smart Quotes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Convert to ASCII</p>
            </div>
          </div>

          <div className="feature-glass flex items-start gap-4 p-5 rounded-2xl">
            <div className="text-3xl flex-shrink-0">🛡️</div>
            <div>
              <h3 className="text-[15px] font-semibold mb-1 text-gray-800">Control Chars</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Remove markers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
