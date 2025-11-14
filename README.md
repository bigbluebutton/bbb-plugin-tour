# Tour Plugin

## Description

This plugin adds a button in the options dropdown menu to start a Tour to guide user to some of the features of BigBlueButton. It uses the [shepherd.js](https://github.com/shepherd-pro/shepherd) library.

![Gif of plugin demo](./public/assets/plugin.gif)

You can configure some "Learn More" links that are shown in some steps (screenshare, whiteboard, general) in the settings of the plugin, see example below.

## Plugin Versioning

Please be aware that we have a separate branch of this plugin for each version of the SDK. This ensures that everything merged into a branch is compatible with the corresponding version of the BigBlueButton core. As of now, here’s the correspondence between the branches, SDK versions, and BigBlueButton core versions:

| Repository Branch | Plugin-SDK Version | BigBlueButton Core Version |
|------------------|--------------------|----------------------------|
| v0.0.x           | v0.0.x             | v3.0.x                     |
| v0.1.x           | v0.1.x             | v3.1.x                     |


## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `TourPlugin.js`, a directory of locale files and a license files. These files can be hosted on any HTTPS server along with the `manifest.json` which is also part of the `dist/` directory.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in `/etc/bigbluebutton/bbb-web.properties`.

## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`

## Background

BigBlueButton added supports for plugins in 2025 with BBB 3.0.
Check the official [documentation website](https://docs.bigbluebutton.org) for more information.

This plugin repository was created using the plugin [template repository for BigBlueButton](https://github.com/bigbluebutton/plugin-template) hosted on GitHub.
