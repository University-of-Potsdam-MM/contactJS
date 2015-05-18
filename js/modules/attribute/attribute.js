/**
 * This module represents an Attribute.
 * Attributes defines name, type (string, double,...) an associated parameter of an attribute.
 *
 * @module Attribute
 * @fileOverview
 */
define(['easejs',
        'parameterList'],
    function(easejs,
             ParameterList){

        /**
         * @class Attribute
         * @classdesc AttributeValue extends AttributeTypes and adds the associated
         *            value.
         * @requires easejs
         * @requires ParameterList
         */
        var Class = easejs.Class;
        var Attribute = Class('Attribute',{
            /**
             * @alias name
             * @protected
             * @type {string}
             * @memberof Attribute#
             * @desc Name of the Attribute
             */
            'protected name' : '',

            /**
             * @alias type
             * @protected
             * @type {string}
             * @memberof Attribute#
             * @desc Defines the type of the Attribute (i.e String, Double,...)
             */
            'protected type' : '',

            /**
             * @alias parameterList
             * @protected
             * @type {ParameterList}
             * @memberof Attribute#
             * @desc Name of the Attribute
             */
            'protected parameterList' : [],
            
			/**
			 * @alias synonymList
			 * @protected
			 * @type {Array}
			 * @memberof Attribute#
			 * @desc Alternative names of the Attribute; this is simply an array of strings
			 */
			'protected synonymList' : [],

            /**
             * @alias value
             * @protected
             * @type {string}
             * @memberof AttributeValue#
             */
            'protected value' : 'NO_VALUE',

            /**
             * @alias timestamp
             * @protected
             * @type {Date}
             * @memberof AttributeValue#
             * @desc Time when the value was set.
             */
            'protected timestamp' : '',

            /**
             * Constructor: Initializes the ParameterList.
             *
             * @class Attribute
             * @classdesc Attributes defines name, type (string, double,...) an associated parameter of an attribute.
             * @requires easejs
             * @requires ParameterList
             * @constructs Attribute
             */
            'public __construct' : function(){
                this.parameterList = new ParameterList();
            },

            /**
             * Builder for name.
             *
             * @public
             * @alias withName
             * @memberof Attribute#
             * @param {String} _name Name
             * @returns {Attribute}
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
             * @memberof Attribute#
             * @param {String} _type Type
             * @returns {Attribute}
             */
            'public withType' : function(_type){
                this.setType(_type);
                return this;
            },

            /**
             * Builder for one parameter.
             *
             * @public
             * @alias withParameter
             * @memberof Attribute#
             * @param {Parameter} _parameter Parameter
             * @returns {Attribute}
             */
            'public withParameter' : function(_parameter){
                this.addParameter(_parameter);
                return this;
            },

            /**
             * Builder for parameterList.
             *
             * @public
             * @alias withParameters
             * @memberof Attribute#
             * @param {(ParameterList|Array)} _parameterList ParameterList
             * @returns {Attribute}
             */
            'public withParameters' : function(_parameterList){
                this.setParameters(_parameterList);
                return this;
            },

            /**
             * Builder for value.
             *
             * @public
             * @alias withValue
             * @memberof AttributeValue#
             * @param {String} _value value
             * @returns {AttributeValue}
             */
            'public withValue' : function(_value) {
                this.setValue(_value);
                this.setTimestamp(Date.now());
                return this;
            },

            /**
             * Builder for timestamp.
             *
             * @public
             * @alias withTimestamp
             * @memberof AttributeValue#
             * @param {Date} _timestamp timestamp
             * @returns {AttributeValue}
             */
            'public withTimestamp' : function(_timestamp) {
                this.setTimestamp(_timestamp);
                return this;
            },
            
    		/**
			 * Builder for synonyms from single translation, called by discoverer's buildAttribute().
			 * 
			 * @public
			 * @alias withSynonym
			 * @memberof Attribute#
			 * @param {Translation} _translation Translations
			 * @returns {Attribute}
			 */
    		'public withSynonym' : function(_translation){
    			this.addSynonym(_translation);
    			return this;
    		},
            
    		/**
			 * Builder for synonyms from translations, called by discoverer's buildAttribute().
			 * 
			 * @public
			 * @alias withSynonyms
			 * @memberof Attribute#
			 * @param {Array} _translations Translations
			 * @returns {Attribute}
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
             * @memberof Attribute#
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
             * @memberof Attribute#
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
             * @memberof Attribute#
             * @returns {ParameterList}
             */
            'public getParameters' : function(){
                return this.parameterList;
            },            
			
			/**
			 * Returns the list of synonyms.
			 * 
			 * @public
			 * @alias getSynonyms
			 * @memberof Attribute#
             * @returns {Array}
			 */
			'public getSynonyms' : function(){
				return this.synonymList;
			},
			

            /**
             * Sets the name.
             *
             * @public
             * @alias setName
             * @memberof Attribute#
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
             * @memberof Attribute#
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
             * @memberof Attribute#
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
             * @memberof Attribute#
             * @param {ParameterList} _parameters ParameterList
             */
            'public setParameters' : function(_parameters){
                this.parameterList.putAll(_parameters);
            },

            /**
             * Returns true if the attribute is parameterized.
             *
             * @public
             * @alias hasParameters
             * @memberof Attribute#
             * @returns {boolean}
             */
            'public hasParameters' : function() {
                return this.parameterList.size() > 0;
            },

            /**
             * Sets the value.
             *
             * @public
             * @alias setValue
             * @memberof AttributeValue#
             * @param {string} _value value
             */
            'public setValue' : function(_value) {
                this.value = _value;
            },

            /**
             * Returns the value.
             *
             * @public
             * @alias getValue
             * @memberof AttributeValue#
             * @returns {string}
             */
            'public getValue' : function() {
                return this.value;
            },

            /**
             * Sets the timestamp.
             *
             * @public
             * @alias setTimestamp
             * @memberof AttributeValue#
             * @param {Date} _timestamp timestamp
             */
            'public setTimestamp' : function(_time) {
                this.timestamp = _time;
            },

            /**
             * Returns the timestamp.
             *
             * @public
             * @alias getTimestamp
             * @memberof AttributeValue#
             * @returns {string}
             */
            'public getTimestamp' : function() {
                return this.timestamp;
            },
            
			/**
			 * Adds a list of synonyms.
			 * 
			 * @public
			 * @alias setSynonyms
			 * @memberof Attribute#
			 * @param {Array} _synonyms Array of synonyms
			 */
			'public setSynonyms' : function(_synonyms){
				for (synIndex in _synonyms) {
					this.addSynonym(_synonyms[synIndex]);
				}
			},
			
            /**
             * Adds one synonym.
             *
             * @public
             * @alias addSynonym
             * @memberof Attribute#
             * @param {Attribute} _synonym 
             */
            'public addSynonym' : function(_synonym){
            	if (Class.isA(Attribute, _synonym))
            		this.synonymList.push(_synonym.getName());
            	else if (typeof _synonym == 'string')
            		this.synonymList.push(_synonym);            		
            },

            /**
             *
             * @public
             * @alias hasInputParameter
             * @memberof Attribute#
             * @returns {boolean}
             */
            'public hasInputParameter': function() {
                return this.hasParameters() && this.parameterList.hasInputParameter();
            },

            /**
             * Compares this instance with the given one.
             *
             * @public
             * @alias equalsTypeOf
             * @memberof Attribute#
             * @param {Attribute} _attribute Attribute that should be compared.
             * @returns {boolean}
             */
            'public equalsTypeOf' : function(_attribute) {
                if (Class.isA(Attribute, _attribute)) {
                	var name = _attribute.getName();
                    if ((this.getName() == name || this.getSynonyms().indexOf(name) != -1) && 
                    		this.getType() == _attribute.getType() && 
                    		this.getParameters().equals(_attribute.getParameters())) {
                        return true;
                    }
                }
                return false;
            },

            /**
             *
             *
             * @public
             * @alias equalsValueOf
             * @memberof Attribute#
             * @param _attribute
             * @returns {boolean}
             */
            'public equalsValueOf' : function(_attribute) {
                if (Class.isA(Attribute, _attribute)) {
                    if (this.equalsTypeOf(_attribute) && this.getValue() == _attribute.getValue()) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * Returns an identifier that uniquely describes the attribute type and its parameters.
             * The identifier can be used to compare two attribute types. <br/>
             * Format: (AttributeName:AttributeType)#[FirstParameterName:FirstParameterValue]…
             *
             * @public
             * @alias toString
             * @memberof Attribute#
             * @returns {String}
             * @example (CI_USER_LOCATION_DISTANCE:FLOAT)#[CP_TARGET_LATITUDE:52][CP_TARGET_LONGITUDE:13][CP_UNIT:KILOMETERS]
             */
            'public toString': function(_typeOnly) {
                var identifier = "("+this.name+":"+this.type+")";
                if (this.hasParameters()) {
                    identifier += "#";
                    for (var index in this.parameterList.getItems()) {
                        var theParameter = this.parameterList.getItems()[index];
                        identifier += theParameter.toString();
                    }
                }
                if (!_typeOnly) identifier += ":"+this.getValue();
                return identifier;
            }
        });

        return Attribute;

    });