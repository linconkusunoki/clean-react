import { Validation } from 'presentation/protocols/validation'

export class ValidationStub implements Validation {
  errorMessage = ''

  validate(): string {
    return this.errorMessage
  }
}
