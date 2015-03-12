/**
 * This module represents a Callback.
 * Callbacks defines events for sending data to subscribers
 * 
 * @module Callback
 * @fileOverview
 */
define(['easejs', 'attributeType', 'attributeTypeList'],
 	function(easejs, AttributeType, AttributeTypeList){
 	var Class = easejs.Class;
 	
	var Callback = Class('Callback',
	{

		/**
		 * @alias name
		 * @private
		 * @type {string}
		 * @memberof Callback#
		 * @desc Name of the Callback (i.e. Update).
		 */
		'private name' : '', 
		/**
		 * @alias attributeTypes
		 * @private
		 * @type {AttributeTypeList}
		 * @memberof Callback#
		 * @desc Associated Attributes that will be send to Subscriber.
		 */
		'private attributeTypes' : [], 
		
		/**
		 * Constructor: Initializes the AttributeTypeList.
		 * 
		 * @class Callback
		 * @classdesc Callbacks defines events for sending data to subscribers.
		 * 			The data to be sent, are specified in the attributeTypeList.
		 * @requires easejs
		 * @requires ParameterList
		 * @requires AttributeType
		 * @requires AttributeTypeList
		 * @constructs Callback
		 */
		'public __construct': function()
        {
			this.attributeTypes = new AttributeTypeList();
        },

        /**
		 * Builder for name.
		 * 
		 * @public
		 * @alias withName
		 * @memberof Callback#
		 * @param {String} _name Name
		 * @returns {Callback}
		 */
		'public withName' : function(_name){
			this.setName(_name);
			return this;
		},
		
		/**
		 * Builder for AttributeTypes.
		 * 
		 * @public
		 * @alias withAttributeTypes
		 * @memberof Callback#
		 * @param {(AttributeTypeList|Array)} _attributeTypes attributeTypes
		 * @returns {Callback}
		 */
		'public withAttributeTypes' : function(_attributeTypes){
			this.setAttributeTypes(_attributeTypes);
			return this;
		},

		/**
		 * Returns the name.
		 * 
		 * @public
		 * @alias getName
		 * @memberof Callback#
		 * @returns {string}
		 */
		'public getName' : function(){
			return this.name;
		},

		/**
		 * Sets the name.
		 * 
		 * @public
		 * @alias setName
		 * @memberof Callback#
		 * @param {string} _name Name
		 */
		'public setName' : function(_name){
			if(typeof _name === 'string'){
				this.name = _name;
			};
		},

		/**
		 * Returns the associated attributes (only the types).
		 * 
		 * @public
		 * @alias getAttributeTypes
		 * @memberof Callback#
		 * @returns {AttributeTypeList}
		 */
		'public getAttributeTypes' : function(){
			return this.attributeTypes;
		},

		/**
		 * Adds a list of AttributeTypes.
		 * 
		 * @public
		 * @alias setAttributeTypes
		 * @memberof Callback#
		 * @param {AttributeTypeList} _attributeTypes AttributeTypeList
		 */
		'public setAttributeTypes' : function(_attributeTypes){
			var list = [];
			if(_attributeTypes instanceof Array){
				list = _attributeTypes;
			} else if (Class.isA( AttributeTypeList, _attributeTypes)) {
				list = _attributeTypes.getItems();
			}
			for(var i in list){
				var attributeType = list[i];
				if(Class.isA( AttributeType, attributeType )){
					this.attributeTypes.put(attributeType);
				}
			}
		},

		/**
		 * Adds an attribute to AttributeTypeList.
		 * 
		 * @public
		 * @alias addAttributeType
		 * @memberof Callback#
		 * @param {AttributeType} _attributeType AttributeType
		 */
		'public addAttributeType' : function(_attributeType){
			if(Class.isA( AttributeType, _attributeType )){
				if(!this.attributeTypes.contains(_attributeType)){
					this.attributeTypes.put(_attributeType);	
				}
			};
		},

		/**
		 * Removes an attribute from AttributeTypeList.
		 * 
		 * @public
		 * @alias removeAttributeType
		 * @memberof Callback#
		 * @param {AttributeType} _attributeType AttributeType
		 */
		'public removeAttributeType' : function(_attributeType){
			if(Class.isA( AttributeType, _attributeType )){
				this.attributeTypes.removeItem(_attributeType.getName());
			};
		},
		
		/**
		 * Compares this instance with the given one.
		 * 
		 * @virtual
		 * @public
		 * @alias equals
		 * @memberof Callback#
		 * @param {Callback} _callback Callback that should be compared
		 * @returns {boolean}
		 */
		'public equals' : function(_callback) {				
			if(Class.isA(Callback, _callback)){
				if(_callback.getName() == this.getName()
					&& _callback.getAttributeTypes().equals(this.getAttributeTypes())){
					return true;
				};
			};
			return false;

		},


		});

	return Callback;
});