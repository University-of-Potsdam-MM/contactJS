/**
 * This module represents an CallbackList. It is a subclass of AbstractList.
 * 
 * @module CallbackList
 * @fileOverview
 */
define(['abstractList', 'callback'], function(AbstractList, Callback){
 	return (function() {
		/**
		 * @class CallbackList
		 * @classdesc This class represents a list for Callback.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Callback
		 */
		function CallbackList() {
			AbstractList.call(this);

			this._type = Callback;

			return this;
		}

		CallbackList.prototype = Object.create(AbstractList.prototype);
		CallbackList.prototype.constructor = CallbackList;

		/**
		 * Builder for item list.
		 *
		 * @public
		 * @param {(CallbackList|Array)} callbackListOrArray CallbackList
		 * @returns {CallbackList}
		 */
		CallbackList.prototype.withItems = function(callbackListOrArray){
			if (callbackListOrArray instanceof Array) {
				this._items = callbackListOrArray;
			} else if (callbackListOrArray.constructor === CallbackList) {
				this._items = callbackListOrArray.getItems();
			}
			return this;
		};

		/**
		 * Adds the specified item to the itemList.
		 *
		 * @public
		 * @param {Callback} callback Callback
		 */
		CallbackList.prototype.put = function(callback){
			if (callback.constructor === Callback) {
				if (!(this.contains(callback))) {
					this._items.push(callback);
				}
			}
		};

		/**
		 * Adds all items in the specified list to this itemList
		 *
		 * @public
		 * @param {(CallbackList|Array)} callbackListOrArray CallbackList
		 */
		CallbackList.prototype.putAll = function(callbackListOrArray){
			var list = [];
			if (callbackListOrArray instanceof Array) {
				list = callbackListOrArray;
			} else if (callbackListOrArray.constructor === CallbackList) {
				list = callbackListOrArray.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		};

		/**
		 * Verifies whether the given item is included in this list.
		 *
		 * @public
		 * @param {Callback} callback CallbackType that should be verified.
		 * @returns {boolean}
		 */
		CallbackList.prototype.contains = function(callback){
			if (callback.constructor === Callback) {
				for (var index in this._items) {
					var tmp = this._items[index];
					if (tmp.equals(callback)) {
						return true;
					}
				}
			}
			return false;
		};

		/**
		 * Compare the specified CallbackList with this instance.
		 * @public
		 * @alias equals
		 * @memberof CallbackList#
		 * @param {CallbackList} callbackList CallbackList that should be compared.
		 * @returns {boolean}
		 */
		CallbackList.prototype.equals = function(callbackList){
			if (callbackList.constructor === CallbackList && callbackList.size() == this.size()) {
				for (var index in callbackList.getItems()) {
					var theCallback = callbackList.getItems()[index];
					if (!this.contains(theCallback)) return false;
				}
				return true;
			}
			return false;
		};

		return CallbackList;
	})();
});