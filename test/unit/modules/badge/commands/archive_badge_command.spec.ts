import { ArchiveBadgeCommand } from '../../../../../src/app/modules/badge/commands/archive_badge_command';

describe('ArchiveBadgeCommand', () => {
  let command: ArchiveBadgeCommand;

	beforeEach(() => {
		command = new ArchiveBadgeCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('archiveBadge');
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
