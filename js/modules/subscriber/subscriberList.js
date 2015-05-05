/**
 * This module represents a SubscriberList. It is a subclass of AbstractList.
 * 
 * @module SubscriberList
 * @fileOverview
 */
define(['abstractList', 'subscriber'], function(AbstractList, Subscriber){
	return (function() {
		/**
		 * @class SubscriberList
		 * @classdesc This class represents a list for Subscriber.
		 * @extends AbstractList
		 * @requires AbstractList
		 * @requires Subscriber
		 */
		function SubscriberList() {
			AbstractList.call(this);

			this._type = Subscriber;

			return this;
		}

		SubscriberList.prototype = Object.create(AbstractList.prototype);
		SubscriberList.prototype.constructor = SubscriberList;

		/**
		 *
		 * @param {String} subscriberId
		 */
		SubscriberList.prototype.removeSubscriberWithId = function(subscriberId) {
			for (var index in this._items) {
				var theSubscriber = this._items[index];
				if (theSubscriber.getSubscriberId() == subscriberId) this._items.splice(index, 1);
			}
		};

		return SubscriberList;
	})();
});