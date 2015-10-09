/**
 * Created by tobias on 30.09.15.
 */
define(['component', 'contextInformation', 'contextInformationList', 'callback', 'callbackList', 'subscriber', 'subscriberList'], function(Component, ContextInformation, ContextInformationList, Callback, CallbackList, Subscriber, SubscriberList) {
    return (function() {
        /**
         * Defines all output contextual information and constant output contextual information as an object.
         * @type {object}
         * @public
         */
        Queryable.description = {
            out: [
                {
                    "name":"",
                    "type":""
                }
            ],
            const: [
                {
                    "name":"",
                    "type":""
                }
            ],
            updateInterval: 30000,
            requiredObjects: []
        };

        /**
         *
         * @returns {Queryable}
         * @class Queryable
         * @extends Component
         */
        function Queryable(discoverer) {
            Component.call(this, discoverer);

            /**
             * Name of the queryable.
             *
             * @type {string}
             * @private
             */
            this._name = 'Queryable';

            /**
             * List of Callbacks.
             *
             * @protected
             * @type {CallbackList}
             */
            this._callbacks = new CallbackList();

            /**
             * All available contextual information and their values.
             *
             * @type {ContextInformationList}
             * @protected
             */
            this._outputData = new ContextInformationList();

            /**
             * This temporary variable is used for storing the old data values.
             * So these can be used to check conditions.
             *
             * @type {ContextInformationList}
             * @protected
             */
            this._oldOutputContextInformation = new ContextInformationList();

            /**
             *
             * @protected
             * @type {ContextInformationList}
             * @desc All available constant contextual information and their values.
             */
            this._constantOutputContextInformation = new ContextInformationList();

            /**
             *
             * @protected
             * @type {SubscriberList}
             * @desc List of Subscriber.
             */
            this._subscribers = new SubscriberList();

            /**
             *
             * @type {null}
             * @private
             */
            this._updateInterval = null;

            return this;
        }

        Queryable.prototype = Object.create(Component.prototype);
        Queryable.prototype.constructor = Queryable;

        /**
         * Initializes the provided contextual information.
         *
         * @protected
         */
        Queryable.prototype._initOutputContextInformation = function() {
            this._outputData = ContextInformationList.fromContextInformationDescriptions(this._discoverer, this.constructor.description.out);
        };

        /**
         *
         * @param {(ContextInformationList|Array.<ContextInformation>)} [contextInformationListOrArray]
         * @returns {ContextInformationList}
         */
        Queryable.prototype.getOutputContextInformation = function(contextInformationListOrArray) {
            return /** @type {ContextInformationList} */ this.getOutputData(contextInformationListOrArray);
        };

        /**
         * Returns the old contextual information.
         *
         * @returns {ContextInformationList}
         */
        Queryable.prototype.getOldOutputContextInformation = function() {
            return this._oldOutputContextInformation;
        };

        /**
         *
         * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray
         * @protected
         */
        Queryable.prototype._setOutputContextInformation = function(contextInformationListOrArray) {
            this._setOutputData(contextInformationListOrArray);
        };

        /**
         *
         * @param {ContextInformation} contextInformation
         * @returns {Boolean}
         * @protected
         */
        Queryable.prototype._isOutputContextInformation = function(contextInformation) {
            return this._isOutputData(contextInformation);
        };

        /**
         * Updates the contextual information that is maintained by the queryable.
         *
         * @param {(ContextInformationList|Array.<ContextInformation>)} contextInformationListOrArray Contextual information that should be entered.
         */
        Queryable.prototype.putData = function(contextInformationListOrArray) {
            var list = [];
            if (contextInformationListOrArray instanceof Array) {
                list = contextInformationListOrArray;
            } else if (contextInformationListOrArray instanceof ContextInformationList) {
                list = contextInformationListOrArray.getItems();
            }
            for ( var i in list) {
                var contextInformation = list[i];
                if (contextInformation instanceof ContextInformation && this._isOutputContextInformation(contextInformation)) {
                    this.addOutputContextInformation(contextInformation);
                }
            }
        };

        /**
         * Adds a new context information value. If the given kind of
         * contextual information is not included in the list, it will be also added.
         * Otherwise, only the value will be updated.
         *
         * @param {ContextInformation} contextInformation
         * @param {boolean} [multipleInstances=false]
         */
        Queryable.prototype.addOutputContextInformation = function(contextInformation, multipleInstances) {
            this.log("will add or update contextual information "+contextInformation+".");
            multipleInstances = typeof multipleInstances == "undefined" ? false : multipleInstances;
            this._oldOutputContextInformation = this._outputData;
            contextInformation.setTimestamp(this.getCurrentTime());
            if (contextInformation instanceof ContextInformation) {
                this._outputData.put(contextInformation, multipleInstances);
            }
        };

        return Queryable;
    })();
});