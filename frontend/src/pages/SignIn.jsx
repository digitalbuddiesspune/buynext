import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import brandLogo from '../assets/buynest.logo.jpeg';

const SignIn = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mobile'
  const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP input, 3: New User Name & Email input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6-digit OTP
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputRefs = useRef([]);

  const getTargetRedirect = () => {
    const rawFrom = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state?.from : null);
    const rawBg = location.state?.backgroundLocation?.pathname;
    if (rawFrom && rawFrom !== '/signin' && rawFrom !== '/signup') return rawFrom;
    if (rawBg && rawBg !== '/signin' && rawBg !== '/signup') return rawBg;
    return '/';
  };

  const closePath = getTargetRedirect();

  // If already authenticated on mount, close immediately
  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      navigate(closePath, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    const scrollY = window.scrollY;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Resend OTP timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first OTP input when OTP step is shown
  useEffect(() => {
    if (step === 2 && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
    setError('');
    
    if (value.length === 10 && !/^[6-9]/.test(value)) {
      setError('Mobile number should start with 6, 7, 8, or 9');
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    if (digit) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      setError('');

      if (index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          setOtp(digits.split(''));
          setError('');
          otpInputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(''));
      setError('');
      otpInputRefs.current[5]?.focus();
    }
  };

  const getOtpValue = () => otp.join('');

  const finishLoginAndRedirect = () => {
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { authenticated: true } }));
    const target = getTargetRedirect();
    navigate(target, { replace: true, state: {} });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await api.signin({ email: formData.email, password: formData.password });

      if (resp?.token) {
        localStorage.setItem('auth_token', resp.token);
      }
      
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }

      if (resp?.user) {
        try {
          localStorage.setItem('user_data', JSON.stringify({ name: resp.user.name, email: resp.user.email }));
        } catch (e) {
          console.warn('Failed to store user data:', e);
        }
      }

      finishLoginAndRedirect();
    } catch (err) {
      setError(err.message || err.response?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);
      if (!data.success) {
        throw new Error(data?.message || 'Failed to send OTP');
      }
      setSuccess(`OTP sent to +91 ${mobile}`);
      setStep(2);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || err.response?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpValue = getOtpValue();
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyOtp({ mobile, otp: otpValue });
      if (!data.success) {
        throw new Error(data?.message || 'Invalid OTP');
      }

      // If user is new -> ask for Name & Email in Step 3!
      if (data.isNewUser) {
        if (data.verificationToken) {
          setVerificationToken(data.verificationToken);
        }
        setSuccess('OTP verified successfully!');
        setStep(3);
        setLoading(false);
        return;
      }

      // Existing user login
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      if (data?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }

      if (data?.user) {
        try {
          localStorage.setItem('user_data', JSON.stringify({ 
            name: data.user.name, 
            email: data.user.email,
            phone: data.user.phone 
          }));
        } catch (e) {
          console.warn('Failed to store user data:', e);
        }
      }

      finishLoginAndRedirect();
    } catch (err) {
      setError(err.message || err.response?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete registration with Name & Email
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyOtp({
        mobile,
        otp: getOtpValue() || undefined,
        name: newName.trim(),
        email: newEmail.trim() || undefined,
        verificationToken: verificationToken || undefined,
      });

      if (!data.success || !data.token) {
        throw new Error(data?.message || 'Failed to complete registration');
      }

      localStorage.setItem('auth_token', data.token);
      if (data?.user) {
        localStorage.setItem('user_data', JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone
        }));
      }

      finishLoginAndRedirect();
    } catch (err) {
      setError(err.message || 'Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);
      if (!data.success) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }
      setSuccess('OTP resent successfully');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || err.response?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative transition-all duration-300">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => navigate(closePath, { replace: true, state: {} })}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10 cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pink-50/80 mb-3 border border-pink-100 shadow-sm">
              <img src={brandLogo} alt="BuyNest" className="h-8 sm:h-9 w-auto object-contain" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {step === 3 ? 'Welcome to BuyNest!' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {step === 3
                ? 'Please enter your name and email to complete your registration'
                : 'Sign in to manage your orders, wishlist, and profile'}
            </p>
          </div>

          {/* Mode Switcher Pills (Only for steps 1 and 2) */}
          {step !== 3 && (
            <div className="flex rounded-2xl bg-gray-100/90 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setLoginMode('email'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  loginMode === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Email & Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('mobile'); setStep(1); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  loginMode === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Mobile OTP
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50/90 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start gap-2.5 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="flex-1 font-medium">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-700 flex items-start gap-2.5">
              <svg className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1 font-medium">{success}</span>
            </div>
          )}

          {/* EMAIL & PASSWORD LOGIN FORM */}
          {loginMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-medium placeholder-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-11 py-3 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-medium placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          ) : step === 1 ? (
            /* MOBILE OTP - STEP 1 (PHONE INPUT) */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-700 font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={handleMobileChange}
                    required
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full pl-14 pr-4 py-3 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-medium placeholder-gray-400"
                    placeholder="Enter 10-digit mobile number"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Get OTP</span>
                  )}
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            /* MOBILE OTP - STEP 2 (OTP INPUT) */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to <span className="font-bold text-gray-900">+91 {mobile}</span>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="ml-2 text-xs font-semibold text-pink-600 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </p>

                {/* 6 Digit OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-2.5 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  ))}
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {resendTimer > 0 ? (
                    <span>Resend OTP in <strong className="text-pink-600">{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-pink-600 font-bold hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || getOtpValue().length !== 6}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 3: NEW USER NAME & EMAIL ONBOARDING FORM */
            <form onSubmit={handleCompleteRegistration} className="space-y-4 animate-fadeIn">
              <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100 mb-3 text-center">
                <span className="text-xs text-pink-700 font-semibold">
                  📱 Mobile Verified: <strong>+91 {mobile}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => { setNewName(e.target.value); setError(''); }}
                    required
                    className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-medium placeholder-gray-400"
                    placeholder="Enter your full name"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setError(''); }}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-medium placeholder-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !newName.trim()}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-pink-500 hover:bg-pink-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Completing Registration...</span>
                    </>
                  ) : (
                    <span>Complete & Start Shopping</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer - Switch to Sign Up */}
          {step !== 3 && (
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  state={{ backgroundLocation: location.state?.backgroundLocation || location }}
                  className="text-pink-600 hover:text-pink-700 font-bold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
