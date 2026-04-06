import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExampleDto {
  @ApiProperty({ description: 'Resource title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Resource description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Creator identifier' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
