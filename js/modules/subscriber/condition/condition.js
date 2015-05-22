define(['attribute', 'conditionMethod'],
 	function(Attribute, ConditionMethod){
		return (function() {
			/**
			 * @classdesc Condition for subscribed Attributes.
			 * @constructs Condition
			 */
			function Condition() {
				/**
				 * Name of the Condition.
				 *
				 * @type {string}
				 * @private
				 */
				this._name = '';
				/**
				 * AttributeType that should be checked.
				 *
				 * @type {Attribute}
				 * @private
				 */
				this._attributeType = '';

				/**
				 * Method for comparison.
				 *
				 * @type {ConditionMethod}
				 * @private
				 */
				this._comparisonMethod =  '';

				/**
				 * Comparison value.
				 *
				 * @type {*}
				 * @private
				 */
				this._referenceValue = '';

				return this;
			}

			/**
			 * Builder for name.
			 *
			 * @param {String} name Name
			 * @returns {Condition}
			 */
			Condition.prototype.withName = function(name){
				this.setName(name);
				return this;
			};

			/**
			 * Builder for AttributeType.
			 *
			 * @param {Attribute} attribute Attributes that would be verified.
			 * @returns {Condition}
			 */
			Condition.prototype.withAttributeType = function(attribute){
				this.setAttributeType(attribute);
				return this;
			};

			/**
			 * Builder for comparison method.
			 *
			 * @param {ConditionMethod} comparisonMethod method for comparison
			 * @returns {Condition}
			 */
			Condition.prototype.withComparisonMethod = function(comparisonMethod){
				this.setComparisonMethod(comparisonMethod);
				return this;
			};

			/**
			 * Builder for comparison value.
			 *
			 * @param {String} referenceValue comparisonValue
			 * @returns {Condition}
			 */
			Condition.prototype.withReferenceValue = function(referenceValue){
				this.setReferenceValue(referenceValue);
				return this;
			};

			/**
			 * Sets the name.
			 *
			 * @param {string} name Name
			 */
			Condition.prototype.setName = function(name) {
				if(typeof name === 'string'){
					this._name = name;
				}
			};

			/**
			 * Sets the attributeType.
			 *
			 * @param {Attribute} attribute AttributeType
			 */
			Condition.prototype.setAttributeType = function(attribute){
				if(attribute.constructor === Attribute){
					this._attributeType = attribute;
				}
			};

			/**
			 * Sets the ComparisonMethod.
			 *
			 * @param {ConditionMethod} comparisonMethod comparison Method
			 */
			Condition.prototype.setComparisonMethod = function(comparisonMethod){
				if(comparisonMethod.constructor === ConditionMethod){
					this._comparisonMethod = comparisonMethod;
				}
			};

			/**
			 * Sets the referenceValue.
			 *
			 * @param {*} referenceValue comparison value
			 */
			Condition.prototype.setReferenceValue = function(referenceValue){
				this._referenceValue = referenceValue;
			};

			/**
			 * Returns the name.
			 *
			 * @returns {string}
			 */
			Condition.prototype.getName = function(){
				return this._name;
			};

			/**
			 * Returns the AttributeType.
			 *
			 * @returns {Attribute}
			 */
			Condition.prototype.getAttributeType = function(){
				return this._attributeType;
			};

			/**
			 * Returns the comparison method.
			 *
			 * @returns {ConditionMethod}
			 */
			Condition.prototype.getComparisonMethod = function(){
				return this._comparisonMethod;
			};

			/**
			 * Returns the comparison value.
			 *
			 * @returns {*}
			 */
			Condition.prototype.getReferenceValue = function(){
				return this._referenceValue;
			};

			/**
			 * Processes the comparison.
			 *
			 * @param {Attribute} newAttribute new Attribute that should be compared
			 * @param {Attribute} oldAttribute old Attribute
			 * @returns {boolean}
			 */
			Condition.prototype.compare = function(newAttribute, oldAttribute){
				if(!this.getAttributeType().equalsTypeOf(newAttribute) && !this.getAttributeType().equalsTypeOf(oldAttribute)){
					return false;
				}
				if(!this.getComparisonMethod()){
					return false;
				}
				if(newAttribute.constructor === Attribute && oldAttribute.constructor === Attribute){
					return this.getComparisonMethod().process(this.getReferenceValue(), newAttribute.getValue(), oldAttribute.getValue());
				}
				return false;
			};

			/**
			 * Compares this instance with the given one.
			 *
			 * @param {Condition} condition Condition that should be compared
			 * @returns {boolean}
			 */
			Condition.prototype.equals = function(condition) {
				if(condition.constructor === Condition){
					if(condition.getName() == this.getName()
						&& condition.getReferenceValue() == this.getReferenceValue()
						&& condition.getAttributeType().equalsTypeOf(this.getAttributeType())
						&& condition.getComparisonMethod() === this.getComparisonMethod()){
						return true;
					}
				}
				return false;
			};

			return Condition;
		})();
	}
);