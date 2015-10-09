define(function(){
	return (function() {
		/**
		 * Parameter specifies the Attributes to that these are associated.
		 *
		 * @class Parameter
		 */
		function Parameter() {
			/**
			 *
			 * @type {string}
			 * @private
			 */
			this._key = '';

			/**
			 *
			 * @type {string}
			 * @private
			 */
			this._dataType = '';

			/**
			 *
			 * @type {string}
			 * @private
			 */
			this._value = '';

			return this;
		}

		/**
		 * Builder for key.
		 *
		 * @public
		 * @param {String} key Key
		 * @returns {Parameter}
		 */
		Parameter.prototype.withKey = function(key){
			this.setKey(key);
			return this;
		};

		/**
		 * Builder for type.
		 *
		 * @param dataType
		 * @return {Parameter}
		 */
		Parameter.prototype.withDataType = function(dataType) {
			this.setDataType(dataType);
			return this;
		};

		/**
		 * Builder for value.
		 *
		 * @public
		 * @param {String} value Value
		 * @returns {Parameter}
		 */
		Parameter.prototype.withValue = function(value){
			this.setValue(value);
			return this;
		};

		/**
		 * Returns the key.
		 *
		 * @public
		 * @returns {string}
		 */
		Parameter.prototype.getKey = function() {
			return this._key;
		};

		/**
		 * Return the type.
		 *
		 * @returns {string}
		 */
		Parameter.prototype.getDataType = function() {
			return this._dataType;
		};

		/**
		 * Returns the value.
		 *
		 * @public
		 * @returns {string}
		 */
		Parameter.prototype.getValue = function(){
			return this._value;
		};

		/**
		 * Sets the key.
		 *
		 * @public
		 * @param {string} newKey Key
		 */
		Parameter.prototype.setKey = function(newKey){
			if(typeof newKey === 'string') this._key = newKey;
		};

		/**
		 * Sets the type.
		 *
		 * @param newDataType
		 */
		Parameter.prototype.setDataType = function(newDataType) {
			if(typeof newDataType === "string") this._dataType = newDataType;
		};

		/**
		 * Sets the value.
		 *
		 * @public
		 * @param {string} newValue Value
		 */
		Parameter.prototype.setValue = function(newValue){
			if(typeof newValue === 'string') this._value = newValue;
		};

		/**
		 * Compares this instance with the given one.
		 *
		 * @param {Parameter} parameter Parameter that should be compared.
		 * @returns {boolean}
		 */
		Parameter.prototype.equals = function(parameter) {
			if(parameter.constructor === Parameter){
				if (parameter.getValue() == "PV_INPUT" || this.getValue() == "PV_INPUT") {
					return this.getKey() == parameter.getKey() && this.getDataType() == parameter.getDataType();
				} else {
					return this.getKey() == parameter.getKey() && this.getDataType() == parameter.getDataType() && this.getValue() == parameter.getValue();
				}
			}
			return false;
		};

		/**
		 * Returns a description of the parameter.
		 * Format: [ParameterName:ParameterType:ParameterValue]
		 *
		 * @example [CP_UNIT:STRING:KILOMETERS]
		 */
		Parameter.prototype.toString = function() {
			return "["+this.getKey()+":"+this.getDataType()+":"+this.getValue()+"]";
		};

		return Parameter;
	})();
});