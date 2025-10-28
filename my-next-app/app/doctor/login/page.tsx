'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';

export default function DoctorLoginPage() {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrMobile.trim()) {
      alert('Please enter your email or mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error('Failed to load user data');
      }

      const data = await response.json();

      // Search in doctors data
      const searchData = data.doctors;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doctor = searchData.find((d: any) => {
        const email = d.email?.toLowerCase() || '';
        const mobile = d.mobile || '';
        const phone = d.phone || '';
        const inputLower = emailOrMobile.toLowerCase().trim();
        const inputTrim = emailOrMobile.trim();

        return email === inputLower || mobile === inputTrim || phone === inputTrim;
      });

      if (doctor) {
        localStorage.setItem('loginEmailOrMobile', emailOrMobile);
        localStorage.setItem('userId', doctor.id);
        localStorage.setItem('userEmail', doctor.email || '');
        localStorage.setItem('userMobile', doctor.mobile || doctor.phone || '');
        localStorage.setItem('userOTP', doctor.otp || '');
        localStorage.setItem('loginType', 'doctor');

        // Store doctor info
        localStorage.setItem('doctorName', doctor.name || '');
        localStorage.setItem('doctorSpeciality', doctor.speciality || '');
        localStorage.setItem('doctorQualification', doctor.qualification || '');
        localStorage.setItem('doctorLocation', doctor.location || '');

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        router.push('/user/otp');
      } else {
        alert('Doctor not found. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Unable to connect to server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Continue with Google');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#E8F4F8] via-[#F0F9FF] to-[#91C8E4]/20">
      {/* Header with Logo */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-[#4682A9]">Schedula</span>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-sm text-[#4682A9]">
          <span>New doctor?</span>
          <Link
            href="/doctor/signup"
            className="text-[#4682A9] hover:text-[#749BC2] font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-20 pb-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Side - Welcome Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-[#91C8E4]/20 rounded-full">
                <span className="text-[#4682A9] font-semibold text-sm">🩺 Medical Professional Portal</span>
              </div>

              <h1 className="text-5xl font-bold text-[#2C5F7C] leading-tight">
                Welcome Back,
                <span className="text-[#4682A9]"> Doctor</span>
              </h1>

              <p className="text-lg text-[#4682A9] leading-relaxed">
                Access your medical practice dashboard, manage patient appointments, and provide quality healthcare services.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#91C8E4]/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Patient Management</h3>
                <p className="text-sm text-[#4682A9]">Comprehensive patient records</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#749BC2]/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Smart Scheduling</h3>
                <p className="text-sm text-[#4682A9]">Efficient appointment system</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#FFFBDE] rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Analytics</h3>
                <p className="text-sm text-[#4682A9]">Practice insights & reports</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#91C8E4]/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Secure Platform</h3>
                <p className="text-sm text-[#4682A9]">HIPAA compliant system</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#2C5F7C] mb-2">Doctor Sign In</h2>
                <p className="text-[#4682A9]">Access your medical practice dashboard</p>
              </div>

              {/* Patient Login Redirect */}
              <div className="text-center mb-6">
                <div className="bg-[#91C8E4]/10 border border-[#91C8E4]/20 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Stethoscope className="w-5 h-5 text-[#4682A9]" />
                    <span className="text-[#4682A9] font-medium">Are you a patient?</span>
                    <Link
                      href="/user/login"
                      className="px-4 py-2 bg-linear-to-r from-[#91C8E4] to-[#4682A9] text-white rounded-lg font-medium hover:from-[#749BC2] hover:to-[#4682A9] transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      Patient Login
                    </Link>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email/Mobile Input */}
                <div>
                  <label htmlFor="emailOrMobile" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                    Doctor Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[#91C8E4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="emailOrMobile"
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      placeholder="Enter your professional email or mobile"
                      disabled={isLoading}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 rounded border-gray-300 text-[#4682A9] focus:ring-[#91C8E4] transition-colors cursor-pointer"
                    />
                    <span className="text-sm text-[#4682A9] group-hover:text-[#749BC2] transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#4682A9] hover:text-[#749BC2] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-[#91C8E4] to-[#4682A9] hover:from-[#749BC2] hover:to-[#4682A9] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Continue with OTP'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-[#4682A9]">Or continue with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-[#2C5F7C] font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md hover:border-[#91C8E4]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Sign Up Link - Mobile */}
              <div className="text-center mt-8 sm:hidden">
                <span className="text-[#4682A9] text-sm">Don&apos;t have an account? </span>
                <Link href="/doctor/signup" className="text-[#4682A9] hover:text-[#749BC2] font-semibold text-sm transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}