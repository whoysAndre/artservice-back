import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DeveloperProfileModule } from './modules/developer-profile/developer-profile.module';
import { ContactModule } from './modules/contact/contact.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    DeveloperProfileModule,
    ContactModule,
    ReviewsModule,
    PortfolioModule,
  ],
})
export class AppModule {}
