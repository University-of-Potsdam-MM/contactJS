/**
 * This module represents a SubscriberList. It is a subclass of AbstractList.
 * 
 * @module SubscriberList
 * @fileOverview
 */
define(['easejs', 'abstractList', 'subscriber'],
 	function(easejs, AbstractList, Subscriber){
 	var Class = easejs.Class;
 	
 	/**
	 * @class SubscriberList
	 * @classdesc This class represents a list for Subscriber.
	 * @extends AbstractList
	 * @requires easejs
	 * @requires AbstractList
	 * @requires Subscriber
	 */
	var SubscriberList = Class('SubscriberList').
					extend(AbstractList,{
					
		/**
		 * @alias counter
		 * @protected
		 * @type {integer}
		 * @memberof SubscriberList#
		 * @desc Number of items.
		 */
 		'protected counter' : 0,
 		/**
		 * @alias items
		 * @protected
		 * @type {SubscriberList}
		 * @memberof SubscriberList#
		 * @desc ItemList
		 */
		'protected items' : [],
		
		/**
		 * Builder for item list.
		 * 
		 * @public
		 * @alias withItems
		 * @memberof SubscriberList#
		 * @param {(SubscriberList|Array)} _subscriberList SubscriberList
		 * @returns {SubscriberList}
		 */
		'public withItems': function(_subscriberList){
			if (_subscriberList instanceof Array) {
				this.items = _subscriberList;
			} else if (Class.isA(SubscriberList, _subscriberList)) {
				this.items = _subscriberList.getItems();
			}
			return this;
		},

		/**
		 * Adds the specified item to the item list.
		 * 
		 * @public
		 * @alias put
		 * @memberof SubscriberList#
		 * @param {Subscriber} _subscriber Subscriber
		 */
		'public put' : function(_subscriber){
			if (Class.isA(Subscriber, _subscriber)) {
				if (!(this.contains(_subscriber))) {
					this.items.push(_subscriber);}
			}
		},

		/**
		 * Adds all items in the specified list to the item list.
		 * 
		 * @public
		 * @alias putAll
		 * @memberof SubscriberList#
		 * @param {(SubscriberList|Array)} _subscriberList SubscriberList
		 */
		'public putAll' : function(_subscriberList){
			var list = [];
			if (_subscriberList instanceof Array) {
				list = _subscriberList;
			} else if (Class.isA(SubscriberList,	_subscriberList)) {
				list = _subscriberList.getItems();
			}
			for (var i in list) {
				this.put(list[i]);
			}
		},

		/**
		 * Verifies whether the given item is contained in this list.
		 * 
		 * @public
		 * @alias contains
		 * @memberof SubscriberList#
		 * @param {Subscriber}_subscriber Subscriber that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_subscriber){
			if (Class.isA(Subscriber, _subscriber)) {
				for (var index in this.items) {
					var tmp = this.items[index];
					if (tmp.equals(_subscriber)) {
						return true;
					}
				}
			}
			return false;
		},
		
		/**
		 * Compare the specified SubscriberList with this instance.
		 * @public
		 * @alias equals
		 * @memberof SubscriberList#
		 * @param {SubscriberList} _subscriberList SubscriberList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_subscriberList) {
			if (Class.isA(SubscriberList, _subscriberList) && _subscriberList.size() == this.size()) {
				for (var index in _subscriberList.getItems()) {
					var theSubscriber = _subscriberList.getItems()[index];
					if (!this.contains(theSubscriber)) return false;
				}
				return true;
			}
			return false;
		},

			'public removeSubscriberWithId': function(_subscriberId) {
				for (var index in this.items) {
					var theSubscriber = this.items[index];
					if (theSubscriber.getSubscriberId() == _subscriberId) this.items.splice(index, 1);
				}
			}
	});

	return SubscriberList;
});