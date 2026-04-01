import { PartialType } from '@nestjs/mapped-types';
import { CreateDeveloperProfileDto } from './create-developer-profile.dto';

export class UpdateDeveloperProfileDto extends PartialType(CreateDeveloperProfileDto) {}
