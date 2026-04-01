import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, developerProfileId: string, dto: CreateReviewDto) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { id: developerProfileId },
    });

    if (!profile) throw new NotFoundException('Perfil de developer no encontrado');

    const existing = await this.prisma.review.findUnique({
      where: { customerId_developerProfileId: { customerId, developerProfileId } },
    });

    if (existing) throw new ConflictException('Ya dejaste una reseña para este developer');

    return this.prisma.review.create({
      data: { customerId, developerProfileId, ...dto },
    });
  }

  findByProfile(developerProfileId: string) {
    return this.prisma.review.findMany({
      where: { developerProfileId },
      include: { customer: { select: { name: true, picture: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
