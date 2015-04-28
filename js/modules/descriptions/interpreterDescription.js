/**
 * This module represents the InterpreterDescription. 
 * It describes the most important information for the communication with a specific interpreter. 
 * 
 * @module InterpreterDescription
 * @fileOverview
 */
define(['easejs','attributeList', 'widgetDescription'],
    function(easejs,AttributeList, WidgetDescription){
    	var Class = easejs.Class;
		var InterpreterDescription = Class('InterpreterDescription').
						extend(WidgetDescription, {
			/**
			* @alias inAttributeTypes
			* @private
			* @type {AttributeTypeList}
			* @memberof InterpreterDescription#
			* @desc List of all Attributes that are expected for interpretation.
			*/
			'private inAttributeTypes' : [], 

			/**
			 * Constructor: Calls the constructor of the WidgetDescription
			 * and initializes the inAttributeTypes.
			 * 
			 * @class InterpreterDescription
			 * @classdesc The description of an interpreter and the communication with it.
			 * @extends WidgetDescription
			 * @requires easejs
			 * @requires AttributeList
			 * @requires WidgetDescription
			 * @constructs InterpreterDescription
			 */
			'override public __construct' : function(){
				this.__super();
				this.inAttributeTypes = new AttributeList();
			},
			
			/**
			 * Builder for inAttributeType list
			 * 
			 * @public
			 * @alias withInAttributeTypes
			 * @memberof InterpreterDescription#
			 * @param {(AttributeList|Array)} _inAttributeTypes List of AttributeType that are expected
			 * @returns {InterpreterDescription}
			 */
    		'public withInAttributeTypes' : function(_inAttributeTypes){
    			this.setInAttributeTypes(_inAttributeTypes);
    			return this;
    		},
    		
    		/**
			 * Builder for inAttributeType
			 * 
			 * @public
			 * @alias withInAttributeType
			 * @memberof InterpreterDescription#
			 * @param {AttributeType} _inAttributeType AttributeType that are expected
			 * @returns {InterpreterDescription}
			 */
    		'public withInAttributeType' : function(_inAttributeType){
    			this.setInAttributeType(_inAttributeType);
    			return this;
    		},

    		/**
			 * Returns inAttributeTypes of the interpreter
			 * 
			 * @public
			 * @alias getInAttributeTypes
			 * @memberof InterpreterDescription#
			 * @returns {AttributeTypeList}
			 */
			'public getInAttributeTypes' : function(){
				return this.inAttributeTypes;
			},

			/**
			 * Adds an inAttributeType to the list
			 * 
			 * @public
			 * @alias setInAttributeType
			 * @memberof InterpreterDescription#
			 * @param {AttributeType} _inAttributeType AttributeType that are expected
			 */
			'public setInAttributeType' : function(_inAttributeType){
					this.inAttributeTypes.put(_inAttributeType);
			},
			
			/**
			 * Adds inAttributeTypes that are expected
			 * 
			 * @public
			 * @alias setInAttributeTypes
			 * @memberof InterpreterDescription#
			 * @param {(AttributeTypeList|Array)} _inAttributeTypes List of AttributeType that are expected
			 */
			'public setInAttributeTypes' : function(_inAttributeTypes){
				this.inAttributeTypes.putAll(_inAttributeTypes);
			}

            });

        return InterpreterDescription;
});