const AUTH_URL = 'https://functions.poehali.dev/a40b86ad-5982-4dd5-b408-69b4c69e701c';

async function callAuth(body: Record<string, unknown>, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;
  const res = await fetch(AUTH_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  return res.json();
}

export const api = {
  sendOtp: (phone: string) => callAuth({ action: 'send_otp', phone }),
  verifyOtp: (phone: string, code: string, name?: string) => callAuth({ action: 'verify_otp', phone, code, name }),
  getMe: (token: string) => callAuth({ action: 'me' }, token),
  updateProfile: (token: string, data: { name: string; bio: string; username?: string }) =>
    callAuth({ action: 'update_profile', ...data }, token),
  logout: (token: string) => callAuth({ action: 'logout' }, token),
};
