define(['abstractList', 'parameter'], function(AbstractList, Parameter) {
	return (function() {
		/**
		 * This class represents a list for Parameter.
		 *
		 * @extends AbstractList
		 * @class ParameterList
		 */
		function ParameterList() {
			AbstractList.call(this);

			/**
			 * @type {Object}
			 * @private
			 */
			this._type = Parameter;

			return this;
		}

		ParameterList.prototype = Object.create(AbstractList.prototype);
		ParameterList.prototype.constructor = ParameterList;

		/**
		 * Returns the objects of the list as JSON objects.
		 *
		 * @public
		 * @returns {{}}
		 */
		ParameterList.prototype.getItemsAsJson = function() {
			var parameters = {};
			for (var key in this._items) {
				var theParameter = this._items[key];
				parameters[theParameter.getKey()] = theParameter.getValue();
			}
			return parameters;
		};

		/**
		 * Return true if the list contains a parameter that is set at runtime.
		 *
		 * @public
		 * @returns {boolean}
		 */
		ParameterList.prototype.hasInputParameter = function() {
			for (var index in this._items) {
				var theParameter = this._items[index];
				if (theParameter.getValue() == "PV_INPUT") return true;
			}
			return false;
		};

		return ParameterList;
	})();
});