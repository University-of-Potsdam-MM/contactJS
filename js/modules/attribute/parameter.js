/**
 * This module represents a Parameter.
 * Parameter specifies the Attributes to which they are associated.
 * 
 * @module Parameter
 * @fileOverview
 */
define(['easejs'],
    function(easejs){
    	var Class = easejs.Class;
    	/**
		 * @class Parameter
		 * @classdesc Parameter specifies the Attributes to that these are associated.
		 * @requires easejs
		 */
		var Parameter = Class('Parameter',{
			
			/**
			 * @alias key
			 * @protected
			 * @type {string}
			 * @memberof Parameter#
			 */
			'protected key' : '',
			/**
			 * @alias value
			 * @protected
			 * @type {string}
			 * @memberof Parameter#
			 */
			'protected value' : '', 
		
			/**
			 * Builder for key.
			 * 
			 * @public
			 * @alias withKey
			 * @memberof Parameter#
			 * @param {String} _key Key
			 * @returns {Parameter}
			 */
    		'public withKey' : function(_key){
    			this.setKey(_key);
    			return this;
    		},

    		/**
			 * Builder for value.
			 * 
			 * @public
			 * @alias withValue
			 * @memberof Parameter#
			 * @param {String} _value Value
			 * @returns {Parameter}
			 */
    		'public withValue' : function(_value){
    			this.setValue(_value);
    			return this;
    		},

    		/**
			 * Returns the key.
			 * 
			 * @public
			 * @alias getKey
			 * @memberof Parameter#
			 * @returns {string}
			 */
			'public getKey' : function(){
				return this.key;
			},
			
			/**
			 * Returns the value.
			 * 
			 * @public
			 * @alias getValue
			 * @memberof Parameter#
			 * @returns {string}
			 */
			'public getValue' : function(){
				return this.value;
			},

			/**
			 * Sets the key.
			 * 
			 * @public
			 * @alias setKey
			 * @memberof Parameter#
			 * @param {string} _key Key
			 */
			'public setKey' : function(_key){
				if(typeof _key === 'string'){
					this.key = _key;
                }
            },

			/**
			 * Sets the value.
			 * 
			 * @public
			 * @alias setValue
			 * @memberof Parameter#
			 * @param {string} _value Value
			 */
			'public setValue' : function(_value){
				if(typeof _value === 'string'){
					this.value = _value;
                }
            },
			
			/**
			 * Compares this instance with the given one.
			 * 
			 * @virtual
			 * @public
			 * @alias equals
			 * @memberof Parameter#
			 * @param {Parameter} _parameter Parameter that should be compared.
			 * @returns {boolean}
			 */
			'public equals' : function(_parameter) {
				var ignoreValue = false;
				if(Class.isA(Parameter, _parameter)){
					if (_parameter.getValue() == "PV_INPUT" || this.getValue() == "PV_INPUT") {
						return this.getKey() == _parameter.getKey();
					} else {
						return this.getKey() == _parameter.getKey() && this.getValue() == _parameter.getValue();
					}
                }
                return false;

			},

			/**
			 * Returns an identifier that uniquely describes the parameter.
			 * The identifier can be used to compare two parameters.
			 * Format: [ParameterName:ParameterValue]
			 *
			 * @public
			 * @alias toString
			 * @memberof Parameter#
			 * @returns {String}
			 * @example [CP_UNIT:KILOMETERS]
			 */
            'public toString': function() {
				return "["+this.key+":"+this.value+"]";
            }

		});

        return Parameter;
	
});