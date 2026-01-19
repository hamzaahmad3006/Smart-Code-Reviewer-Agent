import Link from 'next/link';
import { ArrowRight, Code2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm mb-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Powered by GPT-4
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700">
            Code Review using <br />
            <span className="bg-linear-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Get instant, senior-level code reviews. Identify bugs, improve quality, and ship faster with our AI-powered analysis tool.
          </p>

          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link
              href="/reviewer"
              className="group bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2"
            >
              Start Reviewing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-16 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Analysis</h3>
              <p className="text-slate-400">Deep understanding of logic, structure, and best practices across multiple languages.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bug Detection</h3>
              <p className="text-slate-400">Identify potential bugs, security vulnerabilities, and anti-patterns before merging.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Feedback</h3>
              <p className="text-slate-400">No waiting for peers. Get detailed feedback and actionable suggestions in seconds.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-8 text-center text-slate-500">
        <p>&copy; 2026 Smart Code Reviewer. Built with Next.js & OpenAI.</p>
      </footer>
    </div>
  );
}
