# Tour Plugin

## Description

This plugins adds a button in the options dropdown menu to start a Tour to guide user to some of the features of Bigbluebutton. It uses the [sheperd.js](https://github.com/shepherd-pro/shepherd) library.

`shepherd.js` is pinned to `11.2.0` on purpose: 14.x and later are AGPL-3.0 (dual-licensed with a commercial license), and 12.x–13.x bundle a vulnerable `deepmerge-ts` ([GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx)). Don't upgrade it without a license review.

![Gif of plugin demo](./public/assets/plugin.gif)

You can configure some "Learn More" links that are shown in some steps (screenshare, whiteboard, general) in the settings of the plugin, see example below.

## Running the Plugin From Source Code

1. Start the development server:

```bash
npm install
npm start
```

2. Add this to the `settings.yml` of the BBB HTML5-client:
```yaml
public:
  plugins:
    - name: TourPlugin
      url: <<PLUGIN_URL>>
      settings:
        url:
          screenshare: "https://some.url.with.more.information"
          whiteboard: "https://some.url.with.more.information"
          general: "https://some.url.with.more.information"
```

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
npm install
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `TourPlugin.js`. This file can be hosted on any HTTPS server.

Alternatively, you can host the bundled file on the BigBlueButton server by copying dist/TourPlugin.js to the folder /var/www/bigbluebutton-default/assets/plugins. In this case, the <<PLUGIN_URL>> will be https://<your-host>/plugins/TourPlugin.js.

## Background

BigBlueButton added supports for plugins in 2024 with BBB 3.0.
Check the official [documentation website](https://docs.bigbluebutton.org) for more information.

This plugin repository was created using the plugin [template repository for BigBlueButton](https://github.com/bigbluebutton/plugin-template) hosted on GitHub.
