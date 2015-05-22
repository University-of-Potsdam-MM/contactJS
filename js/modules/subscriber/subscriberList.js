/**
 * This module represents a SubscriberList. It is a subclass of AbstractList.
 * 
 * @module SubscriberList
 */
define(['abstractList', 'subscriber'], function(AbstractList, Subscriber){
	return (function() {
		/**
		 * @classdesc This class represents a list for Subscriber.
		 * @extends AbstractList
		 * @constructs SubscriberList
		 */
		function SubscriberList() {
			AbstractList.call(this);

			/**
			 * @type {Subscriber}
			 * @private
			 */
			this._type = Subscriber;

			return this;
		}

		SubscriberList.prototype = Object.create(AbstractList.prototype);
		SubscriberList.prototype.constructor = SubscriberList;

		/**
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