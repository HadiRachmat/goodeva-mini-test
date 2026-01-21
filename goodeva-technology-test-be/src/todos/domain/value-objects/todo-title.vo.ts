import { DomainValidationError } from '../errors/domain-validation.error';

export class TodoTitle {
  private constructor(private readonly _value: string) {}

  static create(value: string): TodoTitle {
    if (typeof value !== 'string') {
      throw new DomainValidationError('Title harus string');
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new DomainValidationError('Title tidak boleh kosong');
    }
    if (trimmed.length > 255) {
      throw new DomainValidationError('Title maksimal 255 karakter');
    }
    return new TodoTitle(trimmed);
  }

  get value(): string {
    return this._value;
  }
}
