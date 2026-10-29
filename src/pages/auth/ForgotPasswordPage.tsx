import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Truck, Shield, RotateCcw, Headphones, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { Button, Input } from '@/components/ui/index.ts';
import { cn } from '@/utils/index.ts';
import { forgotPasswordSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/index.ts';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t, locale, direction } = useLocale();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const result = forgotPasswordSchema.safeParse({ email });
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
      await resetPassword(email);
      toast.success(t('auth.passwordResetSent'));
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.forgotPassword')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auth.resetPasswordDesc') || 'Enter your email and we\'ll send you a reset link'}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              placeholder={t('auth.email')}
              error={errors.email}
              required
              leftIcon={<Mail className="w-5 h-5" />}
            />

            {errors.form && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'Sending...' : t('auth.resetPassword')}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.checkEmail') || 'Check your email'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t('auth.resetLinkSent') || 'We\'ve sent a password reset link to'}
              <br />
              <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              {t('auth.checkSpam') || 'Check your spam folder if you don\'t see it'}
            </p>
            <Button onClick={() => { setSubmitted(false); setEmail(''); }} variant="outline" className="w-full">
              {t('auth.resendEmail') || 'Resend email'}
            </Button>
            <Link to="/login" className="block text-center mt-4 text-primary-600 hover:text-primary-700">
              {t('auth.backToLogin') || 'Back to login'}
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