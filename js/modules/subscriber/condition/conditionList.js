define(['abstractList', 'condition'], function(AbstractList, Condition){
	return (function() {
		/**
		 * @classdesc This class represents a list for Conditions.
		 * @constructs ConditionList
		 * @extends AbstractList
		 */
		function ConditionList() {
			AbstractList.call(this);

			/**
			 * @type {Condition}
			 * @private
			 */
			this._type = Condition;

			return this;
		}

		ConditionList.prototype = Object.create(AbstractList.prototype);
		ConditionList.prototype.constructor = ConditionList;

		return ConditionList;
	})();
});