import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Lottie from 'lottie-react';
import successAnim from '../Lottie/success.json';
import LogoText from '../components/LogoText';
import rupeekLogo from '../assets/rupeek.png';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const { signup, loginWithGoogle: signupWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      navigate('/onboarding');
    }
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        createdAt: serverTimestamp(),
        isOnboarded: false // Flag to track if user has completed onboarding
      });

      handleSuccess();

    } catch (err) {
      setError('Failed to create an account: ' + err.message);
      setLoading(false);
    }
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    setCountdown(5);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 text-center space-y-6 animate-in zoom-in duration-300 border border-border">
          <div className="w-48 h-48 mx-auto">
            <Lottie animationData={successAnim} loop={false} />
          </div>
          <h2 className="text-3xl font-bold text-primary">Account Created!</h2>
          <p className="text-muted-foreground text-lg">
            Welcome to the <LogoText /> family.
          </p>
          <div className="text-sm font-medium text-muted-foreground bg-muted/50 py-2 px-4 rounded-full inline-block">
            Redirecting in <span className="text-primary font-bold text-lg">{countdown}</span> seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Right Side - Illustration/Brand (Swapped for variety) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 relative items-center justify-center p-12 overflow-hidden order-last">
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/20 to-blue-600/20" />
        <div className="relative z-10 max-w-lg space-y-8 text-right">
          <div className="flex items-center justify-end gap-3 mb-8">
            <LogoText className="text-3xl" />
            <img src={rupeekLogo} alt="Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Join the Revolution. <br /> Take Control.
          </h1>
          <p className="text-xl text-muted-foreground">
            Create your account today and experience the most intuitive financial tracking platform available.
          </p>
          <div className="flex flex-col gap-4 items-end pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              Free Forever <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              Bank-Grade Security <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        {/* Background decoration for form side using gradient from index.css essentially */}

        <div className="mx-auto w-full max-w-lg lg:w-[34rem] space-y-10 bg-card/80 backdrop-blur-md px-12 py-16 rounded-3xl shadow-2xl border border-border/50">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="space-y-4">
              <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-2"
                onClick={async () => {
                  try {
                    setError('');
                    setLoading(true);
                    await signupWithGoogle(); // Assuming signupWithGoogle maps to loginWithGoogle in AuthContext, or I should just use loginWithGoogle
                    handleSuccess();
                  } catch (err) {
                    setError('Failed to sign up with Google: ' + err.message);
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.47 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}