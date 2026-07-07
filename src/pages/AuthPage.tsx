import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Key, 
  LogOut,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useToasts } from "../components/ui/toast";

type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'otp';

export default function AuthPage() {
  const { login, register, isLoading } = useAuthStore();
  const { addToast } = useToasts();
  
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("investor@finsight.ai");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Very Weak", color: "bg-rose-500" });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "None", color: "bg-slate-800" });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Very Weak";
    let color = "bg-rose-500";
    if (score === 1) {
      label = "Weak";
      color = "bg-orange-500";
    } else if (score === 2) {
      label = "Fair";
      color = "bg-amber-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-blue-500";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-emerald-500";
    }
    setPasswordStrength({ score, label, color });
  }, [password]);

  // General validators
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    try {
      await login(email, "");
      addToast({
        title: "Welcome Back",
        description: "Authenticated successfully. Systems synchronized.",
        type: "success"
      });
    } catch (err) {
      addToast({
        title: "Auth Failed",
        description: "Authentication systems are temporarily busy.",
        type: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    // Switch to OTP verification flow first
    setMode('otp');
    addToast({
      title: "Verification Sent",
      description: `A 6-digit one-time passcode was sent to ${email}.`,
      type: "info"
    });
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const joined = otpCode.join("");
    if (joined.length < 6) {
      addToast({
        title: "Incomplete Passcode",
        description: "Please enter the full 6-digit OTP code.",
        type: "warning"
      });
      return;
    }

    try {
      await register(email, name);
      addToast({
        title: "Account Created",
        description: "Your secure AlphaMatrix account is fully activated.",
        type: "success"
      });
    } catch {
      addToast({
        title: "Activation Error",
        description: "Unable to activate profile at this time.",
        type: "destructive"
      });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setErrors({ email: "Enter a valid email address to receive instructions" });
      return;
    }
    setErrors({});
    
    addToast({
      title: "Email OTP Sent",
      description: `A 6-digit restoration OTP code was sent to ${email}.`,
      type: "success"
    });
    
    // Simulate navigation to Reset password page
    setTimeout(() => {
      setMode('reset');
      setResetToken("");
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!resetToken || resetToken.trim().length < 6) {
      newErrors.resetToken = "Please enter the 6-digit Email OTP";
    }
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    addToast({
      title: "Password Restored",
      description: "Your new security credential is now active. Please sign in.",
      type: "success"
    });
    setMode('login');
    setEmail("investor@finsight.ai");
    setPassword("password123");
  };

  const handleGoogleSignIn = () => {
    addToast({
      title: "Connecting Google Auth",
      description: "Establishing secure multi-factor handshakes with Google...",
      type: "info"
    });
    setTimeout(() => {
      login("investor@finsight.ai", "Google Investor");
      addToast({
        title: "Google Signed In",
        description: "Secure profile synchronization completed successfully.",
        type: "success"
      });
    }, 1200);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = element.value;
    setOtpCode(newOtp);

    // Focus next
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpCode[index] && e.currentTarget.previousSibling) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070c] relative overflow-hidden px-4 py-12">
      {/* Decorative background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-[450px] bg-[#090d16]/70 border border-slate-800/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl p-10 sm:p-11 relative z-10 overflow-hidden">
        
        {/* Banner Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-xl mb-4 hover:scale-105 transition-transform duration-200">
            <span className="font-extrabold text-white text-xl">AM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">AlphaMatrix</h1>
          <span className="text-[10px] block text-primary font-bold uppercase tracking-widest font-mono mt-1">FINSIGHT AI TERMINAL</span>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100">Access Secure Session</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Please sign in to coordinate portfolio analytics.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-12 pl-11 pr-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</span>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-11 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</span>}
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 rounded-md border-slate-800 bg-slate-900/40 text-primary focus:ring-primary focus:ring-0 cursor-pointer transition-all"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Remember Session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10"
                >
                  <span>{isLoading ? "Signing In..." : "Initialize Dashboard Session"}</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              <div className="relative my-5 flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800/50"></div>
                <span className="flex-shrink mx-4 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-slate-800/50"></div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/30 text-slate-200 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 0 1 8.5 13a5.5 5.5 0 0 1 5.49-5.518c1.4 0 2.5.5 3.32 1.258l3.1-3.1C18.48 3.745 15.65 2.5 12.24 2.5 6.5 2.5 2 7 2 12.75s4.5 10.25 10.24 10.25c5.96 0 10.435-4.22 10.435-10.41 0-.62-.054-1.2-.16-1.74l-8.275-.565z"/>
                </svg>
                <span>Synchronize with Google</span>
              </button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                First time using AlphaMatrix?{" "}
                <button
                  type="button"
                  onClick={() => { 
                    setMode('register'); 
                    setErrors({}); 
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-primary hover:underline font-bold ml-1"
                >
                  Create Secure Profile
                </button>
              </p>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100">Create Secure Profile</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Initialize your encrypted macro dashboard.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Full Name</label>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full h-12 pl-11 pr-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                  </div>
                  {errors.name && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.name}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full h-12 pl-11 pr-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Create Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-11 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] uppercase font-mono text-muted-foreground">
                        <span>Strength Score: <strong className="text-slate-200">{passwordStrength.label}</strong></span>
                        <span>{passwordStrength.score}/4</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800/60 rounded-full overflow-hidden flex gap-0.5">
                        <div className={`h-full ${passwordStrength.color} flex-1`} style={{ opacity: passwordStrength.score >= 1 ? 1 : 0.2 }} />
                        <div className={`h-full ${passwordStrength.color} flex-1`} style={{ opacity: passwordStrength.score >= 2 ? 1 : 0.2 }} />
                        <div className={`h-full ${passwordStrength.color} flex-1`} style={{ opacity: passwordStrength.score >= 3 ? 1 : 0.2 }} />
                        <div className={`h-full ${passwordStrength.color} flex-1`} style={{ opacity: passwordStrength.score >= 4 ? 1 : 0.2 }} />
                      </div>
                    </div>
                  )}
                  {errors.password && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-11 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.confirmPassword}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10 pt-0.5"
                >
                  <span>Initialize Account Verification</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Already have a profile?{" "}
                <button
                  type="button"
                  onClick={() => { 
                    setMode('login'); 
                    setErrors({}); 
                    setEmail("investor@finsight.ai");
                    setPassword("password123");
                  }}
                  className="text-primary hover:underline font-bold ml-1"
                >
                  Access Session
                </button>
              </p>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Key size={18} className="text-primary"/>
                  <span>Password Restoration</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Submit your verified email address to recover credential keys.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">Verified Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-12 pl-11 pr-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10"
                >
                  <span>Generate Restoration Token</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrors({}); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-slate-100 font-semibold transition-colors pt-2 block"
              >
                Back to Session Sign In
              </button>
            </motion.div>
          )}

          {mode === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Key size={18} className="text-primary"/>
                  <span>Apply New Credentials</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Please provide your new access key credentials below.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">6-Digit Email OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 582914"
                    className="w-full h-12 px-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 font-mono tracking-widest text-center transition-all duration-200"
                  />
                  {errors.resetToken && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.resetToken}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold font-mono text-muted-foreground/90 block">New Secure Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-11 bg-slate-900/30 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-100 placeholder:text-muted-foreground/50 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="text-[10px] text-rose-400 mt-1 block flex items-center gap-1"><AlertCircle size={10}/>{errors.newPassword}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10"
                >
                  <span>Reset & Save Key</span>
                </button>
              </form>
            </motion.div>
          )}

          {mode === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary"/>
                  <span>Confirm One-Time Passcode</span>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">Please specify the 6-digit confirmation key transmitted to your device.</p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div className="flex gap-2.5 justify-between">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-14 text-center bg-slate-900/30 border border-slate-800/80 rounded-xl text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all duration-200"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground tracking-wider pt-1">
                  <span>Code valid for 5:00</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        title: "New Passcode Sent",
                        description: "Transmission of passcode complete.",
                        type: "success"
                      });
                    }}
                    className="text-primary hover:underline font-bold transition-all"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10"
                >
                  <span>Verify Passcode & Initialize</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setMode('register'); setErrors({}); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-slate-100 font-semibold transition-colors pt-2 block"
              >
                Change Registration Parameters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
