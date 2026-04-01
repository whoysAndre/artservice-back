import { Provider } from '@nestjs/common';
import { Resend } from 'resend';
import { envs } from 'src/config';

export const ResendProvider: Provider = {
  provide: 'RESEND',
  useFactory: () => {
    return new Resend(envs.resendApiKey);
  },
};
