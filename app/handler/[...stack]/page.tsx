import { StackHandler } from "@stackframe/stack";

export default function Handler() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center relative overflow-hidden text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 p-8 md:p-10 rounded-[2rem] shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="flex gap-1.5 mb-5">
              <div className="w-1.5 h-5 bg-purple-600 rounded-full" />
              <div className="w-1.5 h-5 bg-purple-400 rounded-full mt-1.5" />
              <div className="w-1.5 h-5 bg-purple-200 rounded-full" />
            </div>
          </div>

          <div className="stack-dark-override">
            <style dangerouslySetInnerHTML={{ __html: `
              .stack-dark-override * { 
                color: #f4f4f5 !important; 
              }
              
              .stack-dark-override input { 
                background: #18181b !important; 
                border-color: #27272a !important; 
                color: white !important;
                border-radius: 0.75rem !important;
              }
              
              .stack-dark-override label, 
              .stack-dark-override span,
              .stack-dark-override p { 
                color: #a1a1aa !important; 
              }
              
              .stack-dark-override button[type="submit"] { 
                color: #000000 !important;
                font-weight: 700 !important;
                border-radius: 0.75rem !important;
              }
              
              .stack-dark-override a { 
                color: #a855f7 !important; 
              }
              .stack-dark-override a:hover {
                text-decoration: underline !important;
              }

              /* Divider text "Or continue with" */
              .stack-dark-override .st-divider {
                border-color: #27272a !important;
              }
            `}} />
            <StackHandler />
          </div>
        </div>
        
        <p className="mt-8 text-center text-zinc-600 text-[10px] tracking-[0.2em] uppercase">
          © 2026 Matias Raimondi
        </p>
      </div>
    </div>
  );
}