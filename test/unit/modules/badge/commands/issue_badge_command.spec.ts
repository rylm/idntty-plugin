import { IssueBadgeCommand } from '../../../../../src/app/modules/badge/commands/issue_badge_command';

describe('IssueBadgeCommand', () => {
  let command: IssueBadgeCommand;

	beforeEach(() => {
		command = new IssueBadgeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('issueBadge');
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
