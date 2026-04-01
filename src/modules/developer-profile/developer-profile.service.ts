import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Specialty } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeveloperProfileDto } from './dto/create-developer-profile.dto';
import { SearchDeveloperDto } from './dto/search-developer.dto';
import { UpdateDeveloperProfileDto } from './dto/update-developer-profile.dto';

const USER_SELECT = { name: true, picture: true, email: true };

const PROFILE_INCLUDE_FULL = {
  user: { select: USER_SELECT },
  reviews: {
    include: { customer: { select: { name: true, picture: true } } },
    orderBy: { createdAt: 'desc' as const },
  },
  portfolioProjects: { orderBy: { createdAt: 'desc' as const } },
};

@Injectable()
export class DeveloperProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(userId: string, dto: CreateDeveloperProfileDto) {
    const existing = await this.prisma.developerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Ya tienes un perfil de developer creado');
    }

    return this.prisma.developerProfile.create({
      data: { userId, ...dto },
    });
  }

  async findAll({ specialty, page = 1, limit = 10 }: SearchDeveloperDto) {
    const where = specialty ? { specialties: { has: specialty as Specialty } } : undefined;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.developerProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: USER_SELECT },
          reviews: { select: { rating: true } },
        },
      }),
      this.prisma.developerProfile.count({ where }),
    ]);

    return {
      data: data.map((p) => ({
        ...p,
        averageRating: p.reviews.length
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : null,
        reviews: undefined,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE_FULL,
    });

    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const averageRating = profile.reviews.length
      ? profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length
      : null;

    return { ...profile, averageRating };
  }

  async findMe(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
      include: PROFILE_INCLUDE_FULL,
    });

    if (!profile) throw new NotFoundException('Perfil no encontrado');

    return profile;
  }

  async update(userId: string, dto: UpdateDeveloperProfileDto) {
    await this.findMe(userId);

    return this.prisma.developerProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async uploadPicture(userId: string, buffer: Buffer) {
    const url = await this.cloudinary.uploadFromBuffer(buffer, 'artservice/profiles');

    return this.prisma.user.update({
      where: { id: userId },
      data: { picture: url },
      select: { id: true, picture: true },
    });
  }
}
