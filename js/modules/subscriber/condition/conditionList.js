/**
 * This module represents a ConditionList. It is a subclass of AbstractList.
 * 
 * @module ConditionList
 * @fileOverview
 */
define(['abstractList', 'condition'], function(AbstractList, Condition){
	return (function() {
		/**
		 * @class ConditionList
		 * @classdesc This class represents a list for Conditions.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Condition
		 */
		function ConditionList() {
			AbstractList.call(this);

			this._type = Condition;

			return this;
		}

		ConditionList.prototype = Object.create(AbstractList.prototype);
		ConditionList.prototype.constructor = ConditionList;

		return ConditionList;
	})();
});