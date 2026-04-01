import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDeveloperDto } from './dto/contact-developer.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RESEND') private readonly resend: Resend,
  ) {}

  async contactDeveloper(
    developerProfileId: string,
    customer: { name: string; email: string },
    dto: ContactDeveloperDto,
  ) {
    const profile = await this.prisma.developerProfile.findUnique({
      where: { id: developerProfileId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!profile) {
      throw new NotFoundException('Perfil de developer no encontrado');
    }

    const emailPayload = {
      from: 'ArtService <artservice@resend.dev>',
      to: profile.user.email,
      subject: `${customer.name} quiere contactarte`,
      html: `
        <h2>Tienes un nuevo mensaje de un cliente</h2>
        <p><strong>Nombre:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${dto.message}</p>
      `,
    };

    const result = await this.resend.emails.send(emailPayload);

    if (result.error) {
      console.warn('[ContactService] Resend could not deliver the email — logging instead:');
      console.log(emailPayload);
    }

    return { success: true };
  }
}
