/**
 * This module represents the conditionMethod UnEquals.
 * 
 * @module Condition
 */
define(['conditionMethod'], function(ConditionMethod){
	return (function() {
		/**
		 * @implements {ConditionMethod}
		 * @classdesc This class is the conditionMethod equals. It compares the values of two attributes.
		 * @constructs UnEquals
		 */
		function UnEquals() {
			ConditionMethod.call(this);

			return this;
		}

		UnEquals.prototype = Object.create(ConditionMethod.prototype);

		/**
		 * Processes the equation.
		 *
		 * @param {*} reference Is not used.
		 * @param {*} firstValue Value (from an attribute) that should be compared.
		 * @param {*} secondValue Value (from an attribute) for comparison.
		 * @returns {boolean}
		 */
		UnEquals.prototype.process = function(reference, firstValue, secondValue){
			return firstValue !== secondValue;
		};

		return UnEquals;
	})();
});