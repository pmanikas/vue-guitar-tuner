# Vue Guitar Tuner

## This is a UI enhanced guitar tuner package, using Vue.js hooks

Vue Guitar Tuner is a mobile-ready, customisable,
Vue.js-powered guitar tuner.

**WARNING: vue-guitar-tuner is at alpha stage of development and may undergo significant changes.**

**Feel free to submit issues and feature requests [here](https://github.com/pmanikas/vue-guitar-tuner/issues)**.

**[Demo Page](https://pmanikas.github.io/guitar-tuner/)**

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## Installation

``` bash
npm install vue-guitar-tuner
```

or if you prefer yarn

``` bash
yarn add vue-guitar-tuner
```

## Usage

### Global

You may install Vue Guitar Tuner globally:

``` js
import Vue from 'vue';
import VueGuitarTuner from 'vue-guitar-tuner';

Vue.use(VueGuitarTuner);
```

This will make **&lt;VueGuitarTuner&gt;** available to all components within your Vue app.

### Local

Include the tuner directly into your component using import:

``` js
import VueGuitarTuner from 'vue-guitar-tuner';

export default {
  ...
  components: {
    VueGuitarTuner,
  }
  ...
};
```

### Configuration

| Property                  | Type    | Default | Description|
|:--------------------------|:--------|:--------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| displayNote               | Boolean | true   | Flag to enable or disable note display. |
| displayReferenceLine      | Boolean|  true   | Flag to enable or disable the vertical reference line. |
| displayGrid               | Boolean | true   | Flag to enable or disable background grid. |
| notes                     | Array  | ['C', ..., 'B'] | An array of Strings that define the 12 notes displayed on note area. Default value: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]. Must be an array of 12 strings. |
| tunerClasses              | Array | ['tuner'] | An Array of CSS Classes to customise tuner area. |
| gridClasses               | Array | ['gridOverlay']  | An array of CSS Classes to customise Grid area. |
| detuneClasses             | Array | ['detune'] | An Array of CSS Classes to customise Detune area. |
| detuneTipClasses          | Array | ['detuneTip'] | An Array of CSS Classes to customise the Detune Tip. |
| detuneValueClasses        | Array | ['detuneValue'] | An Array of CSS Classes to customise the Detune Value. |
| keySignatureClasses       | Array | ['keySignature'] | An Array of CSS Classes to customise both of the key signatures (flat, sharp). |
| flatClasses               | Array | ['tuner'] | An Array of CSS Classes to customise the flat character. |
| sharpClasses              | Array | ['tuner'] | An Array of CSS Classes to customise the sharp character. |

### Events

| Event                     | Type    | Description              |
|:--------------------------|:--------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dataUpdate`              |   Object  | Emits whenever there's a new value available. Object includes { pitch: Number, note: Number, detune: Number } |
| `statusUpdate`            |   Boolean  | Emits whenever the recording statues changes. |

### Actions

| Action            | Description                              |
|:------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `this.$root.$toggleGuitarTuner()`              |   Toggles the tuner on and off depending on the current recording status. |

### HTML Structure

Once the VueguitarTuner component is installed globally or imported, it can be used in templates in the following manner:

``` vue
  <VueGuitarTuner :display-note="false" :displayGrid="false" :tunerClasses="['tuner, 'tunerArea']"/>
```

To listen for the `dataUpdate` and `statusUpdate` events you can do the following:

``` html
  <VueGuitarTuner @statusUpdate="statusUpdate" @dataUpdate="dataUpdate" />
```

``` js
export default {
    ...
    data() {
        return {
            isTunerActive: false,
            data: {},
        };
    },
    ...
    methods: {
        statusUpdate(status) {
            this.isTunerActive = status;
        },
        dataUpdate(data) {
            this.data = data;
        },
    },
    ...
}
```

## Development

A sandboxed dev environment is provided by [vue-play](https://github.com/vue-play/vue-play). Changes made to the component files will appear in real time in the sandbox.

To begin development, run:

``` bash
yarn install
yarn dev
```

then navigate to `http://localhost:5000`

To modify and add sandbox scenarios, edit `play/index.js`

## License

This project is licensed under the Apache License - see the [LICENSE](https://github.com/pmanikas/vue-guitar-tuner/blob/master/LICENCE) file for details.
