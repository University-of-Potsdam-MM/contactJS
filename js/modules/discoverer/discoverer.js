define(['contextInformation', 'contextInformationList', 'translation', 'parameter', 'parameterList', 'widget', 'interpreter', 'aggregator',  'interpretation' ],
	function(ContextInformation, ContextInformationList, Translation, Parameter, ParameterList, Widget, Interpreter, Aggregator, Interpretation) {
		return (function() {
			/**
			 * The Discoverer handles requests for components and contextual information.
			 * All known components given in the associated functions will be registered as startup.
			 *
			 * @class Discoverer
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
				 * List of translations or synonymous contextual information, respectively.
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
                        throw new Error("Translations must consist of exactly 2 contextual information!");
					// check for correct number of contextual information building blocks
					for (var j in translationArray) {
                        if (translationArray[j].length > 3 || translationArray[j].length < 2)
                            throw new Error("Please provide a name, type and (optional) list of parameters!");
                    }
					// build contextual information from arrays containing name, type (and parameters)
                    var firstContextInformation = this.buildContextInformation(
                        translationArray[0][0],
                        translationArray[0][1],
                        translationArray[0][2],
                        false
                    );
                    var secondContextInformation = this.buildContextInformation(
                        translationArray[1][0],
                        translationArray[1][1],
                        translationArray[1][2],
                        false
                    );
					// add built contextual information to translations
                    this._translations.push(new Translation(firstContextInformation, secondContextInformation));
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
			 * Returns all registered components that have the specified contextual information as
			 * outputContextInformation. It can be chosen between the verification of
			 * all contextual information or at least one information.
			 *
			 * @param {ContextInformationList|Array.<ContextInformation>} contextInformationListOrArray A list of searched contextual information.
			 * @param {Boolean} all Selection of the verification mode.
			 * @param {Array} componentTypes Components types to search for.
			 * @returns {Array}
			 */
			Discoverer.prototype.getRegisteredComponentsByContextInformation = function(contextInformationListOrArray, all, componentTypes) {
				var componentList = [];
				var list = [];
				if (typeof componentTypes == "undefined") componentTypes = [Widget, Interpreter, Aggregator];
				if (contextInformationListOrArray instanceof Array) {
					list = contextInformationListOrArray;
				} else if (contextInformationListOrArray instanceof ContextInformationList) {
					list = contextInformationListOrArray.getItems();
				}
				if (typeof list != "undefined") {
					var components = this.getComponents(componentTypes);
					for (var i in components) {
						var theComponent = components[i];
						if(all && this._containsAllContextInformation(theComponent, list)) {
							componentList.push(theComponent);
						} else if(!all && this._containsAtLeastOneContextInformation(theComponent, list)) {
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
			 * Builds a new {ContextInformation} from given name, type and parameters,
			 * adding known translations to its synonyms.
			 *
			 * @param {string} contextInformationName
			 * @param {string} contextInformationDataType
			 * @param {array} [parameterList=[]]
             * @param {boolean} [withSynonyms=true]
			 * @returns {ContextInformation}
			 */
			Discoverer.prototype.buildContextInformation = function(contextInformationName, contextInformationDataType, parameterList, withSynonyms) {
				if (typeof withSynonyms == 'undefined') withSynonyms = true;
				if (typeof parameterList == 'undefined') parameterList = [];

                if (typeof contextInformationName != 'string' || typeof contextInformationDataType != 'string')
                    throw new Error("Parameters name and type must be of type String!");

                var newContextInformation = new ContextInformation(true).withName(contextInformationName).withDataType(contextInformationDataType);

				for (var i = 0; i < parameterList.length; i++) {
					var param = parameterList[i];
					var value = param[2];
					var type = param[1];
					var key = param[0];
					if (typeof key != 'undefined' && typeof value != 'undefined')
						newContextInformation = newContextInformation.withParameter(new Parameter().withKey(key).withDataType(type).withValue(value));
				}

                if (withSynonyms) {
                    for (var index in this._translations) {
                        var translation = this._translations[index];
						newContextInformation = translation.translate(newContextInformation);
                    }
                }

				return newContextInformation;
			};


			/***********************************************************************
			 * Helper *
			 **********************************************************************/
			/**
			 * Helper: Verifies whether a component description contains all searched contextual information.
			 *
			 * @private
			 * @param {Widget|Interpreter|Aggregator} component description of a component
			 * @param {Array} list searched contextual information
			 * @returns {boolean}
			 */
			Discoverer.prototype._containsAllContextInformation = function(component, list) {
				for (var j in list) {
					var contextInformation = list[j];
					if (!component.doesSatisfyKindOf(contextInformation)) {
						return false;
					}
				}
				return true;
			};

			/**
			 * Helper: Verifies whether a component description contains at least on searched contextual information.
			 *
			 * @private
			 * @param {Widget|Interpreter|Aggregator} component description of a component
			 * @param {Array} list searched contextual information
			 * @returns {boolean}
			 */
			Discoverer.prototype._containsAtLeastOneContextInformation = function(component, list) {
				for (var j in list) {
					var contextInformation = list[j];
					if (component.doesSatisfyKindOf(contextInformation)) {
						return true;
					}
				}
				return false;
			};

			/**
			 * Searches for components that can satisfy the requested contextual information. Searches recursively through all
			 * registered and unregistered components and initiates them.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {ContextInformationList} unsatisfiedContextInformation A list of contextual information that components should be searched for.
			 * @param {Boolean} all If true all contextual information must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 */
			Discoverer.prototype.getComponentsForUnsatisfiedContextInformation = function(aggregatorId, unsatisfiedContextInformation, all, componentTypes){
				// the discoverer gets a list of contextual information to satisfy
				console.log('Discoverer: I will look for components that satisfy the following contextual information: '+unsatisfiedContextInformation.getItems()+'.' );
				// look at all the already registered components
				this._getRegisteredComponentsForUnsatisfiedContextInformation(aggregatorId, unsatisfiedContextInformation, all, componentTypes);
				// look at all unregistered components
				this._getUnregisteredComponentsForUnsatisfiedContextInformation(aggregatorId, unsatisfiedContextInformation);
			};

			/**
			 * Searches for registered components that satisfy the requested contextual information.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {ContextInformationList} unsatisfiedContextInformation A list of contextual information that components should be searched for.
			 * @param {Boolean} all If true all contextual information must be satisfied by a single component.
			 * @param {Array} componentTypes An array of components classes that should be searched for (e.g. Widget, Interpreter and Aggregator).
			 * @private
			 */
			Discoverer.prototype._getRegisteredComponentsForUnsatisfiedContextInformation = function(aggregatorId, unsatisfiedContextInformation, all, componentTypes) {
				var theAggregator = this.getAggregator(aggregatorId);
				console.log("Discoverer: Let's look at my registered components.");

				var relevantComponents = this.getRegisteredComponentsByContextInformation(unsatisfiedContextInformation, all, componentTypes);
				console.log("Discoverer: I found " + relevantComponents.length + " registered component(s) that might satisfy the requested contextual information.");

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
							this._removeContextInformationSatisfiedByWidget(aggregatorId, theComponent, unsatisfiedContextInformation);
						} else if (theComponent instanceof Interpreter) { // if the component is an interpreter and all its input contextual information can be satisfied, add the interpreter
							console.log("Discoverer: It's an Interpreter.");

							if (this._checkInterpreterInputContextInformation(aggregatorId, theComponent)) {
								// remove satisfied contextual information
								this._removeContextInformationSatisfiedByInterpreter(aggregatorId, theComponent, unsatisfiedContextInformation);
							} else {
								console.log("Discoverer: I found a registered Interpreter but I couldn't satisfy the required contextual information.");
								for (var j in theComponent.getInputContextInformation().getItems()) {
									console.log("Discoverer: It is missing " + theComponent.getInputContextInformation().getItems()[j] + ".");
								}
							}
						} else {
							console.log("Discoverer: It seems that the component was added before.");
						}
					}
				}
			};

			/**
			 * Searches for unregistered components that satisfy the requested contextual information.
			 *
			 * @param {String} aggregatorId The aggregator's ID
			 * @param {ContextInformationList} unsatisfiedContextInformation A list of contextual information that components should be searched for.
			 * @private
			 */
			Discoverer.prototype._getUnregisteredComponentsForUnsatisfiedContextInformation = function(aggregatorId, unsatisfiedContextInformation) {
				var theAggregator = this.getAggregator(aggregatorId);
				console.log("Discoverer: Let's look at the unregistered components.");

				//check all Widget's output contextual information
				for(var widgetIndex in this._unregisteredWidgets){
					var theWidget = this._unregisteredWidgets[widgetIndex];
					// check i
					if (this._checkComponentRequirements(theWidget)) {
						for(var unsatisfiedContextInformationIndex in unsatisfiedContextInformation.getItems()){
							var theUnsatisfiedContextInformation = unsatisfiedContextInformation.getItems()[unsatisfiedContextInformationIndex];
							//if a Widget can satisfy the ContextInformation, register it and subscribe the Aggregator

							//create temporary OutputContextInformationList
							var tempWidgetOutList = ContextInformationList.fromContextInformationDescriptions(this, theWidget.description.out);

							for(var tempWidgetOutListIndex in tempWidgetOutList.getItems()) {
								if (theUnsatisfiedContextInformation.isKindOf(tempWidgetOutList.getItems()[tempWidgetOutListIndex])) {
									console.log("Discoverer: I have found an unregistered "+theWidget.name+".");
									var newWidget = new theWidget(this, tempWidgetOutList);
									theAggregator.addWidgetSubscription(newWidget);
									console.log("Discoverer: I registered "+theWidget.name+" and the Aggregator subscribed to it.");
									// remove satisfied contextual information
									this._removeContextInformationSatisfiedByWidget(aggregatorId, newWidget, unsatisfiedContextInformation);
								}
							}
						}
					}
				}

				//check all interpreters' output contextual information
				for (var index in this._unregisteredInterpreters) {
					var theInterpreter = this._unregisteredInterpreters[index];
					if (this._checkComponentRequirements(theInterpreter)) {
						for (var unsatisfiedContextInformationIndex in unsatisfiedContextInformation.getItems()) {
							var theUnsatisfiedContextInformation = unsatisfiedContextInformation.getItems()[unsatisfiedContextInformationIndex];
							//create temporary outputContextInformationList
							var tempOutList = ContextInformationList.fromContextInformationDescriptions(this, theInterpreter.description.out);
							//create temporary inContextInformationList
							var tempInList = ContextInformationList.fromContextInformationDescriptions(this, theInterpreter.description.in);

							for (var tempOutputContextInformationIndex in tempOutList.getItems()) {
								if (theUnsatisfiedContextInformation.isKindOf(tempOutList.getItems()[tempOutputContextInformationIndex])) {
									console.log("Discoverer: I have found an unregistered "+theInterpreter.name+" that might satisfy the requested contextual information.");

									//if an interpreter can satisfy the ContextInformation, check if the inContextInformation are satisfied
									if (this._checkInterpreterInputContextInformation(aggregatorId, theInterpreter)) {
										var newInterpreter = new theInterpreter(this, tempInList, tempOutList);
										//theAggregator.addWidgetSubscription(newInterpreter);
										console.log("Discoverer: I registered the Interpreter \""+theInterpreter.name+"\" .");
										// remove satisfied contextual information
										this._removeContextInformationSatisfiedByInterpreter(aggregatorId, newInterpreter, unsatisfiedContextInformation);
									} else {
										console.log("Discoverer: I found an unregistered Interpreter but I couldn't satisfy the required contextual information.");
									}
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
			Discoverer.prototype._checkInterpreterInputContextInformation = function(aggregatorId, theInterpreter) {
				var theAggregator = this.getComponent(aggregatorId);
				var canSatisfyInContextInformation = true;
				var contextInformation;
				if (theInterpreter instanceof Interpreter) {
					contextInformation = theInterpreter.getInputContextInformation().getItems();
				} else {
					contextInformation = ContextInformationList.fromContextInformationDescriptions(this, theInterpreter.description.in).getItems();
				}

				for (var contextInformationIdentifier in contextInformation) {
					// get the contextual information
					var theContextInformation = contextInformation[contextInformationIdentifier];
					console.log("Discoverer: The Interpreter needs the contextual information: "+theContextInformation.toString(true)+".");
					// if required contextual information is not already satisfied by the aggregator search for components that do
					if (!theAggregator.doesSatisfyKindOf(theContextInformation)) {
						console.log("Discoverer: The Aggregator doesn't satisfy "+theContextInformation.toString(true)+", but I will search for components that do.");
						var newContextInformationList = new ContextInformationList();
						newContextInformationList.put(theContextInformation);
						this.getComponentsForUnsatisfiedContextInformation(aggregatorId, newContextInformationList, false, [Widget, Interpreter]);
						// if the contextual information still can't be satisfied drop the interpreter
						if (!theAggregator.doesSatisfyKindOf(theContextInformation)) {
							console.log("Discoverer: I couldn't find a component to satisfy "+theContextInformation.toString(true)+". Dropping interpreter.");
							canSatisfyInContextInformation = false;
							break;
						}
					} else {
						console.log("Discoverer: It seems that the Aggregator already satisfies the contextual information "+theContextInformation.toString(true)+". Will move on.");
					}
				}

				return canSatisfyInContextInformation;
			};

			/**
			 *
			 * @param aggregatorId
			 * @param theWidget
			 * @param unsatisfiedContextInformation
			 * @private
			 */
			Discoverer.prototype._removeContextInformationSatisfiedByWidget = function(aggregatorId, theWidget, unsatisfiedContextInformation) {
				var theAggregator = this.getAggregator(aggregatorId);

				var contextInformation = theWidget.getOutputContextInformation().getItems();
				for (var contextInformationIndex in contextInformation) {
					var theContextInformation = contextInformation[contextInformationIndex];
					// add the contextual information type to the aggregator's list of handled contextual information
					if (!theAggregator.getOutputContextInformation().containsKindOf(theContextInformation)) theAggregator.addOutputContextInformation(theContextInformation);
					console.log("Discoverer: The Aggregator can now satisfy contextual information "+theContextInformation.toString(true)+" with the help of "+theWidget.getName()+".");
					unsatisfiedContextInformation.removeContextInformationOfKind(theContextInformation);
				}
			};

			/**
			 *
			 * @param aggregatorId
			 * @param theInterpreter
			 * @param unsatisfiedContextInformation
			 * @private
			 */
			Discoverer.prototype._removeContextInformationSatisfiedByInterpreter = function(aggregatorId, theInterpreter, unsatisfiedContextInformation) {
				var theAggregator = this.getAggregator(aggregatorId);

				var contextInformation = theInterpreter.getOutputContextInformation().getItems();
				for (var contextInformationIndex in contextInformation) {
					var theContextInformation = contextInformation[contextInformationIndex];
					// add the contextual informationto the aggregator's list of handled contextual information
					for (var unsatisfiedContextInformationIndex in unsatisfiedContextInformation.getItems()) {
						var theUnsatisfiedContextInformation = unsatisfiedContextInformation.getItems()[unsatisfiedContextInformationIndex];
						if (theUnsatisfiedContextInformation.isKindOf(theContextInformation)) {
							if (!theAggregator.getOutputContextInformation().containsKindOf(theContextInformation)) theAggregator.addOutputContextInformation(theContextInformation);
							console.log("Discoverer: The Aggregator can now satisfy contextual information "+theContextInformation.toString(true)+" with the help of "+theInterpreter.getName()+".");
							theAggregator._interpretations.push(new Interpretation(theInterpreter.getId(), theInterpreter.getInputContextInformation(), new ContextInformationList().withItems([theUnsatisfiedContextInformation])));
						}
					}
					unsatisfiedContextInformation.removeContextInformationOfKind(theContextInformation, true);
				}
			};

			/**
			 *
			 * @returns {ContextInformationList}
			 */
			Discoverer.prototype.getPossibleContextInformation = function() {
				var possibleContextInformation = new ContextInformationList();

				// iterate over all unregistered widgets
				for (var widgetIndex in this._unregisteredWidgets) {
					var theWidget = this._unregisteredWidgets[widgetIndex];
					for (var contextInformationDescriptionIndex in theWidget.description.out) {
						var theContextInformation = ContextInformation.fromContextInformationDescription(this, theWidget.description.out[contextInformationDescriptionIndex]);
						possibleContextInformation.putIfKindOfNotContained(theContextInformation);
					}
				}

				// iterate over all unregistered interpreters
				for (var interpreterIndex in this._unregisteredInterpreters) {
					var theInterpreter = this._unregisteredInterpreters[interpreterIndex];
					for (var outputContextInformationDescriptionIndex in theInterpreter.description.out) {
						var theContextInformation = ContextInformation.fromContextInformationDescription(this, theInterpreter.description.out[outputContextInformationDescriptionIndex]);
						possibleContextInformation.putIfKindOfNotContained(theContextInformation);
					}
				}

				return possibleContextInformation;
			};

			/**
			 *
			 *
			 * @param contextInformationNames
			 * @returns {*}
			 */
			Discoverer.prototype.getContextInformationWithNames = function(contextInformationNames) {
				return ContextInformation.fromContextInformationNames(this, contextInformationNames);
			};

			/**
			 *
			 * @param {Component} theComponent
			 * @returns {boolean}
			 * @private
			 */
			Discoverer.prototype._checkComponentRequirements = function(theComponent) {
				if (theComponent.description.requiredObjects && theComponent.description.requiredObjects instanceof Array) {
					for (var index in theComponent.description.requiredObjects) {
						var theRequiredObject = theComponent.description.requiredObjects[index];
						var theRequiredObjectSplit = theRequiredObject.split(".");

						if (theRequiredObjectSplit.length > 1) {
							var scope = window;
							for (var objectIndex in theRequiredObjectSplit) {
								var objectComponent = theRequiredObjectSplit[objectIndex];
								if (typeof scope[objectComponent] !== "undefined") {
									scope = scope[objectComponent]
								} else {
									console.log("Discoverer: A component requires "+theRequiredObject+", but it's not available.");
									return false;
								}
							}
						} else {
							if (typeof window[theRequiredObject] === "undefined") {
								console.log("Discoverer: A component requires "+theRequiredObject+", but it's not available.");
								return false;
							}
						}
					}
				}
				return true;
			};

			return Discoverer;
		})();
	}
);