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
	var CallbackList = Class('CallbackList').
					extend(AbstractList,{

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
			var list = [];
			if(_callbackList instanceof Array){
				list = _callbackList;
			} else if (Class.isA(CallbackList, _callbackList)) {
				list = _callbackList.getItems();
			}
			for(var i in list){
				var callback = list[i];
				if(Class.isA( Callback, callback )){
					this.items[callback.getName()] = callback;
					this.counter++;
				}
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
			if(Class.isA(Callback, _callback)){
				if(!(this.containsKey(_callback.getName()))){
					this.counter++;
				}
				this.items[_callback.getName()] = _callback;
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
			if(_callbackList instanceof Array){
				list = _callbackList;
			} else if (Class.isA(CallbackList, _callbackList)) {
				list = _callbackList.getItems();
			}
			for(var i in list){
				var callback = list[i];
				if(Class.isA(Callback, callback)){
					if(!(this.containsKey(callback.getName()))){
						this.counter++;
					}
					this.items[callback.getName()] = callback;
				}
			}
		},

		/**
		 * Verifies whether the given item is included
		 * in this list.
		 * 
		 * @public
		 * @alias contains
		 * @memberof CallbackList#
		 * @param {Callback} _item CallbackType that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_item){
			if(Class.isA(Callback,_item)){
				var tmp = this.getItem(_item.getName());
				if(!(typeof tmp === 'undefined') && tmp.equals(_item)){
					return true;
				}
			} 
			return false;
		},
		
		/**
		 * Compare the specified CallbackList with this instance.
		 * @public
		 * @alias equals
		 * @memberof CallbackList#
		 * @param {CallbackList} _list CallbackList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_list){
			if(Class.isA(CallbackList,_list) && _list.size() == this.size()){
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
		}

	});

	return CallbackList;
});