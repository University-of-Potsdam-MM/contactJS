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

The discoverer is the central registration and lookup component.
It registers all available context detection components and handles requests for them.
Furthermore, the discoverer 'knows' about all requested/detectable *attributes* and also handles requests for them.

### Aggregator

Aggregators aggregate context data delivered by widgets or interpreters.
An aggregator is itself a widget but is handled in a different manner.
It follows a widget's publish-subscribe-pattern, though: 
It can subscribe to other widgets (possibly aggregators), collects their published data, and publish these in return.

### Attributes

Attributes represent pieces of context information which can be detected by widgets and interpreted by interpreters.
Each attribute i.e. context information has a name, type, list of parameters, list of synonyms, value and timestamp.

Example: 

```JavaScript
{
    'name':'CI_CURRENT_UNIX_TIME',
    'type':'INTEGER',
    'parameterList':[["CP_UNIT", "STRING", "SECONDS"]],
    'synonymList':[['CI_CURRENT_UNIX_TIME', 'INTEGER', [["CP_UNIT","STRING","SECONDS"]]]],
    'value':12345,
    'timestamp':54321
}
```

### Widgets

Widgets detect raw i.e. low-level context information. 
The type of information that a widget detects is defined as its *out attributes*.
Custom widgets can be added to contactJS.

### Interpreters

Interpreters are responsible for the generation of high(er)-level context:
They request low(er)-level context information as input from widgets (or other interpreters) and return an interpretation of those data.
Example: One widget outputs the current UNIX timestamp for which an interpreter returns the current date.

## Usage

### Discoverer

The discoverer is the heart and soul of contactJS.
It must be registered with every component (aggregators, interpreters and widgets).

#### Initialization

The discoverer is initialized with three parameters: 
a list of all widgets, a list of all interpreters, and a list of all *translation*.
Widgets and interpreters will be automatically recognized.
For this purpose, all files containing them must be listed in a file referenced within *config.js*.

Example of discoverer initialization:
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

Example of *config.js*:
```JavaScript
require.config({
    baseUrl: 'scripts',
    packages: [
        {
            name: 'widgets',
            location: 'myContextAwareApp/context/widgets',
            main: 'widgets' 
            // this refers to the file "./scripts/[location]/widgets.js"
        },
        {
            name: 'interpreters',
            location: 'MyContextAwareApp/context/interpreters',
            main: 'interpreters' 
            // the file "./scripts/[location]/interpreters.js"
        }
    ],
    paths: {
        ...
        contactJS: 'lib/contactJS',
        MyContextDetection: 'myContextAwareApp/context/MyContextDetection'
    }
});
```

Example *widgets.js*:
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

#### Translations

The discoverer is equipped with a customizable list of *translations* comprising *synonymous* attributes.
Treating attributes interchangeably comes in handy where generic interpreters shall be used.

Examples:

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

### Aggregator

#### Initialization

### Widgets

#### Initialization

#### Custom Widgets

