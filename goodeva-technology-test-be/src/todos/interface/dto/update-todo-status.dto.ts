/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

const allowedStatuses = [
  'created',
  'completed',
  'on_going',
  'problem',
] as const;
export type AllowedStatus = (typeof allowedStatuses)[number];

export class UpdateTodoStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(allowedStatuses as unknown as string[])
  status!: AllowedStatus;

  @ValidateIf((o) => o.status === 'problem')
  @IsString()
  @IsOptional()
  problem_desc?: string;
}
