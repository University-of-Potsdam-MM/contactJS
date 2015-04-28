/**
 * This module represents a ConditionList. It is a subclass of AbstractList.
 * 
 * @module ConditionList
 * @fileOverview
 */
define(['easejs','abstractList', 'condition'],
 	function(easejs, AbstractList, Condition){
 	var Class = easejs.Class;
 	/**
	 * @class ConditionList
	 * @classdesc This class represents a list for Conditions.
	 * @extends AbstractList
	 * @requires easejs
	 * @requires AbstractList
	 * @requires Condition
	 */
	var ConditionList = Class('ConditionList').
						extend(AbstractList,{

		/**
		* @alias counter
		* @protected
		* @type {integer}
		* @memberof ConditionList#
		* @desc Number of items.
		*/
		'protected counter' : 0,
		/**
		 * @alias items
		 * @protected
		 * @type {ConditioList}
		 * @memberof ConditionList#
		 * @desc ItemList
		 */
		'protected items' : [],
		
		/**
		 * Builder for item list.
		 * 
		 * @public
		 * @alias withItems
		 * @memberof ConditionList#
		 * @param {(ConditionList|Array)} _conditionList ConditionList
		 * @returns {ConditionList}
		 */
		'public withItems': function(_conditionList){
			if (_conditionList instanceof Array) {
				this.items = _conditionList;
			} else if (Class.isA(ConditionList, _conditionList)) {
				this.items = _conditionList.getItems();
			}
			return this;
		},		

		/**
		 * Adds the specified item to the item list.
		 * 
		 * @public
		 * @alias put
		 * @memberof ConditionList#
		 * @param {Condition} _condition Condition
		 */
		'public put' : function(_condition){
			if (Class.isA(Condition, _condition)) {
				if (!(this.contains(_condition))) {
					this.items.push(_condition);}
			}
		},

		/**
		 * Adds all items in the specified list to the
		 * item list.
		 * 
		 * @public
		 * @alias putAll
		 * @memberof ConditionList#
		 * @param {(ConditioneList|Array)} _conditionList ConditionList
		 */
		'public putAll' : function(_conditionList){
			var list = [];
			if (_conditionList instanceof Array) {
				list = _conditionList;
			} else if (Class.isA(ConditionList,	_conditionList)) {
				list = _conditionList.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		},

		/**
		 * Verifies whether the given item is included
		 * in this list.
		 * 
		 * @public
		 * @alias contains
		 * @memberof ConditionList#
		 * @param {Condition} _condition Condition that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_condition){
			if (Class.isA(Condition, _condition)) {
				for (var index in this.items) {
					var theCondition = this.items[index];
					if (theCondition.equals(_condition)) {
						return true;
					}
				}
			}
			return false;
		},
		
		/**
		 * Compare the specified AttributeTypeList with this instance.
		 * 
		 * @public
		 * @alias equals
		 * @memberof ConditionList#
		 * @param {ConditionList} _conditionList ConditionList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_conditionList){
			if (Class.isA(ConditionList, _conditionList) && _conditionList.size() == this.size()) {
				for (var index in _conditionList.getItems()) {
					var theCondition = _conditionList.getItems()[index];
					if (!this.contains(theCondition)) return false;
				}
				return true;
			}
			return false;
		}

	});

	return ConditionList;
});