import { ClaimBadgeCommand } from '../../../../../src/app/modules/badge/commands/claim_badge_command';

describe('ClaimBadgeCommand', () => {
    let command: ClaimBadgeCommand;

    beforeEach(() => {
        command = new ClaimBadgeCommand();
    });

    describe('constructor', () => {
        it('should have valid name', () => {
            expect(command.name).toBe('claimBadge');
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
