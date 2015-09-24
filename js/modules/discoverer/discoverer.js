define(['attributeList', 'attribute', 'translation', 'parameter', 'parameterList', 'widget', 'interpreter', 'aggregator',  'interpretation' ],
	function(AttributeList, Attribute, Translation, Parameter, ParameterList, Widget, Interpreter, Aggregator, Interpretation) {
		return (function() {
			/**
			 * Constructor: All known components given in the associated functions will be registered as startup.
			 *
			 * @classdesc The Discoverer handles requests for components and attributes.
			 * @constructs Discoverer
			 */
			function Discoverer(widgets, interpreters, translations) {
				/**
				 * List of available Widgets.
				 *
				 * @type {Array}
				 * @private
				 */
				this._widgets = [];

				/**
				 * List of unregistered Widgets
				 *
				 * @type (Array)
				 * @private
				 */
				this._unregisteredWidgets = widgets;


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
				 * List of unregistered Interpreters
				 *
				 * @type (Array)
				 * @private
				 */
				this._unregisteredInterpreters = interpreters;

				/**
				 * List of translations or synonymous attributes, respectively.
				 *
				 * @type {Array}
				 * @private
				 */
				this._translations = [];

				// build translations from input array
                for (var i in translations) {
					// get translation (an array) from array of translations
                    var translationArray = translations[i];
					// check for correct cardinality
                    if (translationArray.length != 2)
                        throw new Error("Translations must consist of exactly 2 attributes!");
					// check for correct number of attribute building blocks
					for (var j in translationArray) {
                        if (translationArray[j].length > 3 || translationArray[j].length < 2)
                            throw new Error("Please provide a name, type and (optional) list of parameters!");
                    }
					// build attributes from arrays containing name, type (and parameters)
                    var firstAttribute = this.buildAttribute(
                        translationArray[0][0],
                        translationArray[0][1],
                        translationArray[0][2],
                        false
                    );
                    var secondAttribute = this.buildAttribute(
                        translationArray[1][0],
                        translationArray[1][1],
                        translationArray[1][2],
                        false
                    );
					// add built attributes to translations
                    this._translations.push(new Translation(firstAttribute, secondAttribute));
                }

				return this;
			}

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
			 * Returns all registered components that have the specified attribute as
			 * outAttribute. It can be chosen between the verification of
			 * all attributes or at least one attribute.
			 *
			 * @param {AttributeList|Array} attributeListOrArray list of searched attributes
			 * @param {Boolean} all choise of the verification mode
			 * @param {Array} componentTypes Components types to search for
			 * @returns {Array}
			 */
			Discoverer.prototype.getRegisteredComponentsByAttributes = function(attributeListOrArray, all, componentTypes) {
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
			 * @param attributeName
			 * @param attributeType
			 * @param {Array} [parameterList=[]]
             * @param {Boolean} [withSynonyms=true]
			 * @returns {Attribute}
			 */
			Discoverer.prototype.buildAttribute = function(attributeName, attributeType, parameterList, withSynonyms) {
				if (typeof withSynonyms == 'undefined') withSynonyms = true;
				if (typeof parameterList == 'undefined') parameterList = [];

                if (typeof attributeName != 'string' || typeof attributeType != 'string')
                    throw new Error("Parameters name and type must be of type String!");

                var newAttribute = new Attribute(true).withName(attributeName).withType(attributeType);

				for (var i = 0; i < parameterList.length; i++) {
					var param = parameterList[i];
					var value = param[2];
					var type = param[1];
					var key = param[0];
					if (typeof key != 'undefined' && typeof value != 'undefined')
						newAttribute = newAttribute.withParameter(new Parameter().withKey(key).withType(type).withValue(value));
				}

                if (withSynonyms) {
                    for (var index in this._translations) {
                        var translation = this._translations[index];
						newAttribute = translation.translate(newAttribute);
                    }
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

			/**
			 * Searches for components that can satisfy the requested attributes. Searches recursively through all
			 * registered and unregistered components and initiates them.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @param {Boolean} all If true all attributes must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 * @private
			 */
			Discoverer.prototype.getComponentsForUnsatisfiedAttributes = function(aggregatorId, unsatisfiedAttributes, all, componentTypes){
				// the discoverer gets a list of attributes to satisfy
				console.log('Discoverer: I will look for components that satisfy the following Attributes: '+unsatisfiedAttributes.getItems()+'.' );
				// look at all the already registered components
				this._getRegisteredComponentsForUnsatisfiedAttributes(aggregatorId, unsatisfiedAttributes, all, componentTypes);
				// look at all unregistered components
				this._getUnregisteredComponentsForUnsatisfiedAttributes(aggregatorId, unsatisfiedAttributes);
			};

			/**
			 * Searches for registered components that satisfy the requested attributes.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @param {Boolean} all If true all attributes must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 * @private
			 */
			Discoverer.prototype._getRegisteredComponentsForUnsatisfiedAttributes = function(aggregatorId, unsatisfiedAttributes, all, componentTypes) {
				var theAggregator = this.getAggregator(aggregatorId);
				console.log("Discoverer: Let's look at my registered components.");

				var relevantComponents = this.getRegisteredComponentsByAttributes(unsatisfiedAttributes, all, componentTypes);
				console.log("Discoverer: I found " + relevantComponents.length + " registered component(s) that might satisfy the requested attributes.");

				//iterate over the found components
				for(var index in relevantComponents) {
					var theComponent = relevantComponents[index];
					console.log("Discoverer: Let's look at component "+theComponent.getName()+".");

					// if the component was added before, ignore it
					if (!theAggregator._hasComponent(theComponent.getId())) {
						// if component is a widget and it wasn't added before, subscribe to its callbacks
						if (theComponent instanceof Widget) {
							theAggregator.addWidgetSubscription(theComponent);
							console.log("Discoverer: I found "+theComponent.getName()+" and the Aggregator did subscribe to it.");
							this._removeAttributesSatisfiedByWidget(aggregatorId, theComponent, unsatisfiedAttributes);
						} else if (theComponent instanceof Interpreter) { // if the component is an interpreter and all its in attributes can be satisfied, add the interpreter
							console.log("Discoverer: It's an Interpreter.");

							if (this._checkInterpreterInAttributes(aggregatorId, theComponent)) {
								// remove satisfied attributes
								this._removeAttributesSatisfiedByInterpreter(aggregatorId, theComponent, unsatisfiedAttributes);
							} else {
								console.log("Discoverer: I found a registered Interpreter but I couldn't satisfy the required attributes.");
								for (var j in theComponent.getInAttributes().getItems()) {
									console.log("Discoverer: It is missing " + theComponent.getInAttributes().getItems()[j] + ".");
								}
							}
						} else {
							console.log("Discoverer: It seems that the component was added before.");
						}
					}
				}
			};

			/**
			 * Searches for unregistered components that satisfy the requested attributes.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @private
			 */
			Discoverer.prototype._getUnregisteredComponentsForUnsatisfiedAttributes = function(aggregatorId, unsatisfiedAttributes) {
				var theAggregator = this.getAggregator(aggregatorId);
				console.log("Discoverer: Let's look at the unregistered components.");

				//check all Widget's outAttributes
				for(var widgetIndex in this._unregisteredWidgets){
					var theWidget = this._unregisteredWidgets[widgetIndex];
					// check i
					if (this._checkWidgetRequirements(theWidget)) {
						for(var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()){
							var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
							//if a Widget can satisfy the Attribute, register it and subscribe the Aggregator

							//create temporary OutAttributeList
							var tempWidgetOutList = AttributeList.fromAttributeDescriptions(this, theWidget.description.out);

							for(var tempWidgetOutListIndex in tempWidgetOutList.getItems()) {
								if (theUnsatisfiedAttribute.equalsTypeOf(tempWidgetOutList.getItems()[tempWidgetOutListIndex])) {
									console.log("Discoverer: I have found an unregistered "+theWidget.name+".");
									var newWidget = new theWidget(this, tempWidgetOutList);
									theAggregator.addWidgetSubscription(newWidget);
									console.log("Discoverer: I registered "+theWidget.name+" and the Aggregator subscribed to it.");
									// remove satisfied attributes
									this._removeAttributesSatisfiedByWidget(aggregatorId, newWidget, unsatisfiedAttributes);
								}
							}
						}
					}
				}

				//check all interpreters' outAttributes
				for (var index in this._unregisteredInterpreters) {
					var theInterpreter = this._unregisteredInterpreters[index];
					for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
						var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
						//create temporary outAttributeList
						var tempOutList = AttributeList.fromAttributeDescriptions(this, theInterpreter.description.out);
						//create temporary inAttributeList
						var tempInList = AttributeList.fromAttributeDescriptions(this, theInterpreter.description.in);

						for (var tempOutAttributeIndex in tempOutList.getItems()) {
							if (theUnsatisfiedAttribute.equalsTypeOf(tempOutList.getItems()[tempOutAttributeIndex])) {
								console.log("Discoverer: I have found an unregistered "+theInterpreter.name+" that might satisfy the requested Attribute.");

								//if an interpreter can satisfy the Attribute, check if the inAttributes are satisfied
								if (this._checkInterpreterInAttributes(aggregatorId, theInterpreter)) {
									var newInterpreter = new theInterpreter(this, tempInList, tempOutList);
									//theAggregator.addWidgetSubscription(newInterpreter);
									console.log("Discoverer: I registered the Interpreter \""+theInterpreter.name+"\" .");
									// remove satisfied attributes
									this._removeAttributesSatisfiedByInterpreter(aggregatorId, newInterpreter, unsatisfiedAttributes);
								} else {
									console.log("Discoverer: I found an unregistered Interpreter but I couldn't satisfy the required Attributes.");
								}
							}
						}
					}
				}
			};

			/**
			 *
			 * @param aggregatorId
			 * @param theInterpreter
			 * @returns {boolean}
			 * @private
			 */
			Discoverer.prototype._checkInterpreterInAttributes = function(aggregatorId, theInterpreter) {
				var theAggregator = this.getComponent(aggregatorId);
				var canSatisfyInAttributes = true;
				var attributes;
				if (theInterpreter instanceof Interpreter) {
					attributes = theInterpreter.getInAttributes().getItems();
				} else {
					attributes = AttributeList.fromAttributeDescriptions(this, theInterpreter.description.in).getItems();
				}

				for (var attributeIdentifier in attributes) {
					// get the attribute
					var theAttribute = attributes[attributeIdentifier];
					console.log("Discoverer: The Interpreter needs the Attribute: "+theAttribute.toString(true)+".");
					// if required attribute is not already satisfied by the aggregator search for components that do
					if (!theAggregator.doesSatisfyTypeOf(theAttribute)) {
						console.log("Discoverer: The Aggregator doesn't satisfy "+theAttribute.toString(true)+", but I will search for components that do.");
						var newAttributeList = new AttributeList();
						newAttributeList.put(theAttribute);
						this.getComponentsForUnsatisfiedAttributes(aggregatorId, newAttributeList, false, [Widget, Interpreter]);
						// if the attribute still can't be satisfied drop the interpreter
						if (!theAggregator.doesSatisfyTypeOf(theAttribute)) {
							console.log("Discoverer: I couldn't find a component to satisfy "+theAttribute.toString(true)+". Dropping interpreter.");
							canSatisfyInAttributes = false;
							break;
						}
					} else {
						console.log("Discoverer: It seems that the Aggregator already satisfies the Attribute "+theAttribute.toString(true)+". Will move on.");
					}
				}

				return canSatisfyInAttributes;
			};

			/**
			 *
			 * @param aggregatorId
			 * @param theWidget
			 * @param unsatisfiedAttributes
			 * @private
			 */
			Discoverer.prototype._removeAttributesSatisfiedByWidget = function(aggregatorId, theWidget, unsatisfiedAttributes) {
				var theAggregator = this.getAggregator(aggregatorId);

				var attributes = theWidget.getOutAttributes().getItems();
				for (var attributeIndex in attributes) {
					var theAttribute = attributes[attributeIndex];
					// add the attribute type to the aggregator's list of handled attribute types
					if (!theAggregator.getOutAttributes().containsTypeOf(theAttribute)) theAggregator.addOutAttribute(theAttribute);
					console.log("Discoverer: The Aggregator can now satisfy attribute "+theAttribute.toString(true)+" with the help of "+theWidget.getName()+".");
					unsatisfiedAttributes.removeAttributeWithTypeOf(theAttribute);
				}
			};

			/**
			 *
			 * @param aggregatorId
			 * @param theInterpreter
			 * @param unsatisfiedAttributes
			 * @private
			 */
			Discoverer.prototype._removeAttributesSatisfiedByInterpreter = function(aggregatorId, theInterpreter, unsatisfiedAttributes) {
				var theAggregator = this.getAggregator(aggregatorId);

				var attributes = theInterpreter.getOutAttributes().getItems();
				for (var attributeIndex in attributes) {
					var theAttribute = attributes[attributeIndex];
					// add the attribute type to the aggregator's list of handled attribute types
					for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
						var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
						if (theUnsatisfiedAttribute.equalsTypeOf(theAttribute)) {
							if (!theAggregator.getOutAttributes().containsTypeOf(theAttribute)) theAggregator.addOutAttribute(theAttribute);
							console.log("Discoverer: The Aggregator can now satisfy Attribute "+theAttribute.toString(true)+" with the help of "+theInterpreter.getName()+".");
							theAggregator._interpretations.push(new Interpretation(theInterpreter.getId(), theInterpreter.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
						}
					}
					unsatisfiedAttributes.removeAttributeWithTypeOf(theAttribute, true);
				}
			};

			/**
			 *
			 * @returns {AttributeList}
			 */
			Discoverer.prototype.getPossibleAttributes = function() {
				var possibleAttributes = new AttributeList();

				// iterate over all unregistered widgets
				for (var widgetIndex in this._unregisteredWidgets) {
					var theWidget = this._unregisteredWidgets[widgetIndex];
					for (var attributeDescriptionIndex in theWidget.description.out) {
						var theAttribute = Attribute.fromAttributeDescription(this, theWidget.description.out[attributeDescriptionIndex]);
						possibleAttributes.putIfTypeNotContained(theAttribute);
					}
				}

				// iterate over all unregistered interpreters
				for (var interpreterIndex in this._unregisteredInterpreters) {
					var theInterpreter = this._unregisteredInterpreters[interpreterIndex];
					for (var outAttributeDescriptionIndex in theInterpreter.description.out) {
						var theAttribute = Attribute.fromAttributeDescription(this, theInterpreter.description.out[outAttributeDescriptionIndex]);
						possibleAttributes.putIfTypeNotContained(theAttribute);
					}
				}

				return possibleAttributes;
			};

			/**
			 *
			 *
			 * @param attributeNames
			 * @returns {*}
			 */
			Discoverer.prototype.getAttributesWithNames = function(attributeNames) {
				return AttributeList.fromAttributeNames(this, attributeNames);
			};

			/**
			 *
			 * @param theWidget
			 * @returns {boolean}
			 * @private
			 */
			Discoverer.prototype._checkWidgetRequirements = function(theWidget) {
				if (theWidget.description.requiredObjects && theWidget.description.requiredObjects instanceof Array) {
					for (var index in theWidget.description.requiredObjects) {
						var theRequiredObject = theWidget.description.requiredObjects[index];
						if (typeof window[theRequiredObject] == "undefined") return false;
					}
				}
				return true;
			};

			return Discoverer;
		})();
	}
);