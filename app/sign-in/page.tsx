import { SignIn } from "@stackframe/stack";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center relative overflow-hidden text-white">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
            </div>

            {/* Sign In Container */}
            <div className="relative z-10 w-full max-w-[440px] px-6">
                <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">

                    <div className="flex flex-col items-center mb-10">
                        <div className="flex gap-1.5 mb-5">
                            <div className="w-2 h-6 bg-purple-600 rounded-full" />
                            <div className="w-2 h-6 bg-purple-400 rounded-full mt-1.5" />
                            <div className="w-2 h-6 bg-purple-200 rounded-full" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-zinc-400 text-sm mt-1">Please enter your details to sign in</p>
                    </div>

                    <div className="stack-dark-fix">
                        <style dangerouslySetInnerHTML={{
                            __html: `
              .stack-dark-fix * { color: #e4e4e7 !important; } /* zinc-300 */
              .stack-dark-fix button { color: #000000 !important; font-weight: 600; }
              .stack-dark-fix input { background: #18181b !important; border-color: #27272a !important; color: white !important; }
              .stack-dark-fix a { color: #a855f7 !important; } /* purple-500 */
              .stack-dark-fix span, .stack-dark-fix label { color: #a1a1aa !important; } /* zinc-400 */
            `}} />
                        <SignIn />
                    </div>
                </div>

                <p className="mt-8 text-center text-zinc-500 text-xs tracking-widest uppercase opacity-50">
                    © 2026 Matias Raimondi
                </p>
            </div>
        </div>
    );
}
