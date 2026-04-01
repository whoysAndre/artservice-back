import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface FindOrCreateInput {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate({ googleId, email, name, picture }: FindOrCreateInput) {
    const existing = await this.prisma.user.findUnique({ where: { googleId } });
    if (existing) return existing;

    return this.prisma.user.create({
      data: { googleId, email, name, picture },
    });
  }

  async updateRole(id: string, role: Roles) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
