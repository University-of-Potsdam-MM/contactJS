/**
 * This module represents a Subscriber.
 * 
 * @module Subscriber
 */
define(['contextInformationList', 'callbackList', 'condition', 'conditionList'],
 	function(ContextInformationList, CallbackList, Condition, ConditionList)  {
		return (function() {
			/**
			 * Constructor: Initializes the subscriptionCallbacks, subscriptionCallbacks and conditions.
			 *
			 * @classdesc Subscriber defines the name and the ID of the Subscriber and the Callbacks (with possible restrictions) what the subscriber is interested in.
			 * @constructs Subscriber
			 */
			function Subscriber() {
				/**
				 * Name of the subscriber.
				 *
				 * @type {string}
				 * @private
				 */
				this._subscriberName = '';

				/**
				 * ID of the Subscriber.
				 *
				 * @private
				 * @type {string}
				 */
				this._subscriberId = '';

				/**
				 * Callbacks that should be subscribed.
				 *
				 * @private
				 * @type {CallbackList}
				 */
				this._subscriptionCallbacks = new CallbackList();

				/**
				 * Restricts the associated contextual information of the callback to a subset
				 * 		(i.e: the subscriber wants a subset from the available the context data).
				 * 		If no contextual information is specified, all available contextual information will be returned.
				 *
				 * @private
				 * @type {ContextInformationList}
				 */
				this._contextInformationSubset = new ContextInformationList();

				/**
				 * Defines special conditions for notification.
				 *
				 * @private
				 * @type {ConditionList}
				 */
				this._conditions = new ConditionList();

				return this;
			}

			/**
			 * Builder for subscriberName.
			 *
			 * @param {String} subscriberName subscriberName
			 * @returns {Subscriber}
			 */
			Subscriber.prototype.withSubscriberName = function(subscriberName) {
				this.setSubscriberName(subscriberName);
				return this;
			};

			/**
			 * Builder for subscriberId.
			 *
			 * @param {String} subscriberId subscriberId
			 * @returns {Subscriber}
			 */
			Subscriber.prototype.withSubscriberId = function(subscriberId) {
				this.setSubscriberId(subscriberId);
				return this;
			};

			/**
			 * Builder for subscriptionCallbacks.
			 *
			 * @param {CallbackList} subscriptionCallbacks subscriptionCallbacks
			 * @returns {Subscriber}
			 */
			Subscriber.prototype.withSubscriptionCallbacks = function(subscriptionCallbacks) {
				this.setSubscriptionCallbacks(subscriptionCallbacks);
				return this;
			};

			/**
			 * Builder for contextInformationSubset.
			 *
			 * @param {ContextInformationList} contextInformationList
			 * @returns {Subscriber}
			 */
			Subscriber.prototype.withContextInformationSubset = function(contextInformationList) {
				this.setContextInformationSubset(contextInformationList);
				return this;
			};

			/**
			 * Builder for conditions.
			 *
			 * @param {(ConditionList|Array)} conditionListOrArray conditions
			 * @returns {Subscriber}
			 */
			Subscriber.prototype.withConditions = function(conditionListOrArray) {
				this.setConditions(conditionListOrArray);
				return this;
			};

			/**
			 * Returns the name.
			 *
			 * @returns {string}
			 */
			Subscriber.prototype.getSubscriberName = function() {
				return this._subscriberName;
			};

			/**
			 * Sets the setSubscriberName.
			 *
			 * @param {string} subscriberName subscriberName
			 */
			Subscriber.prototype.setSubscriberName = function(subscriberName) {
				if(typeof subscriberName === 'string'){
					this._subscriberName = subscriberName;
				}
			};

			/**
			 * Returns the subscriberId.
			 *
			 * @returns {string}
			 */
			Subscriber.prototype.getSubscriberId = function() {
				return this._subscriberId;
			};

			/**
			 * Sets the subscriberId.
			 *
			 * @param {string} subscriberId subscriberId
			 */
			Subscriber.prototype.setSubscriberId = function(subscriberId){
				if(typeof subscriberId === 'string'){
					this._subscriberId = subscriberId;
				}
			};

			/**
			 * Returns the subscriptionCallbacks.
			 *
			 * @returns {CallbackList}
			 */
			Subscriber.prototype.getSubscriptionCallbacks = function() {
				return this._subscriptionCallbacks;
			};

			/**
			 * Sets the subscriptionCallbacks.
			 *
			 * @param {CallbackList} subscriptionCallbacks subscriptionCallbacks
			 */
			Subscriber.prototype.setSubscriptionCallbacks = function(subscriptionCallbacks) {
				if(subscriptionCallbacks.constructor === CallbackList) {
					this._subscriptionCallbacks = subscriptionCallbacks;
				}
			};

			/**
			 * Returns the contextInformationSubset.
			 *
			 * @returns {ContextInformationList}
			 */
			Subscriber.prototype.getContextInformationSubset = function() {
				return this._contextInformationSubset;
			};

			/**
			 * Sets the contextInformationSubset.
			 *
			 * @param {ContextInformationList} contextInformationList
			 */
			Subscriber.prototype.setContextInformationSubset = function(contextInformationList){
				if(contextInformationList && contextInformationList instanceof ContextInformationList) {
					this._contextInformationSubset = contextInformationList;
				}
			};

			/**
			 * Returns the conditions.
			 *
			 * @returns {ConditionList}
			 */
			Subscriber.prototype.getConditions = function() {
				return this._conditions;
			};

			/**
			 * Sets the conditions.
			 *
			 * @param {(ConditionList|Array)} conditionListOrArray conditions
			 */
			Subscriber.prototype.setConditions = function(conditionListOrArray) {
				var list = [];
				if(conditionListOrArray instanceof Array){
					list = conditionListOrArray;
				} else if (conditionListOrArray && conditionListOrArray.constructor === ConditionList) {
					list = conditionListOrArray.getItems();
				}
				for(var i in list) {
					this.addCondition(list[i]);
				}
			};

			/**
			 * Adds a condition.
			 *
			 * @param {Condition} condition Condition
			 */
			Subscriber.prototype.addCondition = function(condition) {
				if (condition.constructor === Condition) {
					if (!this._conditions.contains(condition)) {
						this._conditions.put(condition);
					}
				}
			};

			/**
			 * Removes a condition.
			 *
			 * @param {Condition} condition Condition
			 */
			Subscriber.prototype.removeCondition = function(condition) {
				if (condition.constructor === Condition) {
					this._conditions.removeItem(condition);
				}
			};

			/**
			 * Compares this instance with the given one.
			 *
			 * @param {Subscriber} subscriber Subscriber that should be compared.
			 * @returns {boolean}
			 */
			Subscriber.prototype.equals = function(subscriber) {
				if(subscriber.constructor === Subscriber){
					if(subscriber.getSubscriberName() == this.getSubscriberName()
						&& subscriber.getSubscriberId() == this.getSubscriberId()
						&& subscriber.getSubscriptionCallbacks().equals(this.getSubscriptionCallbacks())
						&& subscriber.getContextInformationSubset().equals(this.getContextInformationSubset())
						&& subscriber.getConditions().equals(this.getConditions())){
						return true;
					}
				}
				return false;
			};

			return Subscriber;
		})();
	}
);