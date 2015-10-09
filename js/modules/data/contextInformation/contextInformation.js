define(['data', 'parameterList'], function(Data, ParameterList) {
    return (function() {

        /**
         *
         * @static
         * @constant
         * @type {string}
         */
        ContextInformation.VALUE_UNKNOWN = "CV_UNKNOWN";

        /**
         *
         * @static
         * @constant
         * @type {string}
         */
        ContextInformation.VALUE_ERROR = "CV_ERROR";

        /**
         * ContextInformation defines name, type (string, double,...) an associated parameter of a contextual information.
         *
         * @class ContextInformation
         * @extends Data
         */
        function ContextInformation(overrideBuilderDependency) {
            Data.call(this);

            // avoid inexpert meddling with contextual information construction
            if (typeof overrideBuilderDependency == 'undefined' || !overrideBuilderDependency)
                throw new Error("Contextual information must be created by the discoverer's buildContextInformation() method!");

            /**
             * Name of the ContextInformation.
             *
             * @type {String}
             * @private
             */
            this._name = '';

            /**
             * Defines the data type of the ContextInformation (i.e String, Double,...).
             *
             * @type {string}
             * @private
             */
            this._dataType = '';

            /**
             *
             * @type {ParameterList}
             * @private
             */
            this._parameterList = new ParameterList();

            /**
             *
             * @type {Array}
             * @private
             */
            this._synonymList = [];

            /**
             *
             * @type {*}
             * @private
             */
            this._value = ContextInformation.VALUE_UNKNOWN;

            /**
             * Time when the value was set.
             *
             * @type {Date}
             * @private
             */
            this._timestamp = new Date();

            return this;
        }

        ContextInformation.prototype = Object.create(Data.prototype);
        ContextInformation.prototype.constructor = ContextInformation;

        ContextInformation.fromContextInformationDescription = function(discoverer, contextInformationDescription) {
            return discoverer.buildContextInformation(
                contextInformationDescription.name,
                contextInformationDescription.type,
                contextInformationDescription.parameterList,
                true);
        };

        /**
         * Builder for name.
         *
         * @param {String} name The contextual information name to build with.
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withName = function(name){
            this.setName(name);
            return this;
        };

        /**
         * Builder for type.
         *
         * @param {String} dataType The context information data type to build with.
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withDataType = function(dataType){
            this.setDataType(dataType);
            return this;
        };

        /**
         * Builder for one parameter.
         *
         * @param {Parameter} parameter The parameter to build with.
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withParameter = function(parameter){
            this.addParameter(parameter);
            return this;
        };

        /**
         * Builder for parameterList.
         *
         * @param {(ParameterList|Array)} parameterList ParameterList
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withParameters = function(parameterList){
            this.setParameters(parameterList);
            return this;
        };

        /**
         * Builder for value.
         *
         * @param {String} value value
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withValue = function(value) {
            this.setValue(value);
            this.setTimestamp(new Date());
            return this;
        };

        /**
         * Builder for timestamp.
         *
         * @param {Date} date The timestamp.
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withTimestamp = function(date) {
            this.setTimestamp(date);
            return this;
        };

        /**
         * Builder for synonyms from single translation.
         *
         * @param {ContextInformation} contextInformation
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withSynonym = function(contextInformation){
            this.addSynonym(contextInformation);
            return this;
        };

        /**
         * Builder for synonyms from (several) translations.
         *
         * @param contextInformation
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.withSynonyms = function(contextInformation){
            this.setSynonyms(contextInformation);
            return this;
        };

        /**
         * Returns the name.
         *
         * @returns {string}
         */
        ContextInformation.prototype.getName = function(){
            return this._name;
        };

        /**
         * Returns the type.
         *
         * @returns {string}
         */
        ContextInformation.prototype.getDataType = function(){
            return this._dataType;
        };

        /**
         * Returns the parameters.
         *
         * @returns {ParameterList}
         */
        ContextInformation.prototype.getParameters = function(){
            return this._parameterList;
        };

        /**
         * Returns the synonym with the specified name if existent or itself, otherwise.
         *
         * @param {String} name
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.getSynonymWithName = function(name) {
            var synonyms = this.getSynonyms();
            for (var index in synonyms) {
                if (synonyms.hasOwnProperty(index)) {
                    var synonym = this.getSynonyms()[index];
                    if (synonym.getName() == name) return synonym;
                }
            }
            return this;
        };

        /**
         * Returns the list of synonyms.
         *
         * @returns {Array}
         */
        ContextInformation.prototype.getSynonyms = function(){
            return this._synonymList;
        };

        /**
         * Sets the name.
         *
         * @param {string} name Name
         */
        ContextInformation.prototype.setName = function(name){
            if(typeof name === 'string'){
                this._name = name;
            }
        };

        /**
         * Sets the type.
         *
         * @param {string} type Type
         */
        ContextInformation.prototype.setDataType = function(type){
            if(typeof type === 'string'){
                this._dataType = type;
            }
        };

        /**
         * Adds a parameter.
         *
         * @param {Parameter} parameter Parameter
         */
        ContextInformation.prototype.addParameter = function(parameter){
            this._parameterList.put(parameter);
        };

        /**
         * Adds a synonym to synonymList.
         *
         * @param synonym
         */
        ContextInformation.prototype.addSynonym = function(synonym){
            if (synonym instanceof ContextInformation)
                this._synonymList.push(synonym);
        };

        /**
         * Adds a list of Parameter.
         *
         * @param {ParameterList} parameters ParameterList
         */
        ContextInformation.prototype.setParameters = function(parameters){
            this._parameterList.putAll(parameters);
        };

        /**
         * Adds a list of synonyms.
         *
         * @param synonyms
         */
        ContextInformation.prototype.setSynonyms = function(synonyms){
            for (var synIndex in synonyms) {
                this.addSynonym(synonyms[synIndex]);
            }
        };

        /**
         * Returns true if the context information is parametrized.
         *
         * @returns {boolean}
         */
        ContextInformation.prototype.hasParameters = function() {
            return this._parameterList.size() > 0;
        };

        /**
         * Returns true if the context information has synonyms.
         *
         * @returns {boolean}
         */
        ContextInformation.prototype.hasSynonyms = function() {
            return this._synonymList.length > 0;
        };

        /**
         * Returns true if the contextual information has the given contextual information in its synonymList.
         *
         * @param {ContextInformation} contextInformation
         * @returns {boolean}
         */
        ContextInformation.prototype.hasSynonym = function(contextInformation) {
            for (var i in this._synonymList)
                if (this._synonymList[i].isKindOf(contextInformation)) return true;
            return false;
        };

        /**
         * Sets the value.
         *
         * @param {*} value the value
         * @returns {ContextInformation}
         */
        ContextInformation.prototype.setValue = function(value) {
            this._value = value;
            return this;
        };

        /**
         * Returns the value.
         *
         * @returns {string}
         */
        ContextInformation.prototype.getValue = function() {
            return this._value;
        };

        /**
         * Sets the timestamp.
         *
         * @param {Date} time timestamp
         */
        ContextInformation.prototype.setTimestamp = function(time) {
            this._timestamp = time;
        };

        /**
         * Returns the timestamp.
         *
         * @returns {Number}
         */
        ContextInformation.prototype.getTimestamp = function() {
            return this._timestamp;
        };

        /**
         *
         * @returns {boolean}
         */
        ContextInformation.prototype.hasInputParameter = function() {
            return this.hasParameters() && this._parameterList.hasInputParameter();
        };

        /**
         * Compares two contextual information. Returns true if they or one of their synonyms are of the same kind
         * (i.e. same name, dataType, and parameters).
         *
         * @param {ContextInformation} contextInformation The contextual information that should be compared.
         * @returns {Boolean}
         */
        ContextInformation.prototype.isKindOf = function(contextInformation) {
            // name, type and parameters equivalent
            if(this._isKindOf(contextInformation)) return true;

            // check synonyms for equality
            var theseSynonyms = this.getSynonyms();

            if (contextInformation instanceof ContextInformation) {
                var thoseSynonyms = contextInformation.getSynonyms();
                for (var i in theseSynonyms) {
                    var thisSynonym = theseSynonyms[i];
                    if (contextInformation._isKindOf(thisSynonym)) {
                        return true;
                    }
                }
                for (var i in thoseSynonyms) {
                    var thatSynonym = thoseSynonyms[i];
                    if (this._isKindOf(thatSynonym)) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Auxiliary function comparing only name, type and parameters (without synonyms)
         *
         * @param {ContextInformation} contextInformation
         * @returns {boolean}
         * @private
         */
        ContextInformation.prototype._isKindOf = function(contextInformation) {
            if (contextInformation instanceof ContextInformation) {
                if ((this.getName() == contextInformation.getName()
                    && this.getDataType() == contextInformation.getDataType()
                    && this.getParameters().equals(contextInformation.getParameters()))) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Compares two contextual information. Returns true if they are exactly equal (i.e. same kind and value).
         *
         * @param {ContextInformation} contextInformation
         * @returns {Boolean}
         */
        ContextInformation.prototype.equals = function(contextInformation) {
            if (contextInformation instanceof ContextInformation) {
                if (this.isKindOf(contextInformation) && this.getValue() == contextInformation.getValue()) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns an identifier that uniquely describes the contextual information and its parameters.
         * The identifier shall in no case be used to compare two contextual information (use isKindOf() and isEqualTo() instead). <br/>
         * Format: [ContextInformationName:ContextInformationDataType:ContextInformationValue]#[FirstParameterName:FirstParameterType:FirstParameterValue]…
         *
         * @returns {String}
         * @example [CI_USER_LOCATION_DISTANCE:FLOAT:24]#[CP_TARGET_LATITUDE:INTEGER:52][CP_TARGET_LONGITUDE:INTEGER:13][CP_UNIT:STRING:KILOMETERS]
         */
        ContextInformation.prototype.toString = function(typeOnly) {
            var identifier = "["+this.getName()+":"+this.getDataType();
            if (!typeOnly) identifier += ":"+this.getValue();
            identifier += "]";
            if (this.hasParameters()) {
                identifier += "#";
                for (var index in this.getParameters().getItems()) {
                    var theParameter = this.getParameters().getItems()[index];
                    identifier += theParameter.toString();
                }
            }
            return identifier;
        };

        /**
         *
         */
        ContextInformation.prototype.setValueUnknown = function() {
            this.setValue(ContextInformation.VALUE_UNKNOWN);
        };

        /**
         *
         */
        ContextInformation.prototype.setValueError = function() {
            this.setValue(ContextInformation.VALUE_ERROR);
        };

        /**
         *
         * @returns {boolean}
         */
        ContextInformation.prototype.isKnown = function() {
            return this.getValue() != ContextInformation.VALUE_UNKNOWN && this.getValue() != ContextInformation.VALUE_ERROR;
        };

        return ContextInformation;
    })();
});