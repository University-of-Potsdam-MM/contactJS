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
			var list = new Array();
			if(_conditionList instanceof Array){
				list = _conditionList;
			} else if (Class.isA(ConditionList, _conditionList)) {
				list = _conditionList.getItems();
			}
			for(var i in list){
				var condition = list[i];
				if(Class.isA( Condition, condition )){
					this.items[condition.getName()] = condition;
					this.counter++;
				}
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
			if(Class.isA(Condition, _condition)){
				if(!(this.containsKey(_condition.getName()))){
					this.counter++;
				}
				this.items[_condition.getName()] = _condition;
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
			var list = new Array();
			if(_conditionList instanceof Array){
				list = _conditionList;
			} else if (Class.isA(ConditionList, _conditionList)) {
				list = _conditionList.getItems();
			}
			for(var i in list){
				var condition = list[i];
				if(Class.isA(Condition, condition)){
					if(!(this.containsKey(condition.getName()))){
						this.counter++;
					}
					this.items[condition.getName()] = condition;
				}
			}
		},

		/**
		 * Verifies whether the given item is included
		 * in this list.
		 * 
		 * @public
		 * @alias contains
		 * @memberof ConditionList#
		 * @param {Condition} _item Condition that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_item){
			if(Class.isA(Condition,_item)){
				var tmp = this.getItem(_item.getName());
				if(!(typeof tmp === 'undefined') && tmp.equals(_item)){
					return true;
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
		 * @param {ConditionList} _list ConditionList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_list){
			if(Class.isA(ConditionList,_list) && _list.size() == this.size()){
				var items = _list.getItems();
				for(var i in items){
					var item = items[i];
					if(!this.contains(item)){
						return false;
					}
				}
				return true;
			} 
			return false;
		},



	});

	return ConditionList;
});