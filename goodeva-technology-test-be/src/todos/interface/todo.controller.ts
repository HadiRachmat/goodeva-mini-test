import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { TodoService } from '../application/todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly service: TodoService) {}

  @Get()
  async findMany(@Query('search') search?: string) {
    return this.service.list(search);
  }

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    return this.service.create(dto.title);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status, dto.problem_desc);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
