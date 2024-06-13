import { ValidateFeatureCommand } from '../../../../../src/app/modules/identity/commands/validate_feature_command';

describe('ValidateFeatureCommand', () => {
  let command: ValidateFeatureCommand;

	beforeEach(() => {
		command = new ValidateFeatureCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('validateFeature');
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
