import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Example entity — replace with your module's domain entities.
 *
 * IMPORTANT: Only include domain-specific properties here.
 * Extension properties (clientUID, projectId, etc.) are added
 * dynamically at boot time from config.yml — do NOT add them here.
 */

export type ExampleDocument = HydratedDocument<Example>;

@Schema({ timestamps: true })
export class Example {
  @ApiProperty({ description: 'Resource title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Resource description', required: false })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Creator identifier' })
  @Prop({ required: true })
  createdBy: string;

  @ApiProperty({ description: 'Resource status', enum: ['draft', 'active', 'archived'] })
  @Prop({ type: String, enum: ['draft', 'active', 'archived'], default: 'draft' })
  status: string;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
