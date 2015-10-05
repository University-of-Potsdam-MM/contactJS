define(['contextInformation', 'conditionMethod'],
 	function(ContextInformation, ConditionMethod){
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
				 * ContextInformation that should be checked.
				 *
				 * @type {ContextInformation}
				 * @private
				 */
				this._contextInformation = '';

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
			 * Builder for ContextInformation.
			 *
			 * @param {ContextInformation} contextInformation Contextual information that should be verified.
			 * @returns {Condition}
			 */
			Condition.prototype.withContextInformation = function(contextInformation){
				this.setContextInformation(contextInformation);
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
			 * Sets the ContextInformation.
			 *
			 * @param {ContextInformation} contextInformation
			 */
			Condition.prototype.setContextInformation = function(contextInformation){
				if(contextInformation instanceof ContextInformation){
					this._contextInformation= contextInformation;
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
			 * Returns the ContextInformation.
			 *
			 * @returns {ContextInformation}
			 */
			Condition.prototype.getContextInformation = function(){
				return this._contextInformation;
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
			 * @param {ContextInformation} newContextInformation New contextual information that should be compared.
			 * @param {ContextInformation} oldContextInformation Old context information.
			 * @returns {boolean}
			 */
			Condition.prototype.compare = function(newContextInformation, oldContextInformation){
				if(!this.getContextInformation().isKindOf(newContextInformation) && !this.getContextInformation().isKindOf(oldContextInformation)){
					return false;
				}
				if(!this.getComparisonMethod()){
					return false;
				}
				if(newContextInformation instanceof ContextInformation && oldContextInformation instanceof  ContextInformation){
					return this.getComparisonMethod().process(this.getReferenceValue(), newContextInformation.getValue(), oldContextInformation.getValue());
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
						&& condition.getContextInformation().isKindOf(this.getContextInformation())
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