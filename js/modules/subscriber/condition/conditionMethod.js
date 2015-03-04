/**
 * This module represents an interface for ConditionMethod. 
 * 
 * @module ConditionMethod
 * @fileOverview
 */
define(['easejs'],
 	function(easejs){
 	var Interface = easejs.Interface;
 	/**
	 * @class ConditionMethod
	 * @classdesc This interface defines the interface for conditionMethod.
	 * @requires easejs
	 */
	var ConditionMethod = Interface('ConditionMethod',
	{
		
		/**
		 * Processes the method.
		 * .
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias process
		 * @memberof ConditionMethod#
		 * @param {*} reference Comparison value, if one is required.
		 * @param {*} firstValue Value (from an attribute) that should be compared. 
		 * @param {*} secondValue Value (from an attribute) for comparison, if one is required.
		 */
		'public process': ['reference', 'firstValue', 'secondValue'],
		
		});

	return ConditionMethod;
});