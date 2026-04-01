import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private async getProfileOrFail(userId: string) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Crea tu perfil de developer primero');
    return profile;
  }

  async create(userId: string, dto: CreatePortfolioProjectDto, imageBuffer?: Buffer) {
    const profile = await this.getProfileOrFail(userId);

    let imageUrl: string | undefined;
    if (imageBuffer) {
      imageUrl = await this.cloudinary.uploadFromBuffer(imageBuffer, 'artservice/portfolio');
    }

    return this.prisma.portfolioProject.create({
      data: { developerProfileId: profile.id, imageUrl, ...dto },
    });
  }

  async remove(userId: string, projectId: string) {
    const profile = await this.getProfileOrFail(userId);

    const project = await this.prisma.portfolioProject.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');
    if (project.developerProfileId !== profile.id) throw new ForbiddenException();

    return this.prisma.portfolioProject.delete({ where: { id: projectId } });
  }
}
