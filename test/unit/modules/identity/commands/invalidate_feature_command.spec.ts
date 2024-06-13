import { InvalidateFeatureCommand } from '../../../../../src/app/modules/identity/commands/invalidate_feature_command';

describe('InvalidateFeatureCommand', () => {
  let command: InvalidateFeatureCommand;

	beforeEach(() => {
		command = new InvalidateFeatureCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('invalidateFeature');
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
