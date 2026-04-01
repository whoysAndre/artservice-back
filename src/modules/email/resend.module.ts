import { Module } from '@nestjs/common';
import { ResendProvider } from './resend.provider';

@Module({
  providers: [ResendProvider],
  exports: [ResendProvider],
})
export class ResendModule {}
