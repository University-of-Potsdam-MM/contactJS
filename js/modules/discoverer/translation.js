/**
 * This module represents the helper class Translation. 
 * 
 * @module Translation
 */
define('translation', ['contextInformation'], function(ContextInformation) {
	return (function() {
		/**
		 * This class represents a translation tuple. It holds two synonymous contextual information.
		 *
		 * @requires ContextInformation
		 * @class Translation
		 */
		function Translation(fromContextInformation, toContextInformation) {
			/**
			 *
			 * @type {?ContextInformation}
			 * @private
			 */
			this._fromContextInformation = null;

			/**
			 *
			 * @type {?ContextInformation}
			 * @private
			 */
			this._toContextInformation = null;

			if (fromContextInformation instanceof ContextInformation && toContextInformation instanceof ContextInformation) {
				this._fromContextInformation = fromContextInformation;
				this._toContextInformation = toContextInformation;
			}

			return this;
		}

		/**
		 * Return the target synonym.
		 *
		 * @returns {ContextInformation} The synonymous contextual information.
		 */
		Translation.prototype.getSynonym = function() {
			return this._toContextInformation;
		};

		/**
		 * Return the original contextual information for which a translation exists.
		 *
		 * @returns {ContextInformation} The original contextual information
		 */
		Translation.prototype.getOrigin = function() {
			return this._fromContextInformation;
		};

		/**
		 * Look for a translation and return true if one exists.
		 *
		 * @param {ContextInformation} contextInformation The contextual information whose synonym is queried.
		 * @returns {boolean}
		 */
		Translation.prototype.hasTranslation = function(contextInformation) {
			return this._fromContextInformation.isKindOf(contextInformation);
		};

		/**
		 * Look for a translation result and return true if one exists.
		 *
		 * @param {ContextInformation} contextInformation The contextual information whose synonym is queried
		 * @returns {boolean}
		 */
		Translation.prototype.isTranslation = function(contextInformation) {
			return this._toContextInformation.isKindOf(contextInformation);
		};

		/**
		 * Look for a translation and return the (translated) contextual information.
		 *
		 * @param {ContextInformation} contextInformation The contextual information whose synonym is queried
		 * @returns {ContextInformation}
		 */
		Translation.prototype.translate = function(contextInformation) {
			if (this.hasTranslation(contextInformation) && !contextInformation.hasSynonym(this._toContextInformation)) {
				return contextInformation.withSynonym(this._toContextInformation);
			}
			else if (this.isTranslation(contextInformation) && !contextInformation.hasSynonym(this._fromContextInformation)) {
				return contextInformation.withSynonym(this._fromContextInformation);
			}
			else {
				return contextInformation;
			}
		};

		return Translation;
	})();
});