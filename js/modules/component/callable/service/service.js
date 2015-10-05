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
            Service.description = {
                requiredObjects: []
            };

            /**
             *
             * @returns {Service}
             * @constructs Service
             */
            function Service(discoverer) {
                Component.call(this, discoverer);

                /**
                 * Name of the service.
                 *
                 * @type {string}
                 * @private
                 */
                this.name = 'Service';

                return this;
            }

            return Service;
        })();
    }
);