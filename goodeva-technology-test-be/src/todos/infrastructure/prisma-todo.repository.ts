/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Todos } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { TodoRepository } from '../domain/todo.repository';
import { Todo } from '../domain/todo.entity';
import { TodoStatus } from '../domain/todo-status.enum';

@Injectable()
export class PrismaTodoRepository implements TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(search?: string): Promise<Todo[]> {
    const records: Todos[] = await this.prisma.todos.findMany({
      where: search
        ? {
            title: { contains: search, mode: 'insensitive' },
          }
        : undefined,
      orderBy: { created_at: 'desc' },
    });
    return records.map(
      (r) =>
        new Todo(
          r.id,
          r.title,
          r.status as TodoStatus,
          r.problem_desc,
          r.created_at,
          r.updated_at,
        ),
    );
  }

  async create(title: string): Promise<Todo> {
    const now = new Date();
    const record: Todos = await this.prisma.todos.create({
      data: {
        title,
        status: TodoStatus.CREATED,
        created_at: now,
        updated_at: now,
      },
    });
    return new Todo(
      record.id,
      record.title,
      record.status as TodoStatus,
      record.problem_desc,
      record.created_at,
      record.updated_at,
    );
  }

  async updateStatus(
    id: number,
    status: TodoStatus,
    problemDesc?: string | null,
  ): Promise<Todo> {
    let record: Todos;
    try {
      record = await this.prisma.todos.update({
        where: { id },
        data: {
          status,
          problem_desc:
            status === TodoStatus.PROBLEM ? (problemDesc ?? null) : null,
          updated_at: new Date(),
        },
      });
    } catch (err: unknown) {
      // Translate Prisma 'record not found' to 404
      if (
        err instanceof (Prisma as any).PrismaClientKnownRequestError &&
        (err as Prisma.PrismaClientKnownRequestError).code === 'P2025'
      ) {
        throw new NotFoundException(`Todo with id=${id} not found`);
      }
      throw err;
    }
    return new Todo(
      record.id,
      record.title,
      record.status as TodoStatus,
      record.problem_desc,
      record.created_at,
      record.updated_at,
    );
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.todos.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(`Todo with id=${id} not found`);
      }
      throw err;
    }
  }
}
