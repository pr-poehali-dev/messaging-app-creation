import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

interface LoginScreenProps {
  onLogin: (token: string, user: User) => void;
}

export interface User {
  id: number;
  phone: string;
  name: string;
  username: string | null;
  avatar_color: string;
  bio: string;
}

type Step = 'phone' | 'otp' | 'name';

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('7') || digits.startsWith('8')) {
      const d = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
      const p = d.slice(1);
      let result = '+7';
      if (p.length > 0) result += ' (' + p.slice(0, 3);
      if (p.length >= 3) result += ') ' + p.slice(3, 6);
      if (p.length >= 6) result += '-' + p.slice(6, 8);
      if (p.length >= 8) result += '-' + p.slice(8, 10);
      return result;
    }
    return '+' + digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPhone(raw);
    setError('');
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return setError('Введите номер телефона');
    setLoading(true);
    setError('');
    try {
      const res = await api.sendOtp(phone);
      if (res.error) return setError(res.error);
      setDemoCode(res.demo_code || '');
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError('Ошибка сети. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      setTimeout(() => handleVerifyOtp(pasted), 50);
    }
  };

  const handleVerifyOtp = async (code?: string) => {
    const finalCode = code || otp.join('');
    if (finalCode.length < 6) return setError('Введите все 6 цифр');
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyOtp(phone, finalCode);
      if (res.error) {
        setError(res.error);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }
      setVerifiedToken(res.token);
      setVerifiedUser(res.user);
      if (res.is_new) {
        setStep('name');
      } else {
        onLogin(res.token, res.user);
      }
    } catch {
      setError('Ошибка сети. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!name.trim()) return setError('Введите ваше имя');
    setLoading(true);
    try {
      const res = await api.updateProfile(verifiedToken, { name: name.trim(), bio: '' });
      onLogin(verifiedToken, res.user || verifiedUser!);
    } catch {
      onLogin(verifiedToken, { ...verifiedUser!, name: name.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full opacity-[0.08] blur-3xl animate-float" style={{ background: '#8B5CF6' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.05] blur-3xl" style={{ background: '#22D3EE' }} />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full opacity-[0.04] blur-3xl" style={{ background: '#EC4899' }} />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-purple to-neon-cyan mx-auto mb-4 flex items-center justify-center neon-glow animate-float">
            <span className="text-white font-golos font-black text-4xl">N</span>
          </div>
          <h1 className="text-3xl font-black font-golos gradient-text">NeoChat</h1>
          <p className="text-white/35 text-sm font-rubik mt-1">Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-7 gradient-border animate-scale-in">

          {/* STEP: PHONE */}
          {step === 'phone' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold font-golos text-white mb-1">Войти</h2>
                <p className="text-white/40 text-sm font-rubik">Введите номер телефона для входа</p>
              </div>

              <div>
                <label className="text-xs text-white/40 font-rubik mb-2 block">Номер телефона</label>
                <div className={`flex items-center gap-3 glass rounded-2xl px-4 py-3.5 border transition-all ${error ? 'border-red-500/50' : 'border-white/8 focus-within:border-neon-purple/50'}`}>
                  <span className="text-xl">🇷🇺</span>
                  <input
                    ref={phoneRef}
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                    placeholder="+7 (999) 123-45-67"
                    className="flex-1 bg-transparent text-white font-rubik text-base focus:outline-none placeholder-white/20"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-rubik mt-2">{error}</p>}
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || !phone.trim()}
                className={`w-full py-4 rounded-2xl font-bold font-rubik text-white transition-all ${
                  loading || !phone.trim()
                    ? 'bg-white/10 text-white/30'
                    : 'bg-gradient-to-r from-neon-purple to-neon-cyan neon-glow hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader" size={16} className="animate-spin" />
                    Отправляю...
                  </span>
                ) : 'Получить код →'}
              </button>

              <p className="text-center text-xs text-white/20 font-rubik">
                Нажимая кнопку, вы принимаете условия использования
              </p>
            </div>
          )}

          {/* STEP: OTP */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div>
                <button onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }} className="flex items-center gap-1 text-white/40 hover:text-white text-sm font-rubik mb-3 transition-colors">
                  <Icon name="ArrowLeft" size={14} />
                  Назад
                </button>
                <h2 className="text-xl font-bold font-golos text-white mb-1">Введите код</h2>
                <p className="text-white/40 text-sm font-rubik">
                  Отправили код на <span className="text-neon-cyan">{phone}</span>
                </p>
              </div>

              {/* Demo code hint */}
              {demoCode && (
                <div className="glass rounded-2xl px-4 py-3 border border-neon-cyan/20 flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <p className="text-xs text-white/40 font-rubik">Демо-режим: ваш код</p>
                    <p className="text-neon-cyan font-golos font-black text-xl tracking-widest">{demoCode}</p>
                  </div>
                  <button
                    onClick={() => {
                      const digits = demoCode.split('');
                      setOtp(digits);
                      setTimeout(() => handleVerifyOtp(demoCode), 50);
                    }}
                    className="ml-auto text-xs text-neon-purple hover:text-white transition-colors font-rubik"
                  >
                    Вставить
                  </button>
                </div>
              )}

              {/* OTP inputs */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    className={`w-12 h-14 text-center text-xl font-black font-golos glass rounded-2xl border transition-all focus:outline-none ${
                      digit ? 'border-neon-purple/60 text-neon-purple' : 'border-white/10 text-white'
                    } focus:border-neon-purple/80`}
                  />
                ))}
              </div>

              {error && <p className="text-red-400 text-xs font-rubik text-center">{error}</p>}

              <button
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.join('').length < 6}
                className={`w-full py-4 rounded-2xl font-bold font-rubik text-white transition-all ${
                  loading || otp.join('').length < 6
                    ? 'bg-white/10 text-white/30'
                    : 'bg-gradient-to-r from-neon-purple to-neon-cyan neon-glow hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader" size={16} className="animate-spin" />
                    Проверяю...
                  </span>
                ) : 'Войти'}
              </button>

              <p className="text-center text-xs text-white/30 font-rubik">
                {countdown > 0
                  ? `Отправить повторно через ${countdown} сек`
                  : <button onClick={handleSendOtp} className="text-neon-purple hover:text-white transition-colors">Отправить код повторно</button>
                }
              </p>
            </div>
          )}

          {/* STEP: NAME (new user) */}
          {step === 'name' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan mx-auto mb-3 flex items-center justify-center neon-glow">
                  <Icon name="UserPlus" size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold font-golos text-white mb-1">Добро пожаловать!</h2>
                <p className="text-white/40 text-sm font-rubik">Как вас зовут?</p>
              </div>

              <div>
                <label className="text-xs text-white/40 font-rubik mb-2 block">Ваше имя</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSetName()}
                  placeholder="Например: Алексей Громов"
                  className={`w-full glass rounded-2xl px-4 py-3.5 border text-white font-rubik focus:outline-none transition-all ${error ? 'border-red-500/50' : 'border-white/8 focus:border-neon-purple/50'} placeholder-white/20`}
                />
                {error && <p className="text-red-400 text-xs font-rubik mt-2">{error}</p>}
              </div>

              <button
                onClick={handleSetName}
                disabled={loading || !name.trim()}
                className={`w-full py-4 rounded-2xl font-bold font-rubik text-white transition-all ${
                  loading || !name.trim()
                    ? 'bg-white/10 text-white/30'
                    : 'bg-gradient-to-r from-neon-purple to-neon-cyan neon-glow hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader" size={16} className="animate-spin" />
                    Сохраняю...
                  </span>
                ) : 'Начать общение 🚀'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/15 font-rubik mt-6">
          NeoChat v1.0 · Защищённое соединение 🔒
        </p>
      </div>
    </div>
  );
}
