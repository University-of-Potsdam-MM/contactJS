# contactJS

The *Context Acquisition Toolkit for JavaScript* (contactJS) is a framework dealing with detection of contextual information on mobile devices.
It is based on a port of the *[Context Toolkit](http://contexttoolkit.sourceforge.net)* developed by A. Dey.


## Contents

Here be the table fo contents


## Installation

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


## Components

### Discoverer

The discoverer is the central registration and lookup component.\
It registers all available context detection components and handles requests for them.
Furthermore, the discoverer 'knows' about all requested/detectable *attributes* and also handles requests for them.


### Aggregator

Aggregators aggregate context data delivered by widgets or interpreters.\
There can be one or more instances of an aggregator, as required by the respective application.

An aggregator is itself a widget but conceptually different, with added functionality and a slightly different handling.
A widget's **publish-subscribe** pattern is adopted, though: 
Aggregators, like widgets, subscribe to other widgets, collects their published data, and publish these in return.


### Attributes

Attributes represent distinct pieces of **context information** which can be detected by widgets and interpreted by interpreters.
Each attribute i.e. context datum has a name, a type, a list of parameters, a list of synonyms, a value and a timestamp.
For example: 

```JavaScript
{
    'name':'CI_CURRENT_UNIX_TIME',
    'type':'INTEGER',
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


### Widgets

Widgets detect raw i.e. low-level context information. \
The type of information that a widget detects is defined as its **out attributes**, each comprising:
* name
* type
* parameters (optional)

**Custom widgets** can be added to contactJS, provided they
* implement a constructor,
* define out attributes,
* initialize callbacks,
* implement the function *queryGenerator()*, and
* are added to contactJS' configuration, see below: [Discoverer - Initialization](#config).


### Interpreters

Interpreters are responsible for the generation of high(er)-level context:
They request low(er)-level context information as input from widgets (or other interpreters) and return an *interpretation* of those data. 
For example: 
> The widget 'UnixTimeWidget' outputs a UNIX timestamp. 
The interpreter 'DateTimeInterpreter' accepts that timestamp as input and processes it in order to return the current date and time.

The type of information that an interpreter requires as input is defined as its **in attributes**.
The type of information returned by that interpreter is in turn defined as its **out attributes**.\
The respective attributes are defined, analogously to widgets, by:
* name
* type
* parameters (optional)

**Custom interpreters** can be added to contactJS, provided they
* implement a constructor,
* define *in* and *out attributes*,
* implement the function *interpretData()*, and
* are added to contactJS' configuration, see below: [Discoverer - Initialization](#config).


## Usage

### Discoverer

The discoverer is the heart and soul of contactJS:
It orchestrates the flow of information between the context detecting, interpreting and aggregating components.
Therefore, it is the first component to be initialized and must be registered with every other component (aggregators, interpreters and widgets).
For the user of contactJS, the only discoverer-related thing to do is the initialization and (optional) provision of [translations](#translations). 
Everything else will happen automatically.

#### Initialization

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

Widgets and interpreters will be automatically recognized.
<a name="config"/>
For this purpose, all files containing them must be listed in a file referenced within **config.js**.

**Example of *config.js*:**
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


#### Translations
<a name="translations"/>
The discoverer can be equipped with a list of *translations* comprising **synonymous attributes**.
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

Treating semantically equivalent attributes interchangeably comes in handy where generic interpreters are intended.
Considering the above example, an interpreter that requires as input a timestamp in seconds doesn't care if 
that input is called *'CI_CURRENT_UNIX_TIME'* or *'CI_CURRENT_UNIX_TIME_IN_SECONDS'*, or even *'TIMEYWIMEY'*,
for that matter. It is only interested in an input value it can operate on, which should be an integer representing 
the current timestamp in seconds.


### Aggregator

The aggregator (for simplicity's sake, we'll assume a single instance here) serves as the context information gathering component.
This service is employed by calling the function *queryReferencedComponents()*.
**Example of context acquisition:**
```JavaScript
for (var index in this._aggregators) {
    var theAggregator = this._aggregators[index];
    theAggregator.queryReferencedComponents(function(attributes) {
        var attributeList = attributes.getItems();
        for (var attributeIndex in attributeList) {
            // do something with this piece of information
        }
    });
}
```

Of course, all aggregators that are supposed to collect context data must be initialized first.


#### Initialization

**Example of aggregator initialization:**
```JavaScript
this._aggregators.push(
    new contactJS.Aggregator(this._discoverer, 
                             this._discoverer.getAttributesWithNames(contextIds))
);
```


### Widgets

#### Initialization


#### Custom Widgets

