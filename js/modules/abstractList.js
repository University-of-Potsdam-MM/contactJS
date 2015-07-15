/**
 * This module represents a List. 
 * It is an abstract Class.
 * 
 * @module AbstractList
 */
define(function() {
	return (function() {
		/**
		 * @classdesc This class represents a list.
		 * @constructs AbstractList
		 */
		function AbstractList() {
			/**
			 *
			 * @type {Array}
			 * @private
			 */
			this._items = [];

			/**
			 *
			 * @type {Object}
			 * @private
			 */
			this._type = Object;

			return this;
		}

		/**
		 * Builder for Item list.
		 *
		 * @param {*} list
		 * @returns {*}
		 */
		AbstractList.prototype.withItems = function(list) {
			if (list instanceof Array) {
				this._items = list;
			} else if (list.constructor === this.constructor) {
				this._items = list.getItems();
			}
			return this;
		};

		/**
		 * Adds the specified item to the itemList.
		 *
		 * @public
		 * @param {*} item item that should be added
		 */
		AbstractList.prototype.put = function(item) {
			if (item.constructor === this._type) {
				if (!(this.contains(item))) {
					this._items.push(item);
				}
			}
		};

		/**
		 * Adds all items in the specified list to the itemList.
		 *
		 * @public
		 * @param {*} listOrArray list of items that should be added
		 */
		AbstractList.prototype.putAll = function(listOrArray) {
			var list = [];
			if (listOrArray instanceof Array) {
				list = listOrArray;
			} else if (listOrArray.constructor === this.constructor) {
				list = listOrArray.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		};

		/**
		 * Verifies whether the given item is included
		 * in this list.
		 *
		 * @public
		 * @param {*} item Item that should be checked.
		 * @returns {boolean}
		 */
		AbstractList.prototype.contains = function(item) {
			if (item.constructor === this._type) {
				for (var index in this._items) {
					var theItem = this._items[index];
					if (theItem.equals(item)) {
						return true;
					}
				}
			}
			return false;
		};

		/**
		 * Compare the specified WidgetHandleList with this instance.
		 *
		 * @abstract
		 * @public
		 * @param {*} list List that should be compared.
		 */
		AbstractList.prototype.equals = function(list) {
			if (list.constructor === this.constructor && list.size() == this.size()) {
				for (var index in list.getItems()) {
					var theItem = list.getItems()[index];
					if (!this.contains(theItem)) return false;
				}
				return true;
			}
			return false;
		};

		/**
		 * Returns the item for the specified key.
		 *
		 * @param {string} key key that should be searched for
		 * @returns {*}
		 */
		AbstractList.prototype.getItem = function(key) {
			return this._items[key];
		};

		/**
		 * Removes the item from this list for the specified key.
		 *
		 * @public
		 * @param {string} key key that should be searched for
		 */
		AbstractList.prototype.removeItem = function(key) {
			if (this.containsKey(key)) {
				delete this._items[key];
			}
		};

		/**
		 * Returns the keys of all items.
		 *
		 * @public
		 * @returns {Array}
		 */
		AbstractList.prototype.getKeys = function() {
			var listKeys = [];
			for (var key in this._items) {
				listKeys.push(key);
			}
			return listKeys;
		};

		/**
		 * Returns all items.
		 *
		 * @virtual
		 * @public
		 * @returns {Array}
		 */
		AbstractList.prototype.getItems = function() {
			return this._items;
		};

		/**
		 * Returns the number of items that are included.
		 *
		 * @public
		 * @returns {Number}
		 */
		AbstractList.prototype.size = function() {
			return this._items.length;
		};

		/**
		 * Verifies whether the list is empty.
		 *
		 * @public
		 * @returns {boolean}
		 */
		AbstractList.prototype.isEmpty = function() {
			return this.size() == 0;
		};

		/**
		 * Clears this list.
		 *
		 * @public
		 */
		AbstractList.prototype.clear = function() {
			this._items = [];
		};

		return AbstractList;
	})();
});