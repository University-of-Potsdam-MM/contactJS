/**
 * This module represents an interface for ConditionMethod. 
 * 
 * @module ConditionMethod
 * @fileOverview
 */
define(function() {
	return (function() {
		/**
		 * @interface
		 * @class ConditionMethod
		 * @classdesc This interface defines the interface for conditionMethod.
		 */
		function ConditionMethod() {

			return this;
		}

		/**
		 * Processes the method.
		 *
		 * @param {*} reference Comparison value, if one is required.
		 * @param {*} firstValue Value (from an attribute) that should be compared.
		 * @param {*} secondValue Value (from an attribute) for comparison, if one is required.
		 */
		ConditionMethod.prototype.process = function(reference, firstValue, secondValue) {
			new Error("Abstract function call!");
		};

		return ConditionMethod;
	});
});