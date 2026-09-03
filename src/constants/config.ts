export const Config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  useMockData: true,
  mockNetworkDelayMs: 400,
  devOtp: '123456',
  otpResendSeconds: 300,
  currencySymbol: 'Rs.',
  supportEmail: 'support@spacz.com',
} as const;
