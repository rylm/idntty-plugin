import { AssignBadgeCommand } from '../../../../../src/app/modules/badge/commands/assign_badge_command';

describe('AssignBadgeCommand', () => {
  let command: AssignBadgeCommand;

	beforeEach(() => {
		command = new AssignBadgeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('assignBadge');
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
