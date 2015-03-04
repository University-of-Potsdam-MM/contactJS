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
		 * @param {(SubscriberList|Array)}
		 *            _subscriberList SubscriberList
		 * @returns {SubscriberList}
		 */
		'public withItems': function(_subscriberList){
			var list = new Array();
			if(_subscriberList instanceof Array){
				list = _subscriberList;
			} else if (Class.isA( SubscriberList, _subscriberList)) {
				list = _subscriberList.getItems();
			}
			for(var i in list){
				var subscriber = list[i];
				if(Class.isA( Subscriber, subscriber )){
					this.items[subscriber.getSubscriberId()] = subscriber;
					this.counter++;
				}
			}
			return this;
		},

		/**
		 * Adds the specified item to the item list.
		 * 
		 * @public
		 * @alias put
		 * @memberof SubscriberList#
		 * @param {Subscriber}
		 *            _subscriber Subscriber
		 */
		'public put' : function(_subscriber){
			if(Class.isA(Subscriber, _subscriber)){
				if(!(this.containsKey(_subscriber.getSubscriberId()))){
					this.counter++;
				}
				this.items[_subscriber.getSubscriberId()] = _subscriber;
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
			var list = new Array();
			if(_subscriberList instanceof Array){
				list = _subscriberList;
			} else if (Class.isA(SubscriberList, _subscriberList)) {
				list = _subscriberList.getItems();
			}
			for(var i in list){
				var subscriber = list[i];
				if(Class.isA(Subscriber, subscriber)){
					if(!(this.containsKey(subscriber.getSubscriberId()))){
						this.counter++;
					}
					this.items[subscriber.getSubscriberId()] = subscriber;
				}
			}
		},

		/**
		 * Verifies whether the given item is contained in this list.
		 * 
		 * @public
		 * @alias contains
		 * @memberof SubscriberList#
		 * @param {Subscriber}
		 *            _item Subscriber that should be verified.
		 * @returns {boolean}
		 */
		'public contains' : function(_item){
			if(Class.isA(Subscriber,_item)){
				var tmp = this.getItem(_item.getSubscriberId());
				if(!(typeof tmp === 'undefined') && tmp.equals(_item)){
					return true;
				}
			} 
			return false;
		},
		
		/**
		 * Compare the specified SubscriberList with this instance.
		 * @public
		 * @alias equals
		 * @memberof SubscriberList#
		 * @param {SubscriberList} _list SubscriberList that should be compared.
		 * @returns {boolean}
		 */
		'public equals' : function(_list){
			if(Class.isA(SubscriberList,_list) && _list.size() == this.size()){
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
		},

	});

	return SubscriberList;
});