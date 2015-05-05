/**
 * This module represents a Subscriber.
 * 
 * @module Subscriber
 * @fileOverview
 */
define(['easejs', 'attributeList', 'callbackList', 'condition', 'conditionList'],
 	function(easejs, AttributeList, CallbackList, Condition, ConditionList){

 	/*
 	* Callback: name and associated Attributes
 	*/
 	var Class = easejs.Class;
	var Subscriber = Class('Subscriber',
	{

		/**
		 * @alias subscriberName
		 * @private
		 * @type {string}
		 * @memb Name of the subscriber.
		 */
		'private subscriberName' : '',
		/**
		 * @alias subscriberId
		 * @private
		 * @type {string}
		 * @memberof Subscriber#
		 * @desc ID of the Subscriber.
		 */
		'private subscriberId' : '',
		/**
		 * @alias subscriptionCallbacks
		 * @private
		 * @type {CallbackList}
		 * @memberof Subscriber#
		 * @desc Callbacks that should be subscribed.
		 */
		'private subscriptionCallbacks' : [],
		/**
		 * @alias attributesSubset
		 * @private
		 * @type {AttributeTypeList}
		 * @memberof Subscriber#
		 * @desc Restricts the associated Attributes of the callback to a subset
		 * 		(i.e: the subscriber wants a subset from the available the context data).  
		 * 		If no attributes are specified, all available attributes will returned.
		 */
		'private attributesSubset' : [],
		/**
		 * @alias conditions
		 * @private
		 * @type {ConditionList}
		 * @memberof Subscriber#
		 * @desc Defines special conditions for notification.
		 */
		'private conditions' : [],

		/**
		 * Constructor: Initializes the subscriptionCallbacks, subscriptionCallbacks
		 * 				and conditions.
		 * 
		 * @class Subscriber
		 * @classdesc Subscriber defines the name and the ID of the Subscriber and the Callbacks 
		 * 			 (with possible restrictions) what the subscriber is interested in.
		 * @requires easejs
		 * @requires AttributeTypeList 
		 * @requires CallbackList 
		 * @requires Condition
		 * @requires ConditionList
		 * @constructs Subscriber
		 */
		'virtual public __construct': function()
        {
			this.subscriptionCallbacks = new CallbackList();
			this.subscriptionCallbacks = new AttributeList();
			this.attributesSubset = new AttributeList();
			this.conditions = new ConditionList();
        },
			
		/**
		 * Builder for subscriberName.
		 * 
		 * @public
		 * @alias withSubscriberName
		 * @memberof Subscriber#
		 * @param {String} _subscriberName subscriberName
		 * @returns {Subscriber}
		 */
		'public withSubscriberName' : function(_subscriberName){
			this.setSubscriberName(_subscriberName);
			return this;
		},
		
		/**
		 * Builder for subscriberId.
		 * 
		 * @public
		 * @alias withSubscriberId
		 * @memberof Subscriber#
		 * @param {String} _subscriberId subscriberId
		 * @returns {Subscriber}
		 */
		'public withSubscriberId' : function(_subscriberId){
			this.setSubscriberId(_subscriberId);
			return this;
		},
		
		/**
		 * Builder for subscriptionCallbacks.
		 * 
		 * @public
		 * @alias withSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @param {CallbackList} _subscriptionCallbacks subscriptionCallbacks
		 * @returns {Subscriber}
		 */
		'public withSubscriptionCallbacks' : function(_subscriptionCallbacks){
			this.setSubscriptionCallbacks(_subscriptionCallbacks);
			return this;
		},
		
		/**
		 * Builder for attributesSubset.
		 * 
		 * @public
		 * @alias withAttributesSubset
		 * @memberof Subscriber#
		 * @param {AttributeTypeList} _attributesSubset attributesSubset
		 * @returns {Subscriber}
		 */
		'public withAttributesSubset' : function(_attributesSubset){
			this.setAttributesSubset(_attributesSubset);
			return this;
		},
		
		/**
		 * Builder for conditions.
		 * 
		 * @public
		 * @alias withConditions
		 * @memberof Subscriber#
		 * @param {(ConditionList|Array)} _conditions conditions
		 * @returns {Subscriber}
		 */
		'public withConditions' : function(_conditions){
			this.setConditions(_conditions);
			return this;
		},

		
		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getSubscriberName
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getSubscriberName' : function(){
			return this.subscriberName;
		},

		/**
		 * Sets the setSubscriberName.
		 * 
		 * @public
		 * @alias setSubscriberName
		 * @memberof Subscriber#
		 * @param {string} _subscriberName subscriberName
		 */
		'public setSubscriberName' : function(_subscriberName){
			if(typeof _subscriberName === 'string'){
				this.subscriberName = _subscriberName;
			}
			
		},
		
		/**
		 * Returns the subscriberId.
		 * 
		 * @public
		 * @alias getSubscriberId
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getSubscriberId' : function(){
			return this.subscriberId;
		},

		/**
		 * Sets the subscriberId.
		 * 
		 * @public
		 * @alias setSubscriberId
		 * @memberof Subscriber#
		 * @param {string} _subscriberId subscriberId
		 */
		'public setSubscriberId' : function(_subscriberId){
			if(typeof _subscriberId === 'string'){
				this.subscriberId = _subscriberId;
			};
		},
		
		/**
		 * Returns the subscriptionCallbacks.
		 * 
		 * @public
		 * @alias getSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @returns {CallbackList}
		 */
		'public getSubscriptionCallbacks' : function(){
			return this.subscriptionCallbacks;
		},

		/**
		 * Sets the subscriptionCallbacks.
		 * 
		 * @public
		 * @alias setSubscriptionCallbacks
		 * @memberof Subscriber#
		 * @param {CallbackList} _subscriptionCallbacks subscriptionCallbacks
		 */
		'public setSubscriptionCallbacks' : function(_subscriptionCallbacks){
			if(Class.isA(CallbackList, _subscriptionCallbacks)){
				this.subscriptionCallbacks = _subscriptionCallbacks;
			}
		},
		
		/**
		 * Returns the attributesSubset.
		 * 
		 * @public
		 * @alias getAttributesSubset
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getAttributesSubset' : function(){
			return this.attributesSubset;
		},

		/**
		 * Sets the attributesSubset.
		 * 
		 * @public
		 * @alias setAttributesSubset
		 * @memberof Subscriber#
		 * @param {AttributeList} _attributesSubset attributesSubset
		 */
		'public setAttributesSubset' : function(_attributesSubset){
			if(Class.isA(AttributeList, _attributesSubset)){
				this.attributesSubset = _attributesSubset;
			}
		},
		
		/**
		 * Returns the conditions.
		 * 
		 * @public
		 * @alias getConditions
		 * @memberof Subscriber#
		 * @returns {string}
		 */
		'public getConditions' : function(){
			return this.conditions;
		},

		/**
		 * Sets the conditions.
		 * 
		 * @public
		 * @alias setConditions
		 * @memberof Subscriber#
		 * @param {(Callback|Array)} _conditions conditions
		 */
		'public setConditions' : function(_conditions){
			var list = new Array();
			if(_conditions instanceof Array){
				list = _conditions;
			} else if (Class.isA( ConditionList, _conditions)) {
				list = _conditions.getItems();
			}
			for(var i in list){
				var condition = list[i];
				if(Class.isA( Condition, condition )){
					this.attributeTypes.put(condition);
				};
			};
		},
		
		/**
		 * Adds a condition.
		 * 
		 * @public
		 * @alias addCondition
		 * @memberof Subscriber#
		 * @param {Condition} _condition Condition
		 */
		'public addCondition' : function(_condition){
			if(Class.isA( Condition, _condition )){
				if(!this.condition.contains(_condition)){
					this.conditiond.put(_condition);	
				}
			};
		},

		/**
		 * Removes a condition.
		 * 
		 * @public
		 * @alias removeCondition
		 * @memberof Subscriber#
		 * @param {Condition} _condition Condition
		 */
		'public removeCondition' : function(_condition){
			if(Class.isA( Condition, _condition )){
				this.conditions.removeItem(_condition.getName());
			};
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @public
		 * @alias equals
		 * @memberof Subscriber#
		 * @param {Subscriber} _subscriber Subscriber that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_subscriber) {				
			if(Class.isA(Subscriber, _subscriber)){
				if(_subscriber.getSubscriberName() == this.subscriberName
							&& _subscriber.getSubscriberId() == this.subscriberId
							&& _subscriber.getSubscriptionCallbacks().equals(this.getSubscriptionCallbacks())
							&& _subscriber.getAttributesSubset().equals(this.getAttributesSubset())
							&& _subscriber.getConditions().equals(this.getConditions())){
					return true;
				}
			}
			return false;
		}
				
		});

	return Subscriber;
});