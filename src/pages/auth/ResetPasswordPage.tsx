import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Truck, Shield, RotateCcw, Headphones, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input } from '@/components/ui/index.ts';
import { cn } from '@/utils/index.ts';
import { resetPasswordSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/index.ts';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, locale, direction } = useLocale();
  const { changePassword } = useAuth();

  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!token) {
    return (
      <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4', direction === 'rtl' && 'rtl')}>
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        newErrors[key] = messages?.[0] || 'Invalid value';
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // In real app, would call Firebase updatePassword with token
      await new Promise(r => setTimeout(r, 1000));
      toast.success(t('auth.passwordResetSuccess'));
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4', direction === 'rtl' && 'rtl')}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Dokkan</span>
          </Link>
          <Link to="/login" className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.resetPassword')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auth.setNewPassword') || 'Enter your new password below'}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label={t('auth.newPassword')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                placeholder={t('auth.newPassword')}
                error={errors.password}
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Password must contain:</p>
              <ul className="space-y-2">
                {[
                  { label: 'At least 8 characters', met: password.length >= 8 },
                  { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                  { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                  { label: 'Number', met: /[0-9]/.test(password) },
                  { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
                ].map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 text-gray-300 flex-shrink-0">○</span>
                    )}
                    <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <Input
                label={t('auth.confirmNewPassword')}
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                placeholder={t('auth.confirmNewPassword')}
                error={errors.confirmPassword}
                required
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
            </div>

            {errors.form && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'Resetting...' : t('auth.resetPassword')}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.passwordResetSuccess')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('auth.passwordChanged') || 'Your password has been reset successfully'}</p>
            <Link to="/login">
              <Button className="w-full">{t('auth.backToLogin')}</Button>
            </Link>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-4 gap-4 text-center">
          {[
            { icon: Truck, label: 'Fast Delivery' },
            { icon: Shield, label: 'Secure Payment' },
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Headphones, label: '24/7 Support' },
          ].map((item, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <item.icon className="w-5 h-5 mx-auto mb-1 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}