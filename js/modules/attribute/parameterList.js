/**
 * This module represents a ParameterList. It is a subclass of AbstractList.
 * 
 * @module ParameterList
 * @fileOverview
 */
define(['abstractList', 'parameter' ],
	function(AbstractList, Parameter) {
		return (function() {
			/**
			 * @class ParameterList
			 * @classdesc This class represents a list for Parameter.
			 * @extends AbstractList
			 * @requires AbstractList
			 * @requires Parameter
			 */
			function ParameterList() {
				AbstractList.call(this);

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