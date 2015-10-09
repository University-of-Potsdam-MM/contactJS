/**
 * Created by tobias on 01.10.15.
 */
define(['abstractList', 'data'], function(AbstractList, Data) {
    return (function() {
        /**
         * This class represents a list for Data.
         *
         * @extends AbstractList
         * @class DataList
         * @returns DataList
         */
        function DataList() {
            AbstractList.call(this);
            this._type = Data;
            return this;
        }

        DataList.prototype = Object.create(AbstractList.prototype);
        DataList.prototype.constructor = DataList;

        return DataList;
    })();
});