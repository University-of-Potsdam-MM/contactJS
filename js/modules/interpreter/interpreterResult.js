define(['attributeList'], function(AttributeList){
	return (function() {
		/**
		 * Initializes the in- and outAttributes.
		 *
		 * @classdesc Contains the interpreted data, inclusive the input for the interpretation.
		 * @constructs InterpreterResult
		 */
		function InterpreterResult() {
			/**
			 * Time of the interpretation.
			 *
			 * @type {date}
			 * @private
			 */
			this._timestamp = '';

			/**
			 * Interpreted data.
			 *
			 * @type {AttributeList}
			 * @private
			 */
			this._outAttributes = new AttributeList();

			/**
			 * Data, which were used for the interpretation.
			 *
			 * @type {AttributeList}
			 * @private
			 */
			this._inAttributes = new AttributeList();


			return this;
		}

		/**
		 * Builder for timestamp.
		 *
		 * @param {String} timestamp timestamp
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withTimestamp = function(timestamp) {
			this.setTimestamp(timestamp);
			return this;
		};

		/**
		 * Builder for outAttributes.
		 *
		 * @param {(AttributeList|Array)} attributeListOrArray values
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withOutAttributes = function(attributeListOrArray){
			this.setOutAttributes(attributeListOrArray);
			return this;
		};

		/**
		 * Builder for inAttributes.
		 *
		 * @param {(AttributeList|Array)} attributeListOrArray values
		 * @returns {InterpreterResult}
		 */
		InterpreterResult.prototype.withInAttributes = function(attributeListOrArray) {
			this.setInAttributes(attributeListOrArray);
			return this;
		};

		/**
		 * Returns the interpretation time.
		 *
		 * @returns {Date}
		 */
		InterpreterResult.prototype.getTimestamp = function() {
			return this._timestamp;
		};

		/**
		 * Returns the interpreted attributes.
		 *
		 * @returns {AttributeList}
		 */
		InterpreterResult.prototype.getOutAttributes = function(){
			return this._outAttributes;
		};

		/**
		 * Returns the inAttributes.
		 *
		 * @returns {AttributeList}
		 */
		InterpreterResult.prototype.getInAttributes = function(){
			return this._inAttributes;
		};

		/**
		 * Sets the interpretation time.
		 *
		 * @param {date} timestamp interpretation time
		 */
		InterpreterResult.prototype.setTimestamp = function(timestamp){
			if(timestamp instanceof Date){
				this._timestamp = timestamp;
			}
		};

		/**
		 * Sets the interpreted values.
		 *
		 * @param {(AttributeList|Array)} attributeListOrArray retrieved attributes
		 */
		InterpreterResult.prototype.setOutAttributes = function(attributeListOrArray){
			if (attributeListOrArray instanceof Array) {
				for(var i in attributeListOrArray){
					this.outAttributes.put(attributeListOrArray[i]);
				}
			} else if (attributeListOrArray.constructor === AttributeValueList) {
				this.outAttributes = attributeListOrArray.getItems();
			}
		};

		/**
		 * Sets the inAttributes.
		 *
		 * @param {(AttributeList|Array)} attributeListOrArray inAttributes
		 */
		InterpreterResult.prototype.setInAttributes = function(attributeListOrArray){
			if (attributeListOrArray instanceof Array) {
				for(var i in attributeListOrArray){
					this.inAttributes.put(attributeListOrArray[i]);
				}
			} else if (attributeListOrArray.constructor === AttributeValueList) {
				this.inAttributes = attributeListOrArray.getItems();
			}
		};

		return InterpreterResult;
	});
});