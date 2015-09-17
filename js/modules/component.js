/**
 * Created by tobias on 30.03.15.
 */
define(function() {
   return (function() {

       Component.lastLogId = "";

       /**
        *
        * @returns {Component}
        * @constructor
        */
       function Component() {
           /**
            * Name of the object.
            *
            * @public
            * @type {string}
            */
           if (typeof this.name == "undefined") this.name = 'Component';

           /**
            * ID of the object. Will be generated.
            *
            * @type {string}
            */
           this.id = Math.uuid();

           return this;
       }

       /**
        * Returns the name of the object.
        *
        * @returns {string}
        */
       Component.prototype.getName = function() {
           return this.name;
       };

       /**
        * Returns the id of the object.
        *
        * @returns {string}
        */
       Component.prototype.getId = function() {
           return this.id;
       };

       /**
        *
        * @param string
        */
       Component.prototype.log = function(string) {
           if (Component.lastLogId != this.getId())
               console.log(this.getName()+" ("+this.getId()+"): "+string);
           else
               console.log(this.getName()+" (...): "+string);
           Component.lastLogId = this.getId();
       };

       return Component;
   })();
});