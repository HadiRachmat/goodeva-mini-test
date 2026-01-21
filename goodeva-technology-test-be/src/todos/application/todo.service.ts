import { BadRequestException, Injectable } from '@nestjs/common';
import { TodoRepository } from '../domain/todo.repository';
import { Todo } from '../domain/todo.entity';
// import { TodoStatus } from '../domain/todo-status.enum';
import { TodoTitle } from '../domain/value-objects/todo-title.vo';
import {
  TodoStatusVO,
  StatusInput,
} from '../domain/value-objects/todo-status.vo';
import { DomainValidationError } from '../domain/errors/domain-validation.error';

@Injectable()
export class TodoService {
  constructor(private readonly repo: TodoRepository) {}

  async list(search?: string): Promise<Todo[]> {
    return this.repo.findMany(search);
  }

  async create(title: string): Promise<Todo> {
    try {
      const titleVO = TodoTitle.create(title);
      return await this.repo.create(titleVO.value);
    } catch (e) {
      if (e instanceof DomainValidationError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  async updateStatus(
    id: number,
    statusInput: StatusInput,
    problemDesc?: string,
  ): Promise<Todo> {
    try {
      const statusVO = TodoStatusVO.from(statusInput);
      return await this.repo.updateStatus(id, statusVO.value, problemDesc);
    } catch (e) {
      if (e instanceof DomainValidationError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
