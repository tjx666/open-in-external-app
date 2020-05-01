<div align="center">

# Open in External App

Open file with external application in VSCode.

[![Version](https://vsmarketplacebadge.apphb.com/version-short/yutengjing.open-in-external-app.svg)](https://marketplace.visualstudio.com/items?itemName=yutengjing.open-in-external-app) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/yutengjing.open-in-external-app.svg)](https://marketplace.visualstudio.com/items?itemName=yutengjing.open-in-external-app) [![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/yutengjing.open-in-external-app.svg)](https://marketplace.visualstudio.com/items?itemName=yutengjing.open-in-external-app) [![Rating Star](https://vsmarketplacebadge.apphb.com/rating-star/yutengjing.open-in-external-app.svg)](https://marketplace.visualstudio.com/items?itemName=yutengjing.open-in-external-app) [![Trending Monthly](https://vsmarketplacebadge.apphb.com/trending-monthly/yutengjing.open-in-external-app.svg)](https://marketplace.visualstudio.com/items?itemName=yutengjing.open-in-external-app) [![Percentage of issues still open](https://isitmaintained.com/badge/open/tjx666/open-in-external-app.svg)](http://isitmaintained.com/project/tjx666/open-in-external-app 'Percentage of issues still open')

[![Build Status](https://travis-ci.org/tjx666/open-in-external-app.svg?branch=master)](https://travis-ci.org/tjx666/open-in-external-app) [![dependencies Status](https://david-dm.org/tjx666/open-in-external-app/status.svg)](https://david-dm.org/tjx666/open-in-external-app) [![devDependencies Status](https://david-dm.org/tjx666/open-in-external-app/dev-status.svg)](https://david-dm.org/tjx666/open-in-external-app?type=dev) [![Known Vulnerabilities](https://snyk.io/test/github/tjx666/open-in-external-app/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tjx666/open-in-external-app?targetFile=package.json)

</div>

## 💡 Motivation

VSCode is a very excellent editor, but sometime I prefer to use external application to work with some files. For example, I like to use [typora](https://www.typora.io/) to edit the markdown files. Usually, I will right click to the file, and select `Reveal in File Explorer` , then open the file using external application.

But, with this extension, you can do it more simply. Just right click to the file, and select `Open in External App`, that file would be opened by system default application. You can also use this way to open `.psd` files with photoshop, `.html` files with browser, and so on...

## 🔧 Configuration

Via custom configuration, you can make extensions more powerful. For example, to see the rendering differences, You can open one HTML in chrome and Firefox at the same time.

Example configuration:

```javascript
{
    "openInExternalApp.openMapper": [
        {
            // represent file extension name
            "extensionName": "html",
            // the external applications to open the file which extension name is html
            "apps": [
                // openCommand can be shell command or the complete executable application path
                // title will be shown in the drop list if there are several apps
                {
                    "title": "chrome",
                    "openCommand": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
                },
                {
                    "title": "firefox",
                    "openCommand": "C:\\Program Files\\Firefox Developer Edition\\firefox.exe",
                    // open in firefox under private mode
                    "args": ["-private-window"]
                }
            ]
        },
        {
            "extensionName": "tsx",
            // apps can be Object array or just is openCommand
            // the code is command you can access from shell
            "apps": "code"
        },
        {
            "extensionName": "psd",
            "apps": "/path/to/photoshop.exe"
        }
    ]
}
```

![open multiple](https://github.com/tjx666/open-in-external-app/blob/master/images/open-multiple.png?raw=true)

In VSCode, Right-clicking is different from right-clicking while holding `alt` key. If you just right click the file, you will see the command `Open in External App`, but if you right click file while holding `alt` key, you will see the command `Open in Multiple External Apps`.

![usage](https://github.com/tjx666/open-in-external-app/blob/master/images/usage.gif?raw=true)

## :loudspeaker: Limits

For now, if you want to open a file in the application which is developed by electron such as typora, you need to configure typora as the default application to open markdown file in your operation system. The configuration of this extension about typora is invalid.

## 🧡 Backers

Thanks to `JiangShiqi` for designing the extension's logo.
