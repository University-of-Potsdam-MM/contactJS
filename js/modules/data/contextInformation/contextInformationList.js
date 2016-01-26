define(['dataList', 'contextInformation'], function(DataList, ContextInformation) {
    return (function() {
        /**
         * This class represents a list for ContextInformation.
         *
         * @extends DataList
         * @class ContextInformationList
         */
        function ContextInformationList() {
            DataList.call(this);
            this._type = ContextInformation;

            this._cacheSession = null;

            return this;
        }

        ContextInformationList.prototype = Object.create(DataList.prototype);
        ContextInformationList.prototype.constructor = ContextInformationList;

        /**
         * Create a ContextInformationList from the description provided by a Widget or Interpreter.
         *
         * @static
         * @param {Discoverer} discoverer
         * @param {Array} contextInformationDescriptions
         * @returns {ContextInformationList}
         */
        ContextInformationList.fromContextInformationDescriptions = function(discoverer, contextInformationDescriptions) {
            var theContextInformationList = new ContextInformationList();
            for(var contextInformationDescriptionIndex in contextInformationDescriptions) {
                theContextInformationList.put(ContextInformation.fromContextInformationDescription(discoverer, contextInformationDescriptions[contextInformationDescriptionIndex]));
            }
            return theContextInformationList;
        };

        /**
         * Creates a ContextInformationList from an array of context information names.
         *
         * @param {Discoverer} discoverer
         * @param {Array<String>} contextInformationNames
         * @returns {ContextInformationList}
         */
        ContextInformationList.fromContextInformationNames = function(discoverer, contextInformationNames) {
            var theContextInformationList = new ContextInformationList();
            var possibleContextInformation = discoverer.getPossibleContextInformation();

            for (var contextInformationNameIndex in contextInformationNames) {
                var theContextInformationName = contextInformationNames[contextInformationNameIndex];
                theContextInformationList.put(possibleContextInformation._getContextInformationWithName(theContextInformationName));
            }

            return theContextInformationList;
        };

        /**
         * Adds the specified item to the itemList.
         *
         * @public
         * @param {ContextInformation} contextInformation
         * @param {Boolean} [multipleInstances=false]
         */

        ContextInformationList.prototype.put = function(contextInformation, multipleInstances) {
            multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
            if (contextInformation instanceof this._type) {
                if (multipleInstances || !(this.containsKindOf(contextInformation))) {
                    this._items.push(contextInformation);
                } else {
                    this.updateValue(contextInformation);
                }
            }
        };

        /**
         * Adds all items in the specified list to the itemList.
         *
         * @public
         * @param {(ContextInformationList|Array)} contextInformationList ContextInformationList
         */
        ContextInformationList.prototype.putAll = function(contextInformationList) {
            var list = [];
            if (contextInformationList instanceof Array) {
                list = contextInformationList;
            } else if (contextInformationList instanceof ContextInformationList) {
                list = contextInformationList.getItems();
            }
            for ( var i in list) {
                this.put(list[i]);
            }
        };

        /**
         *
         * @param contextInformation
         */
        ContextInformationList.prototype.putIfKindOfNotContained = function(contextInformation) {
            if (!this.containsKindOf(contextInformation)) this.put(contextInformation);
        };

        /**
         * Verifies whether the given item is included in the list.
         *
         * @param {ContextInformation} contextInformation Contextual information that should be verified.
         * @returns {boolean}
         */
        ContextInformationList.prototype.contains = function(contextInformation) {
            if (contextInformation instanceof ContextInformation) {
                for (var index in this.getItems()) {
                    var theContextInformation = this.getItems()[index];
                    if (theContextInformation.equals(contextInformation)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Verifies whether a contextual information of the given kind is included in this list.
         *
         * @param {ContextInformation} contextInformation Contextual information that should be verified.
         * @returns {Boolean}
         */
        ContextInformationList.prototype.containsKindOf = function(contextInformation) {
            if (contextInformation instanceof ContextInformation) {
                for (var index in this.getItems()) {
                    var theContextInformation = this.getItems()[index];
                    if (theContextInformation.isKindOf(contextInformation)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Compare the specified ContextInformationList with this instance.
         *
         * @param {ContextInformationList} contextInformationList ContextInformationList that should be compared.
         * @returns {boolean}
         */
        ContextInformationList.prototype.equals = function(contextInformationList) {
            if (contextInformationList instanceof ContextInformationList && contextInformationList.size() == this.size()) {
                for (var index in contextInformationList.getItems()) {
                    var theContextInformation = contextInformationList.getItems()[index];
                    if (!this.contains(theContextInformation)) return false;
                }
                return true;
            }
            return false;
        };

        /**
         * Compare the specified ContextInformationList with this instance.
         *
         * @param {ContextInformationList} contextInformationList ContextInformationList that should be compared.
         * @returns {boolean}
         */
        ContextInformationList.prototype.isKindOf = function(contextInformationList) {
            if (contextInformationList instanceof ContextInformationList  && contextInformationList.size() == this.size()) {
                for (var index in contextInformationList.getItems()) {
                    var theContextInformation = contextInformationList.getItems()[index];
                    if (!this.containsKindOf(theContextInformation)) return false;
                }
                return true;
            }
            return false;
        };

        /**
         *
         * @param {String} contextInformationName
         * @returns {?ContextInformation}
         * @private
         */
        ContextInformationList.prototype._getContextInformationWithName = function(contextInformationName) {
            for (var index in this._items) {
                var theContextInformation = this._items[index];
                if (theContextInformation.getName() == contextInformationName) return theContextInformation;
            }
            return null;
        };

        /**
         * Returns only this values that matches to the given type.
         *
         * @param {(ContextInformationList|Array)} contextInformationList Contextual information that should be returned.
         * @returns {ContextInformationList}
         */
        ContextInformationList.prototype.getSubset = function(contextInformationList) {
            var response = new ContextInformationList();
            var list = [];
            if (contextInformationList instanceof Array) {
                list = contextInformationList;
            } else if (contextInformationList instanceof ContextInformationList) {
                list = contextInformationList.getItems();
            }
            for (var i in list) {
                var theContextInformation = list[i];
                if (theContextInformation instanceof ContextInformation) {
                    var responseContextInformation = this.getContextInformationOfKind(theContextInformation);
                    if (typeof responseContextInformation != "undefined") {
                        response.put(responseContextInformation);
                    }
                }
            }
            return response;
        };

        /**
         * Returns a subset without the given types.
         *
         * @param {(ContextInformationList|Array)} contextInformationList Contextual information to be excluded
         * @returns {ContextInformationList}
         */
        ContextInformationList.prototype.getSubsetWithoutItems = function(contextInformationList) {
            var response = this;
            var list = [];
            if (contextInformationList instanceof Array) {
                list = contextInformationList;
            } else if (contextInformationList instanceof ContextInformationList) {
                list = contextInformationList.getItems();
            }
            for (var i in list) {
                var theContextInformation = list[i];
                if (theContextInformation instanceof ContextInformation) {
                    response.removeContextInformationOfKind(theContextInformation);
                }
            }
            return response;
        };

        /**
         * Creates a clone of the current list.
         *
         * @param {Boolean} kindOnly
         * @returns {ContextInformationList}
         */
        ContextInformationList.prototype.clone = function(kindOnly) {
            var newList = new ContextInformationList();
            for (var index in this._items) {
                var oldContextInformation = this._items[index];
                var newContextInformation = new ContextInformation(true)
                    .withName(oldContextInformation.getName())
                    .withDataType(oldContextInformation.getDataType())
                    .withParameters(oldContextInformation.getParameters())
                    .withSynonyms(oldContextInformation.getSynonyms());
                if (!kindOnly) newContextInformation.setValue(oldContextInformation.getValue());
                newList.put(newContextInformation);
            }
            return newList;
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @param {Boolean} [allOccurrences]
         */
        ContextInformationList.prototype.removeContextInformationOfKind = function(contextInformation, allOccurrences) {
            allOccurrences = typeof allOccurrences == "undefined" ? false : allOccurrences;
            for (var index in this._items) {
                var theContextInformation = this._items[index];
                if (theContextInformation.isKindOf(contextInformation)) {
                    this._items.splice(index, 1);
                }
            }
            if (allOccurrences && this.contains(contextInformation)) this.removeContextInformationOfKind(contextInformation, allOccurrences);
        };

        /**
         *
         * @returns {boolean}
         */
        ContextInformationList.prototype.hasContextInformationWithInputParameters = function() {
            for (var index in this._items) {
                var theContextInformation = this._items[index];
                if (theContextInformation.hasInputParameter()) return true;
            }
            return false;
        };

        /**
         *
         * @returns {ContextInformationList}
         */
        ContextInformationList.prototype.getContextInformationWithInputParameters = function() {
            var list = new ContextInformationList();
            for (var index in this._items) {
                var theContextInformation = this._items[index];
                if (theContextInformation.hasInputParameter()) list.put(theContextInformation);
            }
            return list;
        };

        /**
         * Returns the value for contextual information that matches the kind of the provided contextual information.
         *
         * @param {ContextInformation} contextInformation
         * @returns {String}
         */
        ContextInformationList.prototype.getValueForContextInformationOfKind = function(contextInformation) {
            return this.getContextInformationOfKind(contextInformation).getValue();
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @returns {ContextInformation}
         */
        ContextInformationList.prototype.getContextInformationOfKind = function(contextInformation) {
            for (var index in this.getItems()) {
                var theContextInformation = this.getItems()[index];
                if (theContextInformation.isKindOf(contextInformation)) return theContextInformation;
            }
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         */
        ContextInformationList.prototype.updateValue = function(contextInformation) {
            for (var index in this._items) {
                var existingContextInformation = this._items[index];
                if (existingContextInformation.isKindOf(contextInformation)) this._items[index] = contextInformation;
            }
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @returns {Array}
         */
        ContextInformationList.prototype.find = function(contextInformation) {
            var result = [];
            if (contextInformation instanceof ContextInformation) {
                this._items.forEach(function(theContextInformation) {
                    if (theContextInformation.isKindOf(contextInformation)) result.push(theContextInformation);
                });
            }
            return result;
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @param operator
         * @param {*} value
         * @returns {boolean}
         */
        ContextInformationList.prototype.fulfils = function(contextInformation, operator, value) {
            var contextInformationOfKind = this.find(contextInformation);
            for (var index in contextInformationOfKind) {
                if (contextInformationOfKind.hasOwnProperty(index) && this._fulfils(contextInformationOfKind[index], operator, ContextInformation.restoreDataType(contextInformation.getDataType(), value))) return true;
            }
            return false;
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @param operator
         * @param {*} value
         * @returns {boolean}
         * @private
         */
        ContextInformationList.prototype._fulfils = function(contextInformation, operator, value) {
            switch(operator) {
                case ContextInformation.OPERATOR_EQUALS:
                    return contextInformation.getValue() == value;
                    break;
                case ContextInformation.UNEQUALS:
                    return contextInformation.getValue() != value;
                    break;
                case ContextInformation.OPERATOR_LESS_THAN:
                    return contextInformation.getValue() < value;
                    break;
                case ContextInformation.OPERATOR_GREATER_THAN:
                    return contextInformation.getValue() > value;
                    break;
                default:
                    return false;
            }
        };

        return ContextInformationList;
    })();
});