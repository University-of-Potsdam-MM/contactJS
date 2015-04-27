/**
 * This module represents the conditionMethod UnEquals. 
 * 
 * @module UnEquals
 * @fileOverview
 */
define(['easejs', 'conditionMethod'],
 	function(easejs, ConditionMethod){
 	var Class = easejs.Class;
 	/**
	 * @class UnEquals
	 * @implements {ConditionMethod}
	 * @classdesc This class is the conditionMethod unequals. 
	 * 			  It compares the values of two attributes.
	 * @requires easejs
	 * @requires conditionMethod
	 */
	var UnEquals = Class('UnEquals').implement( ConditionMethod ).extend(
	{
		/**
		 * Processes the equation.
		 * 
		 * @public
		 * @alias process
		 * @memberof UnEquals#
		 * @param {*} reference Is not used.
		 * @param {*} firstValue Value (from an attribute) that should be compared.
		 * @param {*} secondValue Value (from an attribute) for comparison.
		 * @returns {boolean}
		 */
		'public process': function( reference, firstValue, secondValue){
			if(firstValue !== secondValue){
				return true;
			}
			return false;
		},
		
		});

	return UnEquals;
});