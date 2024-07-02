import { CreateBadgeCommand } from '../../../../../src/app/modules/badge/commands/create_badge_command';

describe('CreateBadgeCommand', () => {
  let command: CreateBadgeCommand;

	beforeEach(() => {
		command = new CreateBadgeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('createBadge');
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
