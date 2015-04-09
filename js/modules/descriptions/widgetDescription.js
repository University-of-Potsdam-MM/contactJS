/**
 * This module represents the WidgetDescription. 
 * It describes the most important information for the communication with a specific widget. 
 * 
 * @module WidgetDescription
 * @fileOverview
 */
define(['easejs', 'attributeTypeList'],
    function(easejs, AttributeTypeList){
    	var Class = easejs.Class;
		var WidgetDescription = Class('WidgetDescription',{
			
			/**
			 * @alias id
			 * @protected
			 * @type {string}
			 * @memberof WidgetDescription#
			 * @desc Id of the Widget that are described by this object.
			 */
			'protected id' : '', 
			/**
			 * @alias name
			 * @protected
			 * @type {string}
			 * @memberof WidgetDescription#
			 * @desc Name of the Widget that are described by this object.
			 */
			'protected name' : '', 
			/**
			 * @alias outAttributeTypes
			 * @protected
			 * @type {AttributeTypeList}
			 * @memberof WidgetDescription#
			 * @desc List of attributeTypes that are provided.
			 */
			'protected outAttributeTypes' : [],
            /**
             * @alias callbackNames
             * @protected
             * @type {array}
             * @memberof WidgetDescription#
             * @desc Array of available callback names.
             */
            'protected callbackNames' : [],

			/**
			 * Constructor: Initializes the inAttributeTypes.
			 * 
			 * @virtual
			 * @class WidgetDescription
			 * @classdesc The description of a Widget and the communication with it.
			 * @requires easejs
			 * @requires AttributeTypeList
			 * @constructs WidgetDescription
			 */
			'virtual public __construct' : function(){
				this.outAttributeTypes = new AttributeTypeList();
			},

			/**
			 * Builder for name
			 * 
			 * @public
			 * @alias withName
			 * @memberof WidgetDescription#
			 * @param {string} _name Name of the Widget that are described by this object.
			 * @returns {WidgetDescription}
			 */
    		'public withName' : function(_name){
    			this.setName(_name);
    			return this;
    		},

    		/**
			 * Builder for id
			 * 
			 * @public
			 * @alias withId
			 * @memberof WidgetDescription#
			 * @param {string} _id Id of the Widget that are described by this object.
			 * @returns {WidgetDescription}
			 */
    		'public withId' : function(_id){
    			this.setId(_id);
    			return this;
    		},
    		
    		/**
			 * Builder for outAttributeType list
			 * 
			 * @public
			 * @alias withOutAttributeTypes
			 * @memberof WidgetDescription#
			 * @param {(AttributeTypeList|Array)} _outAttributeTypes List of AttributeType that are provided
			 * @returns {WidgetDescription}
			 */
    		'public withOutAttributeTypes' : function(_outAttributeTypes){
    			this.setOutAttributeTypes(_outAttributeTypes);
    			return this;
    		},
    		
    		/**
			 * Builder for outAttributeType
			 * 
			 * @public
			 * @alias withInAttributeType
			 * @memberof WidgetDescription#
			 * @param {AttributeType} _outAttributeType AttributeType that are provided
			 * @returns {WidgetDescription}
			 */
    		'public withOutAttributeType' : function(_outAttributeType){
    			this.setOutAttributeType(_outAttributeType);
    			return this;
    		},

    		/**
			 * Returns the name of the described widget.
			 * 
			 * @public
			 * @alias getName
			 * @memberof WidgetDescription#
			 * @returns {String}
			 */
			'public getName' : function(){
				return this.name;
			},
			
			/**
			 * Returns the id of the described widget.
			 * 
			 * @public
			 * @alias getId
			 * @memberof WidgetDescription#
			 * @returns {String}
			 */
			'public getId' : function(){
				return this.id;
			},
			
			/**
			 * Returns outAttributeTypes of the widget.
			 * 
			 * @public
			 * @alias getOutAttributeTypes
			 * @memberof WidgetDescription#
			 * @returns {AttributeTypeList}
			 */
			'public getOutAttributeTypes' : function(){
				return this.outAttributeTypes;
			},

			/**
			 * Sets the name of the described widget.
			 * 
			 * @public
			 * @alias setName
			 * @memberof WidgetDescription#
			 * @params {String} _name Name of the described widget
			 */
			'public setName' : function(_name){
				if(typeof _name === 'string'){
					this.name = _name;
				}
			},

			/**
			 * Sets the id of the described widget.
			 * 
			 * @public
			 * @alias setId
			 * @memberof WidgetDescription#
			 * @params {String} _id Id of the described widget
			 */
			'public setId' : function(_id){
				if(typeof _id === 'string') {
					this.id = _id;
				}
			},
			
			/**
			 * Adds an outAttributeType to the list
			 * 
			 * @public
			 * @alias addOutAttributeType
			 * @memberof WidgetDescription#
			 * @param {AttributeType} _outAttributeType AttributeType that are provided
			 */
			'public addOutAttributeType' : function(_outAttributeType){
					this.outAttributeTypes.put(_outAttributeType);
			},
			
			/**
			 * Adds outAttributeTypes that are provided by the Widget
			 * 
			 * @public
			 * @alias addOutAttributeTypes
			 * @memberof WidgetDescription#
			 * @param {(AttributeTypeList|Array)} _outAttributeTypes List of AttributeType that are provided
			 */
			'public addOutAttributeTypes' : function(_outAttributeTypes){
				this.outAttributeTypes.putAll(_outAttributeTypes);
			},

            'public setCallbackNames' : function(_callbackNames) {
                this.callbackNames = _callbackNames;
            },

            'public addCallbackName' : function(_callbackName) {
                this.callbackNames.push(_callbackName);
            },

			/**
			 * Returns true if the widget can satisfy the requested attribute type.
			 *
			 * @public
			 * @alias doesSatisfyAttributeType
			 * @memberof WidgetDescription#
			 * @param {AttributeType} _attributeType
			 * @returns {boolean}
			 */
            'public doesSatisfyAttributeType': function(_attributeType) {
                return this.getOutAttributeTypes().contains(_attributeType);
            }
		});

        return WidgetDescription;
	
});