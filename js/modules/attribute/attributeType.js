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
			 * @desc additional parameters of the Attribute
			 */
			'protected parameterList' : [],
			/**
			 * @alias synonymList
			 * @protected
			 * @type {Array}
			 * @memberof AttributeType#
			 * @desc Alternative names of the Attribute
			 */
			'protected synonymList' : [],
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
			 * Builder for synonyms from translations, called by discoverer's buildAttribute().
			 * 
			 * @public
			 * @alias withSynonyms
			 * @memberof AttributeType#
			 * @param {Translations} _translations Translations
			 * @returns {AttributeType}
			 */
    		'public withSynonyms' : function(_translations){
    			this.setSynonyms(_translations);
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

            'public hasParameters' : function() {
                return this.parameterList.size() > 0;
            },
            
			
			/**
			 * Adds a list of synonyms.
			 * 
			 * @public
			 * @alias setSynonyms
			 * @memberof AttributeType#
			 * @param {Array} _synonyms Array of synonyms
			 */
			'public setSynonyms' : function(_synonyms){
				for (synIndex in _synonyms) {
					// TODO: needs to be adjusted to match actual type
					this.synonymList.push(_synonyms[synIndex]);
				}
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
				if (Class.isA(AttributeType, _attributeType)) {
                    if (this.getName() == _attributeType.getName() &&
                        this.getType() == _attributeType.getType() &&
                        this.getParameters().equals(_attributeType.getParameters()))
                    return true;
                }
                return false;
			},

            'public hasInputParameter': function() {
                return this.hasParameters() && this.parameterList.hasInputParameter();
            },

			/**
			 * Returns an identifier that uniquely describes the attribute type and its parameters.
			 * The identifier can be used to compare two attribute types. <br/>
			 * Format: (AttributeName:AttributeType)#[FirstParameterName:FirstParameterValue]…
			 *
			 * @public
			 * @alias toString
			 * @memberof AttributeType#
			 * @returns {String}
			 * @example (CI_USER_LOCATION_DISTANCE:FLOAT)#[CP_TARGET_LATITUDE:52][CP_TARGET_LONGITUDE:13][CP_UNIT:KILOMETERS]
			 */
            'virtual public toString': function() {
                var identifier = "("+this.name+":"+this.type+")";
                if (this.hasParameters()) {
                    identifier += "#";
                    for (var index in this.parameterList.getItems()) {
						var theParameter = this.parameterList.getItems()[index];
						identifier += theParameter.toString();
					}
                }
                return identifier;
            }

        });

		return AttributeType;
	
});