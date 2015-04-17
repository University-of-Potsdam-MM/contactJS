/**
 * Created by tobias on 15.04.15.
 */
define(['easejs', 'interpreter', 'attributeTypeList'],
    function(easejs, Interpreter, AttributeTypeList) {
        var Class = easejs.Class;
        var Interpretation = Class('Interpretation', {
            'public interpreterId' : null,
            'public inAttributeTypes' : new AttributeTypeList(),
            'public outAttributeTypes' : new AttributeTypeList(),

            'public __construct' : function(_interpreterId, _inAttributes, _outAttributes){
                this.interpreterId = _interpreterId;
                this.inAttributeTypes = _inAttributes;
                this.outAttributeTypes = _outAttributes;
            }

        });

        return Interpretation;
    }
);