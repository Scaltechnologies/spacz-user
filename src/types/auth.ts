export interface OtpRequestResult {
  phoneNumber: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResult {
  isNewUser: boolean;
  token: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  dateOfBirth: string;
  aspiringFor: string[];
}
