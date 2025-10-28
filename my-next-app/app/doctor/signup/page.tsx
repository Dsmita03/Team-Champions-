'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, User, Phone, Mail, Lock, MapPin, Award, GraduationCap } from 'lucide-react';

function DoctorSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speciality, setSpeciality] = useState('');
  const [qualification, setQualification] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const router = useRouter();

  const specialties = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic Surgeon', 
    'Pediatrician', 'Psychiatrist', 'General Physician', 'Gynecologist',
    'ENT Specialist', 'Ophthalmologist', 'Urologist', 'Oncologist'
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions!");
      return;
    }

    // Validation for doctor-specific fields
    if (!speciality.trim() || !qualification.trim() || !location.trim() || !experience.trim() || !licenseNumber.trim()) {
      alert("Please fill in all medical professional fields!");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Doctor Signup with:', {
        name,
        email,
        phone,
        password,
        speciality,
        qualification,
        location,
        experience,
        licenseNumber
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store signup info in localStorage for demo
      localStorage.setItem('signupName', name);
      localStorage.setItem('signupEmail', email);
      localStorage.setItem('signupPhone', phone);
      localStorage.setItem('signupType', 'doctor');
      localStorage.setItem('signupSpeciality', speciality);
      localStorage.setItem('signupQualification', qualification);
      localStorage.setItem('signupLocation', location);
      localStorage.setItem('signupExperience', experience);
      localStorage.setItem('signupLicenseNumber', licenseNumber);

      alert('Doctor account created successfully!');
      router.push('/doctor/login');
    } catch (err) {
      console.error('Signup error:', err);
      alert('Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Continue with Google for doctor signup');
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
          <span>Already registered?</span>
          <Link
            href="/doctor/login"
            className="text-[#4682A9] hover:text-[#749BC2] font-semibold transition-colors"
          >
            Sign In
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
                <span className="text-[#4682A9] font-semibold text-sm">🩺 Join Our Medical Network</span>
              </div>

              <h1 className="text-5xl font-bold text-[#2C5F7C] leading-tight">
                Start Your Medical
                <span className="text-[#4682A9]"> Practice</span>
              </h1>

              <p className="text-lg text-[#4682A9] leading-relaxed">
                Join our platform to connect with patients, manage appointments, and grow your medical practice with our comprehensive healthcare solutions.
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
                <h3 className="font-semibold text-[#2C5F7C] mb-1">10K+ Patients</h3>
                <p className="text-sm text-[#4682A9]">Access to large patient base</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#749BC2]/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Smart Scheduling</h3>
                <p className="text-sm text-[#4682A9]">Automated appointment system</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#FFFBDE] rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Revenue Growth</h3>
                <p className="text-sm text-[#4682A9]">Increase your practice income</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#91C8E4]/20 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#4682A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#2C5F7C] mb-1">Trusted Platform</h3>
                <p className="text-sm text-[#4682A9]">HIPAA compliant & secure</p>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">

              {/* Form Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-[#2C5F7C] mb-2">Create Doctor Account</h2>
                <p className="text-[#4682A9]">Join our medical professionals network</p>
              </div>

              {/* Patient Signup Redirect */}
              <div className="text-center mb-6">
                <div className="bg-[#91C8E4]/10 border border-[#91C8E4]/20 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3">
                    <Stethoscope className="w-5 h-5 text-[#4682A9]" />
                    <span className="text-[#4682A9] font-medium">Are you a patient?</span>
                    <Link
                      href="/user/signup"
                      className="px-4 py-2 bg-linear-to-r from-[#91C8E4] to-[#4682A9] text-white rounded-lg font-medium hover:from-[#749BC2] hover:to-[#4682A9] transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      Patient Signup
                    </Link>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                    Full Name (Dr.)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-[#91C8E4]" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email and Phone in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Professional Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@hospital.com"
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Contact Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your mobile number"
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Password and Confirm Password in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create password"
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Professional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Speciality Dropdown */}
                  <div>
                    <label htmlFor="speciality" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Medical Speciality
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Stethoscope className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <select
                        id="speciality"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
                      >
                        <option value="">Select your speciality</option>
                        {specialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Qualification Input */}
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Qualification
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <GraduationCap className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="text"
                        id="qualification"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        placeholder="MBBS, MD, MS, etc."
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience and License Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Experience Input */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Experience (Years)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Award className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="number"
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Years of practice"
                        disabled={isLoading}
                        required
                        min="0"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* License Number Input */}
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                      Medical License
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Award className="w-5 h-5 text-[#91C8E4]" />
                      </div>
                      <input
                        type="text"
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="Medical license number"
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-[#2C5F7C] mb-2">
                    Practice Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-[#91C8E4]" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Hospital/Clinic name"
                      disabled={isLoading}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91C8E4] focus:border-transparent placeholder:text-[#91C8E4] bg-white text-[#2C5F7C] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-[#4682A9] focus:ring-[#91C8E4] transition-colors cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-[#4682A9] cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#4682A9] hover:text-[#749BC2] font-semibold transition-colors underline">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[#4682A9] hover:text-[#749BC2] font-semibold transition-colors underline">
                      Privacy Policy
                    </Link>
                    . I confirm that all medical credentials provided are accurate and valid.
                  </label>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-[#91C8E4] to-[#4682A9] hover:from-[#749BC2] hover:to-[#4682A9] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Doctor Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-[#4682A9]">Or continue with</span>
                </div>
              </div>

              {/* Google Signup Button */}
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-[#2C5F7C] font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md hover:border-[#91C8E4] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Sign up with Google</span>
              </button>

              {/* Login Link - Mobile */}
              <div className="text-center mt-6 sm:hidden">
                <span className="text-[#4682A9] text-sm">Already have an account? </span>
                <Link href="/doctor/login" className="text-[#4682A9] hover:text-[#749BC2] font-semibold text-sm transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignupPage;