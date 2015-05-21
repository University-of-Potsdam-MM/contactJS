define(['conditionMethod'], function(ConditionMethod){
	return (function() {
		/**
		 * @implements {ConditionMethod}
		 * @classdesc This class is the conditionMethod equals. It compares the values of two attributes.
		 * @constructs Equals
		 */
		function Equals() {
			ConditionMethod.call(this);

			return this;
		}

		Equals.prototype = Object.create(ConditionMethod.prototype);

		/**
		 * Processes the equation.
		 *
		 * @param {*} reference Is not used.
		 * @param {*} firstValue Value (from an attribute) that should be compared.
		 * @param {*} secondValue Value (from an attribute) for comparison.
		 * @returns {Boolean}
		 */
		Equals.prototype.process = function(reference, firstValue, secondValue){
			return firstValue === secondValue;
		};

		return Equals;
	})();
});