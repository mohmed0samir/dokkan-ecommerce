import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { useLocale } from '@/hooks/index.ts';
import { useAuth } from '@/hooks/index.ts';
import { Button, Input } from '@/components/ui/index.ts';
import { cn, formatPrice } from '@/utils/index.ts';
import { registerSchema } from '../../utils/validation';
import { toast } from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const { t, locale, direction } = useLocale();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements = [
    { label: t('auth.passwordMinLength'), met: formData.password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Number', met: /[0-9]/.test(formData.password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const validateForm = () => {
    const result = registerSchema.safeParse(formData);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
      });
      toast.success(t('auth.registerSuccess'));
      navigate('/verify-email');
    } catch (error: any) {
      const message = error.message || t('auth.accountExists');
      toast.error(message);
      setErrors({ form: message });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.register')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auth.createAccount')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.fullName')}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t('auth.fullName')}
            error={errors.fullName}
            required
            leftIcon={<User className="w-5 h-5" />}
          />

          <Input
            label={t('auth.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('auth.email')}
            error={errors.email}
            required
            leftIcon={<Mail className="w-5 h-5" />}
          />

          <Input
            label={t('auth.phone')}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('auth.phone')}
            error={errors.phone}
            required
            leftIcon={<Phone className="w-5 h-5" />}
          />

          <div className="relative">
            <Input
              label={t('auth.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.password')}
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
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t('auth.passwordRequirements') || 'Password must contain:'}</p>
            <ul className="space-y-2">
              {passwordRequirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={cn(req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400')}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Input
              label={t('auth.confirmPassword')}
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('auth.confirmPassword')}
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

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              checked={formData.terms}
              onChange={e => { setFormData(prev => ({ ...prev, terms: e.target.checked })); setErrors(prev => ({ ...prev, terms: '' })); }}
              required
              className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.terms')} {' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">{t('footer.terms')}</Link>
              {' '} & {' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">{t('footer.privacy')}</Link>
            </label>
          </div>

          {errors.terms && (
            <p className="text-red-500 text-sm">{t('validation.required')}</p>
          )}

          {errors.form && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {errors.form}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>
        </form>

        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            {t('auth.signIn')}
          </Link>
        </p>

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