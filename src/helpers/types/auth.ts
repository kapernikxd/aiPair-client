export type LoginParams = {
    email: string;
    password: string;
};

export type RegistrationParams = {
    name: string;
    lastname: string;
    email: string;
    password: string;
};

export type ParamsVerificateEmail = {
  verificationCode: string;
  email: string;
};

export type NewPasswordParams = {
  password: string;
  activatedLink: string;
};