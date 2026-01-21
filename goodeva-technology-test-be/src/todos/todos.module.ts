import { Module } from '@nestjs/common';
import { TodosController } from './interface/todo.controller';
import { TodoService } from './application/todo.service';
import { PrismaService } from '../infrastructure/prisma.service';
import { PrismaTodoRepository } from './infrastructure/prisma-todo.repository';
import { TodoRepository } from './domain/todo.repository';

@Module({
  controllers: [TodosController],
  providers: [
    TodoService,
    PrismaService,
    { provide: TodoRepository, useClass: PrismaTodoRepository },
  ],
})
export class TodosModule {}
