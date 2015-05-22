define(['attributeList', 'widget', 'interpreter', 'aggregator' ],
	function(AttributeList, Widget, Interpreter, Aggregator) {
		return (function() {
			/**
			 * Constructor: All known components given in the associated functions will be registered as startup.
			 *
			 * @classdesc The Discoverer handles requests for components and attributes.
			 * @constructs Discoverer
			 */
			function Discoverer(translations) {
				/**
				 * List of available Widgets.
				 *
				 * @type {Array}
				 * @private
				 */
				this._widgets = [];

				/**
				 * List of available Aggregators.
				 *
				 * @type {Array}
				 * @private
				 */
				this._aggregators = [];

				/**
				 * List of available Interpreter.
				 *
				 * @type {Object}
				 * @private
				 */
				this._interpreters = [];

				/**
				 * List of translations or synonymous attributes, respectively.
				 *
				 * @type {Array}
				 * @private
				 */
				this._translations = translations ? translations : [];

				return this;
			}

			/**
			 * Returns the type of this class, in this case "Discoverer".
			 *
			 * @returns {string}
			 */
			Discoverer.prototype.getType = function() {
				return 'Discoverer';
			};

			/**
			 * Registers the specified component.
			 *
			 * @param {Widget|Aggregator|Interpreter} component the component that should be registered
			 */
			Discoverer.prototype.registerNewComponent = function(component) {
				if (component instanceof Aggregator && this.getAggregator(component.getId()) == null) this._aggregators.push(component);
				if (component instanceof Widget && !(component instanceof Aggregator) && this.getWidget(component.getId()) == null) this._widgets.push(component);
				if (component instanceof Interpreter && this.getInterpreter(component.getId()) == null) this._interpreters.push(component);
			};

			/**
			 * Deletes a component from the Discoverer.
			 *
			 * @param {string} componentId id of the component that should be registered
			 */
			Discoverer.prototype.unregisterComponent = function(componentId) {
				for (var wi in this._widgets) {
					var theWidget = this._widgets[wi];
					if (componentId == theWidget.getId()) this._widgets.splice(wi, 1);
				}
				for (var ii in this._interpreters) {
					var theInterpreter = this._interpreters[ii];
					if (componentId == theInterpreter.getId()) this._interpreters.splice(ii, 1);
				}
				for (var ai in this._aggregators) {
					var theAggregator= this._aggregators[ai];
					if (componentId == theAggregator.getId()) this._aggregators.splice(ai, 1);
				}
			};

			/**
			 * Returns the widget for the specified id.
			 *
			 * @param {string} widgetId id of the component that should be returned
			 * @returns {?Widget}
			 */
			Discoverer.prototype.getWidget = function(widgetId) {
				for (var index in this._widgets) {
					var theWidget = this._widgets[index];
					if (theWidget.getId() == widgetId) return theWidget;
				}
				return null;
			};

			/**
			 * Returns the aggregator for the specified id.
			 *
			 * @param {string} aggregatorId id of the component that should be returned
			 * @returns {?Aggregator}
			 */
			Discoverer.prototype.getAggregator = function(aggregatorId) {
				for (var index in this._aggregators) {
					var theAggregator = this._aggregators[index];
					if (theAggregator.getId() == aggregatorId) return theAggregator;
				}
				return null;
			};

			/**
			 * Returns the interpreter for the specified id.
			 *
			 * @param {string} interpreterId id of the component that should be returned
			 * @returns {Interpreter}
			 */
			Discoverer.prototype.getInterpreter = function(interpreterId) {
				for (var index in this._interpreters) {
					var theInterpreter = this._interpreters[index];
					if (theInterpreter.getId() == interpreterId) return theInterpreter;
				}
				return null;
			};

			/**
			 * Returns all registered components (widget, aggregator and interpreter).
			 *
			 * @param {Array} componentTypes Component types to get descriptions for. Defaults to Widget, Interpreter and Aggregator.
			 * @returns {Array}
			 */
			Discoverer.prototype.getComponents = function(componentTypes) {
				if (typeof componentTypes == "undefined") componentTypes = [Widget, Interpreter, Aggregator];
				var response = [];
				if (jQuery.inArray(Widget, componentTypes) != -1) response = response.concat(this._widgets);
				if (jQuery.inArray(Aggregator, componentTypes) != -1) response = response.concat(this._aggregators);
				if (jQuery.inArray(Interpreter, componentTypes) != -1) response = response.concat(this._interpreters);
				return response;
			};

			/**
			 * Returns the instance (widget, aggregator or interpreter) for the specified id.
			 *
			 * @param {string} componentId id of the component that should be returned
			 * @returns {?(Widget|Aggregator|Interpreter)}
			 */
			Discoverer.prototype.getComponent = function(componentId) {
				var theWidget = this.getWidget(componentId);
				if (theWidget) {
					return theWidget;
				}
				var theAggregator = this.getAggregator(componentId);
				if (theAggregator) {
					return theAggregator;
				}
				var theInterpreter = this.getInterpreter(componentId);
				if (theInterpreter) {
					return theInterpreter;
				}
				return null;
			};

			/**
			 * Returns all components that have the specified attribute as
			 * outAttribute. It can be chosen between the verification of
			 * all attributes or at least one attribute.
			 *
			 * @param {AttributeList|Array} attributeListOrArray list of searched attributes
			 * @param {Boolean} all choise of the verification mode
			 * @param {Array} componentTypes Components types to search for
			 * @returns {Array}
			 */
			Discoverer.prototype.getComponentsByAttributes = function(attributeListOrArray, all, componentTypes) {
				var componentList = [];
				var list = [];
				if (typeof componentTypes == "undefined") componentTypes = [Widget, Interpreter, Aggregator];
				if (attributeListOrArray instanceof Array) {
					list = attributeListOrArray;
				} else if (attributeListOrArray.constructor === AttributeList) {
					list = attributeListOrArray.getItems();
				}
				if (typeof list != "undefined") {
					var components = this.getComponents(componentTypes);
					for (var i in components) {
						var theComponent = components[i];
						if(all && this._containsAllAttributes(theComponent, list)) {
							componentList.push(theComponent);
						} else if(!all && this._containsAtLeastOneAttribute(theComponent, list)) {
							componentList.push(theComponent);
						}
					}
				}
				return componentList;
			};

			/**
			 * Returns an array of all translations known to the discoverer.
			 *
			 * @returns {Array}
			 */
			Discoverer.prototype.getTranslations = function() {
				return this._translations;
			};

			/**
			 * Builds a new attribute from given name, type and parameters,
			 * adding known translations to its synonyms.
			 *
			 * @param name
			 * @param type
			 * @param parameterList
			 * @returns {Attribute}
			 */
			Discoverer.prototype.buildAttribute = function(name, type, parameterList) {
				var newAttribute = new Attribute().withName(name).withType(type);

				while (typeof parameterList != 'undefined' && parameterList.length > 0)
				{
					var param = parameterList.pop();
					var value = param.pop();
					var key = param.pop();
					if (typeof key != 'undefined' && typeof value != 'undefined')
						newAttribute = newAttribute.withParameter(new Parameter().withKey(key).withValue(value));
				}
				for (var index in this._translations) {
					var translation = this._translations[index];
					if (translation.translates(newAttribute))
						newAttribute = newAttribute.withSynonym(translation.getSynonym());
				}
				return newAttribute;
			};


			/***********************************************************************
			 * Helper *
			 **********************************************************************/
			/**
			 * Helper: Verifies whether a component description contains all searched attributes.
			 *
			 * @private
			 * @param {Widget|Interpreter|Aggregator} component description of a component
			 * @param {Array} list searched attributes
			 * @returns {boolean}
			 */
			Discoverer.prototype._containsAllAttributes = function(component, list) {
				for (var j in list) {
					var attribute = list[j];
					if (!component.doesSatisfyTypeOf(attribute)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Helper: Verifies whether a component description contains at least on searched attributes.
			 *
			 * @private
			 * @param {Widget|Interpreter|Aggregator} component description of a component
			 * @param {Array} list searched attributes
			 * @returns {boolean}
			 */
			Discoverer.prototype._containsAtLeastOneAttribute = function(component, list) {
				for (var j in list) {
					var attribute = list[j];
					if (component.doesSatisfyTypeOf(attribute)) {
						return true;
					}
				}
				return false;
			};

			return Discoverer;
		})();
	}
);