# contactJS

The *Context Acquisition Toolkit for JavaScript* (contactJS) is a framework dealing with detection of contextual information on mobile devices.
It is based on a port of the *[Context Toolkit](http://contexttoolkit.sourceforge.net)* developed by A. Dey.


## Contents

* [Installation](#installation)
* [Components](#components)
    * [Discoverer](#discoverer)
    * [Aggregator](#aggregator)
    * [ContextInformation](#context-information)
    * [Widgets](#widgets)
    * [Interpreters](#interpreters)
* [Usage](#usage)
    * [Discoverer](#usage-discoverer)
        * [Initialization](#discoverer-init)
        * [Translations](#translations)
    * [Aggregator](#usage-aggregator)
        * [Initialization](#aggregator-init)
    * [Widgets and Interpreters](#usage-widgets-interpreters)
        * [Initialization](#widgets-interpreters-init)
        * [Custom Widgets and Interpreters](#custom-widgets-interpreters)


## Installation <a name="installation" />

Download the latest release from GitHub. From the *./dist* folder copy the *contact.js* file to your project and add it to the require.js configuration file. For example:

```JavaScript
paths: {
    contactJS: 'lib/contactJS',
    ...
}
```

In your project you can now include contactJS by using require.js's define mechanism. For example:

```JavaScript
define(['contactJS'], function(contactJS)) {
    ...
}
```


## Components <a name="components" />

### Discoverer <a name="discoverer"/>

The discoverer is the central registration and lookup component.
It registers all available context detection components and handles requests for them.
Furthermore, the discoverer 'knows' about all requested/detectable pieces of *context information* and also handles requests for them.


### Aggregator <a name="aggregator"/>

Aggregators aggregate context data delivered by widgets or interpreters.
There can be one or more instances of an aggregator, as required by the respective application.
 
Aggregators adopt a **publish-subscribe** pattern: 
An aggregator subscribes to widgets, collects their published data, and publishes these in return.



### Context Information <a name="context-information"/>

A piece of **context information** can be detected by widgets and interpreted by interpreters.
Each context datum has a name, a dataType, a list of parameters, a list of synonyms, a value and a timestamp.
For example: 

```JavaScript
{
    'name':'CI_CURRENT_UNIX_TIME',
    'dataType':'INTEGER',
    'parameterList':[["CP_UNIT", "STRING", "SECONDS"]],
    'synonymList':[
        ['CI_CURRENT_UNIX_TIME', 
        'INTEGER', 
        [["CP_UNIT","STRING","SECONDS"]]]
    ],
    'value':12345,
    'timestamp':54321
}
```

SynonymList, value and timestamp will automatically be set at runtime whereas name, dataType and parameterList must be defined by the user of contactJS (see [Custom Widgets and Interpreters](#custom-widgets-interpreters)).


### Widgets <a name="widgets"/>

Widgets detect raw i.e. low-level context information.

The type of context information that a widget detects is defined as its **out** information, each comprising:
* name
* type
* parameters (optional)

This information is encapsulated within the widget's **description**.
The description further includes a list of **const** data and the properties **updateInterval** and **requiredObjects**.
The **const** information is a mere legacy from context toolkit and at this point not supposed to be defined.
The **updateInterval**, however, is essential: It determines after how many milliseconds the widget repeats detection.
External dependencies which the component needs to work are listed in **requiredObjects**, examples include "jQuery" and "cordova". 

**Example of widget description:**
```JavaScript
MyUnixTimeMillisecondsWidget.description = {
    out: [
        {
            'name':'CI_CURRENT_UNIX_TIME',
            'type':'INTEGER',
            'parameterList': [["CP_UNIT", "STRING", "MILLISECONDS"]]
        }
    ],
    const: [
        {
            'name':'',
            'type':''
        }
    ],
    updateInterval: 30000,
    requiredObjects: []
};
```


### Interpreters <a name="interpreters"/>

Interpreters are responsible for the generation of high(er)-level context information:
They request low(er)-level context information as input from widgets (or other interpreters) and return an *interpretation* of those data. 
For example: 
> The widget 'UnixTimeWidget' outputs a UNIX timestamp. 
The interpreter 'DateTimeInterpreter' accepts that timestamp as input and processes it in order to return the current date and time.

The type of information that an interpreter requires as input is defined as its **in** information.
The type of information returned by that interpreter is in turn defined as its **out** information.

The respective data are, analogously to widgets, encapsulated within the interpreter's **description** and defined by:
* name
* type
* parameters (optional)

Interpreters have no update interval since their activation depends on the information detected by the widgets:
Interpreters get called by an aggregator as soon as their **in** data are updated.

Interpreters do, however, have the property **requiredObjects**, just like widgets (see above: [Widgets](#widgets)).

**Example of interpreter description:**
```JavaScript
MySecondsInterpreter.description = {
     in: [
         {
             'name':'CI_BASE_UNIT_OF_TIME',
             'type':'INTEGER',
             'parameterList': [["CP_UNIT", "STRING", "MILLISECONDS"]]
         }
     ],
     out: [
         {
             'name':'CI_BASE_UNIT_OF_TIME',
             'type':'INTEGER',
             'parameterList': [["CP_UNIT", "STRING", "SECONDS"]]
         }
     ],
     requiredObjects: ["jQuery"]
 };
```


## Usage <a name="usage"/>

### Discoverer <a name"usage-discoverer"/>

The discoverer is the heart and soul of contactJS:
It orchestrates the flow of information between the context detecting, interpreting and aggregating components.
Therefore, it is the first component to be initialized and must be registered with every other component (aggregators, interpreters and widgets).
For the user of contactJS, the only discoverer-related thing to do is the initialization and (optional) provision of [translations](#translations). 
Everything else will happen automatically.

#### Initialization <a name="discoverer-init"/>

The discoverer is initialized with three parameters: 
* a list of all widgets
* a list of all interpreters
* a list of all *translations*

**Example of discoverer initialization:**
```JavaScript
define("MyContextDetection", ['contactJS', 'widgets', 'interpreters'], 
    function(contactJS, widgets, interpreters) {    
        return (function() {
            ...
            this._discoverer = new contactJS.Discoverer(widgets, interpreters, [ ... ]);
            ...
        })();
    }
);
```

The former two lists (widgets, interpreters) are not defined here but inside the **config** file 
(see below: [Widgets and Interpreters - Initialization](#config)).


#### Translations <a name="translations"/>
The discoverer can be equipped with a list of *translations* comprising **synonymous** pieces of context information.
**Example of two translations:**

```JavaScript
[
    ['CI_CURRENT_UNIX_TIME_IN_SECONDS','INTEGER'],
    ['CI_CURRENT_UNIX_TIME','INTEGER',[["CP_UNIT","STRING","SECONDS"]]]
],
[
    ['CI_CURRENT_UNIX_TIME_IN_MILLISECONDS','INTEGER'],
    ['CI_CURRENT_UNIX_TIME','INTEGER',[["CP_UNIT","STRING","MILLISECONDS"]]]
]
```

Treating semantically equivalent context data types interchangeably comes in handy where generic interpreters are intended.
Considering the above example, an interpreter that requires as input a timestamp in seconds doesn't care if 
that input is called *'CI_CURRENT_UNIX_TIME'* or *'CI_CURRENT_UNIX_TIME_IN_SECONDS'*, or even *'TIMEYWIMEY'*,
for that matter. It is only interested in an input value it can operate on, which should be an integer representing 
the current timestamp in seconds.


### Aggregator <a name"usage-aggregator"/>

The aggregator (for simplicity's sake, we'll assume a single instance here) serves as the context information gathering component.
The gathered information can be accessed by calling *getOutputContextInformation()* on an aggregator.

**Example of context acquisition:**
```JavaScript
for (var index in this._aggregators) {
    var theAggregator = this._aggregators[index];    
    this._callbacks["newContextInformationCallback"](
        this._contextInformationFromAttributes(theAggregator.getOutputContextInformation())
    );
}
```

Of course, all aggregators that are supposed to collect context data must be initialized first.


#### Initialization <a name="aggregator-init"/>

Aggregators are initialized by calling their constructor with two parameters: discoverer and requested context information.

**Example of aggregator initialization:**
```JavaScript
this._aggregators.push(new contactJS.Aggregator(
    this._discoverer, 
    contactJS.ContextInformationList.fromContextInformationDescriptions(this._discoverer, [
        {
            'name':'CI_IS_NIGHTTIME',
            'type':'BOOLEAN'
        }
    ])
));
```


### Widgets and Interpreters <a name="usage-widgets-interpreters"/>

#### Initialization <a name="widgets-interpreters-init"/>

Widgets and interpreters will be recognized automatically.
For this purpose, all files containing them must be listed in a file referenced within **config.js**.

**Example of *config.js*:** <a name="config"/>
```JavaScript
require.config({
    baseUrl: 'scripts',
    packages: [
        {
            name: 'widgets',
            location: 'myContextAwareApp/context/widgets',
            main: 'widgets' 
        },
        {
            name: 'interpreters',
            location: 'MyContextAwareApp/context/interpreters',
            main: 'interpreters' 
        }
    ],
    paths: {
        ...
        contactJS: 'lib/contactJS',
        MyContextDetection: 'myContextAwareApp/context/MyContextDetection'
    }
});
```

The package declarations above refer to the files located in the respective paths: 
` ./scripts/MyContextAwareApp/context/widgets/widgets.js `
` ./scripts/MyContextAwareApp/context/interpreters/interpreters.js `


**Example of main file *widgets.js*:**
```JavaScript
define([
    './TemperatureWidget',
    './LocationWidget',
    './UnixTimeWidget'
], function(
    TemperatureWidget,
    LocationWidget,
    UnixTimeWidget
) {
    return arguments;
});
```
The main file *interpreters.js* should look very much alike.


#### Custom Widgets and Interpreters <a name="custom-widgets-interpreters"/>

**Custom widgets** can be added to contactJS, provided they
* implement a constructor,
* define out information and update interval,
* initialize callbacks,
* implement the function *queryGenerator()*, and
* are added to contactJS' configuration, see [Initialization](#config).

**Example custom widget implementation:**
```JavaScript
define(['contactJS'], function (contactJS) {
    return (function() {

        MyUnixTimeWidget.description = {
            out: [
                {
                    'name':'CI_CURRENT_UNIX_TIME',
                    'type':'INTEGER',
                    'parameterList': [["CP_UNIT", "STRING", "MILLISECONDS"]]
                }
            ],
            const: [
                {
                    'name':'',
                    'type':''
                }
            ],
            updateInterval: 5000
        };

        function MyUnixTimeWidget(discoverer) {
            contactJS.Widget.call(this, discoverer);
            this.name = 'MyUnixTimeWidget';
            return this;
        }

        MyUnixTimeWidget.prototype = Object.create(contactJS.Widget.prototype);
        MyUnixTimeWidget.prototype.constructor = MyUnixTimeWidget;

        MyUnixTimeWidget.prototype._initCallbacks = function() {
            this._addCallback(new contactJS.Callback()
                .withName('UPDATE')
                .withContextInformation(this.getOutputContextInformation()));
        };

        MyUnixTimeWidget.prototype.queryGenerator = function(callback) {
            if (!Date.now) {
                Date.now = function () {
                    return new Date().getTime();
                }
            }

            var response = new contactJS.AttributeList();
            response.put(this.getOutputContextInformation().getItems()[0].setValue(Date.now()));
            this._sendResponse(response, callback);
        };

        return MyUnixTimeWidget;
    })();
});
```

**Custom interpreters** can be added to contactJS, provided they
* implement a constructor,
* define *in* and *out* information,
* implement the function *interpretData()*, and
* are added to contactJS' configuration, see [Initialization](#config).

**Example custom interpreter implementation:**
```JavaScript
define(['contactJS'], function(contactJS) {
    return (function() {
    
        MySecondsInterpreter.description = {
            in: [
                {
                    'name':'CI_BASE_UNIT_OF_TIME',
                    'type':'INTEGER',
                    'parameterList': [["CP_UNIT", "STRING", "MILLISECONDS"]]
                }
            ],
            out: [
                {
                    'name':'CI_BASE_UNIT_OF_TIME',
                    'type':'INTEGER',
                    'parameterList': [["CP_UNIT", "STRING", "SECONDS"]]
                }
            ]
        };
        
        function MySecondsInterpreter(discoverer) {
            contactJS.Interpreter.call(this, discoverer);
            this.name = "MySecondsInterpreter";
            return this;
        }
        MySecondsInterpreter.prototype = Object.create(contactJS.Interpreter.prototype);
        MySecondsInterpreter.prototype.constructor = MySecondsInterpreter;
        
        MySecondsInterpreter.prototype._interpretData = function(inContextInformation, outContextInformation, callback) {
            var unixSecondsValue = outContextInformation.getItems()[0];
            unixSecondsValue.setValue(Math.floor(
                inContextInformation.getValueForContextInformationOfKind(this.getInputContextInformation().getItems()[0]) / 1000
            ));
            callback([
                unixSecondsValue
            ]);
        };
        
        return MySecondsInterpreter;
    })();
});
```
