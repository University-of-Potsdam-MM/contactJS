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
		 * Look for a translation and return the found synonym.
		 *
		 * @returns {Attribute} The synonymous attribute
		 */
		Translation.prototype.getSynonym = function() {
			return this._toAttribute;
		};

		/**
		 * Look for a translation and return true if one exists.
		 *
		 * @param {Attribute} attribute Attribute whose synonym is queried
		 * @returns {boolean}
		 */
		Translation.prototype.translates = function(attribute) {
			return this._fromAttribute.equalsTypeOf(attribute);
		};

		return Translation;
	})();
});