/**
 * This module represents a Callback.
 * Callbacks define events for sending data to subscribers
 * 
 * @module Callback
 * @fileOverview
 */
define(['easejs', 'attribute', 'attributeList'],
 	function(easejs, Attribute, AttributeList){
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
			this.attributeTypes = new AttributeList();
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
		 * @param {AttributeList} _attributes AttributeTypeList
		 */
		'public setAttributeTypes' : function(_attributes){
			var list = [];
			if(_attributes instanceof Array){
				list = _attributes;
			} else if (Class.isA( AttributeList, _attributes)) {
				list = _attributes.getItems();
			}
			for(var i in list){
				var theAttribute = list[i];
				if(Class.isA(Attribute, theAttribute)){
					this.attributeTypes.put(theAttribute);
				}
			}
		},

		/**
		 * Adds an attribute to AttributeTypeList.
		 * 
		 * @public
		 * @alias addAttributeType
		 * @memberof Callback#
		 * @param {AttributeType} _attribute AttributeType
		 */
		'public addAttributeType' : function(_attribute){
			if(Class.isA(Attribute, _attribute )){
				if(!this.attributeTypes.containsTypeOf(_attribute)){
					this.attributeTypes.put(_attribute);
				}
			}
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
			if(Class.isA(Attribute, _attributeType )){
				this.attributeTypes.removeItem(_attributeType.getName());
			}
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