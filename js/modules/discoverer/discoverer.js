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
                    this._translations.push(new Translation(firstAttribute,secondAttribute));
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
			 * @param {Array} [parameterList=[]]
             * @param {Boolean} [withSynonyms=true]
			 * @returns {Attribute}
			 */
			Discoverer.prototype.buildAttribute = function(name, type, parameterList, withSynonyms) {
				if (typeof withSynonyms == 'undefined') withSynonyms = true;
				if (typeof parameterList == 'undefined') parameterList = [];

                if (typeof name != 'string' || typeof type != 'string')
                    throw new Error("Parameters name and type must be of type String!");

                var newAttribute = new Attribute(true).withName(name).withType(type);

				for (var i = 0; i < parameterList.length; i++) {
					var param = parameterList[i];
					var value = param[1];
					var key = param[0];
					if (typeof key != 'undefined' && typeof value != 'undefined') newAttribute = newAttribute.withParameter(new Parameter().withKey(key).withValue(value));
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
			 * @private
			 * @param {String} aggregatorId the aggregator's ID
			 * @param {AttributeList} unsatisfiedAttributes A list of attributes that components should be searched for.
			 * @param {boolean} all If true all attributes must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 */
			Discoverer.prototype.getComponentsForUnsatisfiedAttributes = function(aggregatorId, unsatisfiedAttributes, all, componentTypes){
				//Discoverer gets a list of attributes to satisfy

				console.log('Discoverer: I need to satisfy the following attributes: '+unsatisfiedAttributes.getItems()+' .' );

				//look at all the already registered components
				console.log("Discoverer: Let's look at my registered components.");

				var relevantComponents = this.getComponentsByAttributes(unsatisfiedAttributes, all, componentTypes);
				console.log("Discoverer: I found " + relevantComponents.length + " registered component(s) that might satisfy the requested attributes.");

				//iterate over the found components
				for(var index in relevantComponents) {
					var theComponent = relevantComponents[index];
					console.log("Discoverer: Let's look at component " + theComponent.getName() + ".");

					// if the component was added before, ignore it
					if (!this.getAggregator(aggregatorId)._hasComponent(theComponent.getId())) {
						var outAttributes = theComponent.getOutAttributes().getItems();

						// if component is a widget and it wasn't added before, subscribe to its callbacks
						if (theComponent instanceof Widget) {
							console.log("Discoverer: It's a Widget.");

							console.log("Discoverer: You should subscribe to the Widget.");
							this.getAggregator(aggregatorId).addWidgetSubscription(theComponent);
							// remove satisfied attributes
							for (var widgetOutAttributeIndex in outAttributes) {
								var widgetOutAttribute = outAttributes[widgetOutAttributeIndex];
								// add the attribute type to the aggregators list of handled attribute types
								if (!this.getAggregator(aggregatorId).getOutAttributes().containsTypeOf(widgetOutAttribute)) this.getAggregator(aggregatorId).addOutAttribute(widgetOutAttribute);
								console.log("Aggregator: I can now satisfy attribute " + widgetOutAttribute + " with the help of " + theComponent.getName() + "! That was easy :)");
								unsatisfiedAttributes.removeAttributeWithTypeOf(widgetOutAttribute);
							}
						} else if (theComponent instanceof Interpreter) { // if the component is an interpreter and all its in attributes can be satisfied, add the interpreter
							console.log("Discoverer: It's an Interpreter.");
							var inAttributes = theComponent.getInAttributes().getItems();
							var canSatisfyInAttributes = true;

							// iterate over the attributes needed to satisfy the interpreter
							for (var inAttributeIdentifier in inAttributes) {
								// get the attribute
								var theInAttribute = inAttributes[inAttributeIdentifier];
								console.log("Discoverer: The Interpreter needs the attribute: " + theInAttribute + ".");

								// if required attribute is not already satisfied by the aggregator search for components that do
								if (!this.getAggregator(aggregatorId).doesSatisfyTypeOf(theInAttribute)) {
									console.log("Discoverer: I can't satisfy " + theInAttribute + ", but i will search for components that can");
									var newAttributeList = new AttributeList();
									newAttributeList.put(theInAttribute);
									this.getComponentsForUnsatisfiedAttributes(aggregatorId, newAttributeList, false, [Widget, Interpreter]);
									// if the attribute still can't be satisfied drop the interpreter
									if (!this.getAggregator(aggregatorId).doesSatisfyTypeOf(theInAttribute)) {
										console.log("Discoverer: I couldn't find a component to satisfy " + theInAttribute + ". Dropping interpreter " + theComponent.getName() + ". Bye bye.");
										canSatisfyInAttributes = false;
										break;
									}
								} else {
									console.log("Discoverer: It seems that I already satisfy the attribute " + theInAttribute + ". Let's move on.");
								}
							}
							if (canSatisfyInAttributes) {
								// remove satisfied attribute
								for (var interpreterOutAttributeIndex in outAttributes) {
									var interpreterOutAttribute = outAttributes[interpreterOutAttributeIndex];
									// add the attribute type to the aggregators list of handled attribute types
									for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
										var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
										if (theUnsatisfiedAttribute.equalsTypeOf(interpreterOutAttribute)) {
											this.getAggregator(aggregatorId).addOutAttribute(theUnsatisfiedAttribute);
											console.log("Discoverer: I can now satisfy attribute " + theUnsatisfiedAttribute + " with the help of " + theComponent.getName() + "! Great!");
											this.getAggregator(aggregatorId)._interpretations.push(new Interpretation(theComponent.getId(), theComponent.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
										}
									}
									unsatisfiedAttributes.removeAttributeWithTypeOf(interpreterOutAttribute, true);
								}
							} else {
								console.log("Discoverer: Found interpreter but can't satisfy required attributes.");
								for (var j in theComponent.getInAttributes().getItems()) {
									console.log("Discoverer: Missing " + theComponent.getInAttributes().getItems()[j] + ".");
								}
							}
						}
					}
				}

				//look at all unregistered components
				console.log("Discoverer: Let's look at the unregistered Components.");

				//check all Widget's outAttributes
				console.log("Discoverer: Let's look at the unregistered Widgets.")
				var foundWidget = false;
				for(var widgetIndex in this._unregisteredWidgets){
					var theWidget = this._unregisteredWidgets[widgetIndex];
					for(var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()){
						var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
						//if a Widget can satisfy the Attribute, register it and subscribe the Aggregator

						//create temporary OutAttributeList
						var tempWidgetOutList = new AttributeList();
						for(var tempOutAttributeIndex in theWidget.inOut.out) {
							var name = theWidget.inOut.out[tempOutAttributeIndex].name;
							var type = theWidget.inOut.out[tempOutAttributeIndex].type;
							var parameterList = theWidget.inOut.out[tempOutAttributeIndex].parameterList;
							tempWidgetOutList.put(this.buildAttribute(name, type, parameterList, true));
						}
						for(var tempOutAttribute = 0; tempOutAttribute < tempWidgetOutList.size(); tempOutAttribute++) {
							if (theUnsatisfiedAttribute.equalsTypeOf(tempWidgetOutList.getItems()[tempOutAttribute])) {
								console.log("Discoverer: I have found an unregistered Widget \"" + theWidget.name + "\".");
								var newWidget = new theWidget(this, tempWidgetOutList);
								this.getAggregator(aggregatorId).addWidgetSubscription(newWidget);

								console.log("Discoverer: I registered the Widget \"" + theWidget.name + "\" and subscribed to it.");
								// remove satisfied attributes
								var widgetOutAttributes = newWidget.getOutAttributes();
								for (var toRemoveIndex = 0; toRemoveIndex < widgetOutAttributes.size(); toRemoveIndex++) {
									var toRemoveOutAttribute = newWidget.getOutAttributes().getItems()[toRemoveIndex];
									// add the attribute type to the aggregators list of handled attribute types
									if (!this.getAggregator(aggregatorId).getOutAttributes().containsTypeOf(toRemoveOutAttribute)) this.getAggregator(aggregatorId).addOutAttribute(toRemoveOutAttribute);
									console.log("Aggregator "+this.getAggregator(aggregatorId).id+": I can now satisfy attribute " + toRemoveOutAttribute + " with the help of " + newWidget.getName() + "! That was easy :)");
									unsatisfiedAttributes.removeAttributeWithTypeOf(toRemoveOutAttribute);
								}
								foundWidget = true;

							}
						}


					}

				}
				if (!foundWidget) {
					//check all interpreters' outAttributes
					console.log("Discoverer: Let's look at the unregistered interpreters.")
					for (var index in this._unregisteredInterpreters) {
						var theInterpreter = this._unregisteredInterpreters[index];
						for (var unsatisfiedAttributeIndex in unsatisfiedAttributes.getItems()) {
							var theUnsatisfiedAttribute = unsatisfiedAttributes.getItems()[unsatisfiedAttributeIndex];
							//if an interpreter can satisfy the Attribute, check if the inAttributes are satisfied

							//create temporary outAttributeList
							var tempOutList = new AttributeList();
							for (var interpreterOutAttributeIndex in theInterpreter.inOut.out) {
								var outName = theInterpreter.inOut.out[interpreterOutAttributeIndex].name;
								var outType = theInterpreter.inOut.out[interpreterOutAttributeIndex].type;
								var outParameterList = theInterpreter.inOut.out[interpreterOutAttributeIndex].parameterList;
								tempOutList.put(this.buildAttribute(outName, outType, outParameterList, true));
							}

							//create temporary inAttributeList
							var tempInList = new AttributeList();
							for (var interpreterInAttributeIndex in theInterpreter.inOut.in) {
								var inName = theInterpreter.inOut.in[interpreterInAttributeIndex].name;
								var inType = theInterpreter.inOut.in[interpreterInAttributeIndex].type;
								var inParameterList = theInterpreter.inOut.in[interpreterInAttributeIndex].parameterList;
								var tempInAttribute = this.buildAttribute(inName, inType, inParameterList, true);
								tempInList.put(tempInAttribute);
							}

							for (var tempOutAttribute = 0; tempOutAttribute < tempOutList.size(); tempOutAttribute++) {
								if (theUnsatisfiedAttribute.equalsTypeOf(tempOutList.getItems()[tempOutAttribute])) {
									console.log("Discoverer: I have found an unregistered Interpreter \"" + theInterpreter.name + "\".");
									for (var inAttributeIndex = 0; inAttributeIndex < tempInList.size(); inAttributeIndex++) {
										var theInAttribute = tempInList.getItems()[inAttributeIndex];
										console.log("Discoverer: The Interpreter needs the attribute: " + theInAttribute + ".");

										// if required attribute is not already satisfied by the aggregator search for components that do
										if (!this.getAggregator(aggregatorId).doesSatisfyTypeOf(theInAttribute)) {
											console.log("Discoverer: I can't satisfy " + theInAttribute + ", but i will search for components that can");
											var newAttributeList = new AttributeList();
											newAttributeList.put(theInAttribute);
											this.getComponentsForUnsatisfiedAttributes(aggregatorId, newAttributeList, false, [Widget, Interpreter]);
											// if the attribute still can't be satisfied drop the interpreter
											if (!this.getAggregator(aggregatorId).doesSatisfyTypeOf(theInAttribute)) {
												console.log("Discoverer: I couldn't find a component to satisfy " + theInAttribute + ". Dropping interpreter " + theInterpreter.name + ". Bye bye.");
												canSatisfyInAttributes = false;
												break;
											}
											var newInterpreter = new theInterpreter(this, tempInList, tempOutList);
											this.getAggregator(aggregatorId).addWidgetSubscription(newInterpreter);
											console.log("Discoverer: I registered the Interpreter \"" + theInterpreter.name + "\" .");
											// remove satisfied attributes
											var interpreterOutAttributes = newInterpreter.getOutAttributes();
											for (var toRemoveIndex = 0; toRemoveIndex < interpreterOutAttributes.size(); toRemoveIndex++) {
												var toRemoveOutAttribute = newInterpreter.getOutAttributes().getItems()[toRemoveIndex];
												// add the attribute type to the aggregators list of handled attribute types
												if (!this.getAggregator(aggregatorId).getOutAttributes().containsTypeOf(toRemoveOutAttribute)) this.getAggregator(aggregatorId).addOutAttribute(toRemoveOutAttribute);
												console.log("Aggregator "+this.getAggregator(aggregatorId).id+": I can now satisfy attribute " + toRemoveOutAttribute + " with the help of " + newInterpreter.getName() + "! That was easy :)");
												this.getAggregator(aggregatorId)._interpretations.push(new Interpretation(newInterpreter.getId(), newInterpreter.getInAttributes(), new AttributeList().withItems([theUnsatisfiedAttribute])));
												unsatisfiedAttributes.removeAttributeWithTypeOf(toRemoveOutAttribute);
											}
										} else {
											console.log("Discoverer: It seems that I already satisfy the attribute " + theInAttribute + ". Let's move on.");
										}
									}
								}
							}

						}
					}
				}
			};

			return Discoverer;
		})();
	}
);