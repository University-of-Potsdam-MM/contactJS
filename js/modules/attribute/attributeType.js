/**
 * This module represents an AttributeType.
 * AttributeTypes defines name, type (string, double,...) an associated parameter of an attribute.
 * 
 * @module AttributeType
 * @fileOverview
 */
define(['easejs',
        'parameterList'],
    function(easejs,
    		ParameterList){
    	var Class = easejs.Class;
		var AttributeType = Class('AttributeType',{
			/**
			 * @alias name
			 * @protected
			 * @type {string}
			 * @memberof AttributeType#
			 * @desc Name of the Attribute
			 */
			'protected name' : '', 
			/**
			 * @alias type
			 * @protected
			 * @type {string}
			 * @memberof AttributeType#
			 * @desc Defines the type of the Attribute (i.e String, Double,...)
			 */
			'protected type' : '', 
			/**
			 * @alias parameterList
			 * @protected
			 * @type {ParameterList}
			 * @memberof AttributeType#
			 * @desc Name of the Attribute
			 */
			'protected parameterList' : [],

			/**
			 * Constructor: Initializes the ParameterList.
			 * 
			 * @class AttributeType
			 * @classdesc AttributeTypes defines name, type (string, double,...) an associated parameter of an attribute.
			 * @requires easejs
			 * @requires ParameterList
			 * @constructs AttributeType
			 */
			'public __construct' : function(){
				this.parameterList = new ParameterList();
			},

			/**
			 * Builder for name.
			 * 
			 * @public
			 * @alias withName
			 * @memberof AttributeType#
			 * @param {String} _name Name
			 * @returns {AttributeType}
			 */
    		'public withName' : function(_name){
    			this.setName(_name);
    			return this;
    		},

    		/**
			 * Builder for type.
			 * 
			 * @public
			 * @alias withType
			 * @memberof AttributeType#
			 * @param {String} _type Type
			 * @returns {AttributeType}
			 */
    		'public withType' : function(_type){
    			this.setType(_type);
    			return this;
    		},
    		
    		/**
			 * Builder for parameterList.
			 * 
			 * @public
			 * @alias withParameters
			 * @memberof AttributeType#
			 * @param {(ParameterList|Array)} _parameterList ParameterList
			 * @returns {AttributeType}
			 */
    		'public withParameters' : function(_parameterList){
    			this.setParameters(_parameterList);
    			return this;
    		},
    		
    		/**
			 * Builder for one parameter.
			 * 
			 * @public
			 * @alias withParameters
			 * @memberof AttributeType#
			 * @param {Parameter} _parameter Parameter
			 * @returns {AttributeType}
			 */
    		'public withParameter' : function(_parameter){
    			this.addParameter(_parameter);
    			return this;
    		},

    		/**
			 * Returns the name.
			 * 
			 * @public
			 * @alias getName
			 * @memberof AttributeType#
			 * @returns {string}
			 */
			'public getName' : function(){
				return this.name;
			},
			
			/**
			 * Returns the type.
			 * 
			 * @public
			 * @alias getType
			 * @memberof AttributeType#
			 * @returns {string}
			 */
			'public getType' : function(){
				return this.type;
			},
			
			/**
			 * Returns the parameters.
			 * 
			 * @public
			 * @alias getParameters
			 * @memberof AttributeType#
			 * @returns {ParameterList}
			 */
			'public getParameters' : function(){
				return this.parameterList;
			},

			/**
			 * Sets the name.
			 * 
			 * @public
			 * @alias setName
			 * @memberof AttributeType#
			 * @param {string} _name Name
			 */
			'public setName' : function(_name){
				if(typeof _name === 'string'){
					this.name = _name;
                }
            },

			/**
			 * Sets the type.
			 * 
			 * @public
			 * @alias setType
			 * @memberof AttributeType#
			 * @param {string} _type Type
			 */
			'public setType' : function(_type){
				if(typeof _type === 'string'){
					this.type = _type;
                }
            },
			
			/**
			 * Adds a parameter.
			 * 
			 * @public
			 * @alias addParameter
			 * @memberof AttributeType#
			 * @param {Parameter} _parameter Parameter
			 */
			'public addParameter' : function(_parameter){
					this.parameterList.put(_parameter);
			},
			
			/**
			 * Adds a list of Parameter.
			 * 
			 * @public
			 * @alias setParameters
			 * @memberof AttributeType#
			 * @param {ParameterList} _parameters ParameterList
			 */
			'public setParameters' : function(_parameters){
				this.parameterList.putAll(_parameters);
			},

			/**
			 * Compares this instance with the given one.
			 * 
			 * @virtual
			 * @public
			 * @alias equals
			 * @memberof AttributeType#
			 * @param {AttributeType} _attributeType AttributeType that should be compared
			 * @returns {boolean}
			 */
			'virtual public equals' : function(_attributeType) {				
				if(Class.isA(AttributeType, _attributeType)){
					if(_attributeType.getName() == this.getName() 
								&& _attributeType.getType() == this.getType()
								&& _attributeType.getParameters().equals(this.parameterList)){
						return true;
                    }
                }
                return false;

			}

        });

		return AttributeType;
	
});