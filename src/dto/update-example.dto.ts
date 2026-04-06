import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExampleDto {
  @ApiProperty({ description: 'Resource title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Resource description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Resource status',
    enum: ['draft', 'active', 'archived'],
    required: false,
  })
  @IsEnum(['draft', 'active', 'archived'])
  @IsOptional()
  status?: string;
}
