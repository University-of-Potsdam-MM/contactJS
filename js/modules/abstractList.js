/**
 * This module represents a List. 
 * It is an abstract Class.
 * 
 * @module AbstractList
 * @fileOverview
 */
define([ 'easejs' ], function(easejs) {
	var AbstractClass = easejs.AbstractClass;
	/**
	 * @class AbstractList
	 * @classdesc This class represents a list.
	 * @requires easejs
	 */
	var AbstractList = AbstractClass('AbstractList', {

		/**
		 * @alias counter
		 * @protected
		 * @type {int}
		 * @memberof AbstractList#
		 * @desc Number of Items.
		 */
		'protected counter' : 0,
		/**
		 * @alias items
		 * @protected
		 * @memberof AbstractList#
		 * @desc ItemList
		 */
		'protected items' : [],

		/**
		 * Builder for Item list.
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias withItems
		 * @memberof AbstractList#
		 * @param {*} list
		 * @returns {*}
		 */
		'abstract public withItems' : [ 'list' ],
		/**
		 * Adds the specified item to the itemList.
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias put
		 * @memberof AbstractList#
		 * @param {*} item item that shoud be added
		 */
		'abstract public put' : [ 'item' ],
		/**
		 * Adds all items in the specified list to the
		 * itemList.
		 *  
		 * @function
		 * @abstract
		 * @public
		 * @alias putAll
		 * @memberof AbstractList#
		 * @param {*} list list of items that should be added
		 */
		'abstract public putAll' : [ 'list' ],
		/**
		 * Verifies whether the given item is included
		 * in this list.
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias contains
		 * @memberof AbstractList#
		 * @param {*} item Item that should be checked.
		 * @returns {boolean}
		 */
		'abstract public contains' : [ 'item' ],
		/**
		 * Compare the specified WidgetHandleList with this instance.
		 * 
		 * @function
		 * @abstract
		 * @public
		 * @alias equals
		 * @memberof AbstractList#
		 * @param {*} list List that should be compared.
		 */
		'abstract public equals' : [ 'list' ],

		/**
		 * Verifies whether an item exists for the specified key.
		 * 
		 * @public
		 * @alias containsKey
		 * @memberof AbstractList#
		 * @param {string} _key Key that should be verified.
		 * @returns {boolean}
		 */
		'public containsKey' : function(_key) {
			return !!(typeof _key !== 'undefined' && typeof this.items[_key] !== 'undefined');
		},

		/**
		 * Returns the item for the specified key.
		 * @public
		 * @alias getItem
		 * @memberof AbstractList#
		 * @param {string} _key key that should be searched for
		 * @returns {*} 
		 */
		'virtual public getItem' : function(_key) {
			return this.items[_key];
		},

		/**
		 * Removes the item from this list for the specified key.
		 * @public
		 * @alias removeItem
		 * @memberof AbstractList#
		 * @param {string} _key key that should be searched for
		 */
		'public removeItem' : function(_key) {
			if (this.containsKey(_key)) {
				delete this.items[_key];				
				this.counter--;
			}
		},

		/**
		 * Returns the keys of all items.
		 * @public
		 * @alias getKeys
		 * @memberof AbstractList#
		 * @returns {Array}
		 */
		'public getKeys' : function() {
			var listKeys = new Array();
			for ( var key in this.items) {
				listKeys.push(key);
			}
			return listKeys;
		},

		/**
		 * Returns all items.
		 * @virtual
		 * @public
		 * @alias getItems
		 * @memberof AbstractList#
		 * @returns {Array}
		 */
		'virtual public getItems' : function() {
			var listValues = new Array();
			for ( var key in this.items) {
				listValues.push(this.items[key]);
			}
			return listValues;
		},

		/**
		 * Returns the number of items that are included.
		 * 
		 * @public
		 * @alias size
		 * @memberof AbstractList#
		 * @returns {int}
		 */
		'public size' : function() {
			return this.counter;
		},

		/**
		 * Verifies whether the list is empty.
		 * @public
		 * @alias isEmpty
		 * @memberof AbstractList#
		 * @returns {boolean}
		 */
		'public isEmpty' : function() {
			return this.counter == 0;
		},
		
		/**
		 * Clears this list.
		 * @public
		 * @alias clear
		 * @memberof AbstractList#
		 */
		'public clear' : function() {
			this.items = [];
			this.counter = 0;
		}

	});

	return AbstractList;
});