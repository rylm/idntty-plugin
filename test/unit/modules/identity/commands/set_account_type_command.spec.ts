import { SetAccountTypeCommand } from '../../../../../src/app/modules/identity/commands/set_account_type_command';

describe('SetAccountTypeCommand', () => {
  let command: SetAccountTypeCommand;

	beforeEach(() => {
		command = new SetAccountTypeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('setAccountType');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('execute', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
