/**
 * Created by tobias on 30.09.15.
 */
define(['component'],
    function(Component) {
        return (function() {

            /**
             * @type {object}
             * @public
             */
            Callable.description = {
                in: [
                    {
                        'name':'',
                        'type':''
                    }
                ],
                out: [
                    {
                        'name':'',
                        'type':''
                    }
                ],
                requiredObjects: []
            };

            /**
             * Generates the id and initializes the (in and out) types and values.
             *
             * @abstract
             * @classdesc The Widget handles the access to sensors.
             * @class Callable
             */
            function Callable(discoverer) {
                Component.call(this, discoverer);

                /**
                 * Name of the callable.
                 *
                 * @type {string}
                 * @private
                 */
                this.name = 'Callable';

                return this;
            }

            Callable.prototype = Object.create(Component.prototype);
            Callable.prototype.constructor = Callable;

            return Callable;
        })();
    }
);