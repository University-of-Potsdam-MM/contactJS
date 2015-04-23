/**
 * This module represents an CallbackList. It is a subclass of AbstractList.
 * 
 * @module CallbackList
 * @fileOverview
 */
define(['easejs', 'abstractList', 'callback'],
 	function(easejs, AbstractList, Callback){
 	var Class = easejs.Class;
 	
 	/**
	 * @class CallbackList
	 * @classdesc This class represents a list for Callback.
	 * @extends AbstractList
	 * @requires easejs
	 * @requires AbstractList
	 * @requires Callback
	 */
	var CallbackList = Class('CallbackList').extend(AbstractList,{
		/**
		 * @alias counter
		 * @protected
		 * @type {integer}
		 * @memberof CallbackList#
		 * @desc Number of items.
		 */
		'protected counter' : 0,
		/**
		 * @alias items
		 * @protected
		 * @type {CallbackList}
		 * @memberof CallbackList#
		 * @desc ItemList.
		 */
		'protected items' : [],
		
		/**
		 * Builder for item list.
		 * 
		 * @public
		 * @alias withItems
		 * @memberof CallbackList#
		 * @param {(CallbackList|Array)} _callbackList CallbackList
		 * @returns {CallbackList}
		 */
		'public withItems': function(_callbackList){
			if (_callbackList instanceof Array) {
				this.items = _callbackList;
			} else if (Class.isA(CallbackList, _callbackList)) {
				this.items = _callbackList.getItems();
			}
			return this;
		},

		/**
		 * Adds the specified item to the itemList.
		 * 
		 * @public
		 * @alias put
		 * @memberof CallbackList#
		 * @param {Callback} _callback Callback
		 */
		'public put' : function(_callback){
			if (Class.isA(Callback, _callback)) {
				if (!(this.contains(_callback))) {
					this.items.push(_callback);
				}
			}
		},

		/**
		 * Adds all items in the specified list to this
		 * itemList
		 * 
		 * @public
		 * @alias putAll
		 * @memberof CallbackList#
		 * @param {(CallbackList|Array)} _callbackList CallbackList
		 */
		'public putAll' : function(_callbackList){
			var list = [];
			if (_callbackList instanceof Array) {
				list = _callbackList;
			} else if (Class.isA(CallbackList,	_callbackList)) {
				list = _callbackList.getItems();
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
		 * @memberof CallbackList#
		 * @param {Callback} _callback CallbackType that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_callback){
			if (Class.isA(Callback, _callback)) {
				for (var index in this.items) {
					var tmp = this.items[index];
					if (tmp.equals(_callback)) {
						return true;
					}
				}
			}
			return false;
		},
		
		/**
		 * Compare the specified CallbackList with this instance.
		 * @public
		 * @alias equals
		 * @memberof CallbackList#
		 * @param {CallbackList} _callbackList CallbackList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_callbackList){
			if (Class.isA(CallbackList, _callbackList) && _callbackList.size() == this.size()) {
				for (var index in _callbackList.getItems()) {
					var theCallback = _callbackList.getItems()[index];
					if (!this.contains(theCallback)) return false;
				}
				return true;
			}
			return false;
		}

	});

	return CallbackList;
});