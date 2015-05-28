/**
 * This module represents the helper class Translation. 
 * 
 * @module Translation
 */
define('translation', ['attribute'], function(Attribute) {
	return (function() {
		/**
		 * Constructs a translation tuple.
		 *
		 * @classdesc This class represents a translation tuple. It holds two synonymous attribute types.
		 * @requires attribute
		 * @constructs Translation
		 */
		function Translation(fromAttribute, toAttribute) {
			/**
			 *
			 * @type {?Attribute}
			 * @private
			 */
			this._fromAttribute = null;

			/**
			 *
			 * @type {?Attribute}
			 * @private
			 */
			this._toAttribute = null;

			if (fromAttribute instanceof Attribute && toAttribute instanceof Attribute) {
				this._fromAttribute = fromAttribute;
				this._toAttribute = toAttribute;
			}

			return this;
		}

		/**
		 * Return the target synonym.
		 *
		 * @returns {Attribute} The synonymous attribute
		 */
		Translation.prototype.getSynonym = function() {
			return this._toAttribute;
		};

		/**
		 * Return the original attribute for which a translation exists.
		 *
		 * @returns {Attribute} The original attribute
		 */
		Translation.prototype.getOrigin = function() {
			return this._fromAttribute;
		};

		/**
		 * Look for a translation and return true if one exists.
		 *
		 * @param {Attribute} attribute Attribute whose synonym is queried
		 * @returns {boolean}
		 */
		Translation.prototype.hasTranslation = function(attribute) {
			return this._fromAttribute.equalsTypeOf(attribute);
		};

		/**
		 * Look for a translation result and return true if one exists.
		 *
		 * @param {Attribute} attribute Attribute whose synonym is queried
		 * @returns {boolean}
		 */
		Translation.prototype.isTranslation = function(attribute) {
			return this._toAttribute.equalsTypeOf(attribute);
		};

		/**
		 * Look for a translation result and return true if one exists.
		 *
		 * @param {Attribute} attribute Attribute whose synonym is queried
		 * @returns {Attribute}
		 */
		Translation.prototype.translate = function(attribute) {
			if (this.hasTranslation(attribute)) {
				return attribute.withSynonym(this._toAttribute);
			}
			else if (this.isTranslation(attribute)) {
				return attribute.withSynonym(this._fromAttribute);
			}
			else {
				return attribute;
			}
		};

		return Translation;
	})();
});