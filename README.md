<div align="center">

# Open in External App

Open file with external application in VSCode.

[![Version](https://img.shields.io/visual-studio-marketplace/v/YuTengjing.open-in-external-app)](https://marketplace.visualstudio.com/items/YuTengjing.open-in-external-app/changelog) [![Installs](https://img.shields.io/visual-studio-marketplace/i/YuTengjing.open-in-external-app)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.open-in-external-app) [![Downloads](https://img.shields.io/visual-studio-marketplace/d/YuTengjing.open-in-external-app)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.open-in-external-app) [![Rating Star](https://img.shields.io/visual-studio-marketplace/stars/YuTengjing.open-in-external-app)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.open-in-external-app&ssr=false#review-details) [![Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/YuTengjing.open-in-external-app)](https://github.com/tjx666/open-in-external-app)

</div>

## 💡 Motivation

VSCode is a very excellent editor, but sometime I prefer to use external application to work with some files. For example, I like to use [typora](https://www.typora.io/) to edit the markdown files. Usually, I will right click to the file, and select `Reveal in File Explorer` , then open the file using external application.

But, with this extension, you can do it more simply. Just right click to the file, and select `Open in External App`, that file would be opened by system default application. You can also use this way to open `.psd` files with photoshop, `.html` files with browser, and so on...

## 🔌 Installation

1. Execute `Extensions: Install Extensions` command from [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
2. Type `YuTengjing.open-in-external-app` into the search form and install.

Read the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for more details.

## 🔧 Configuration

Via custom configuration, you can make extensions more powerful. For example, to see the rendering differences, You can open one HTML in chrome and Firefox at the same time.

Example configuration:

```jsonc
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
          // On MacOS, openCommand should be 'Google Chrome.app'
          "openCommand": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        },
        {
          "title": "firefox",
          // On MacOS, openCommand should be 'Firefox Developer Edition.app'
          "openCommand": "C:\\Program Files\\Firefox Developer Edition\\firefox.exe",
          // open in firefox under private mode
          "args": ["-private-window"]
        }
      ]
    },
    {
      "extensionName": "tsx",
      // apps can be Object array or just the command you can access from shell
      "apps": "code"
    },
    {
      "extensionName": "psd",
      "apps": "/path/to/photoshop.exe"
    },
    // like code-runner, you can custom the shell command to open with file
    {
      "extensionName": "ts",
      "apps": [
        {
          "title": "run ts file",
          "shellCommand": "ts-node ${file}"
        }
      ]
    },
    {
      // shared config, details here: https://github.com/tjx666/open-in-external-app/issues/45
      "extensionName": "__ALL__",
      "apps": "MacVim"
    }
  ]
}
```

![open multiple](https://github.com/tjx666/open-in-external-app/blob/master/images/open-multiple.png?raw=true)

In VSCode, Right-clicking is different from right-clicking while holding `alt` key. If you just right click the file, you will see the command `Open in External App`, but if you right click file while holding `alt` key, you will see the command `Open in Multiple External Apps`.

![usage](https://github.com/tjx666/open-in-external-app/blob/master/images/usage.gif?raw=true)

## :loudspeaker: Limits

This extension use two ways to open file in external applications.

### 1. Node package: [open](https://github.com/sindresorhus/open)

This package has one limit that can't open a file which is also made by electron. For example, you can't open `md` file in `typora` using this package. The `openCommand`, `args` configuration item is also supported by this package. When `isElectronApp: false`(by default), extension will use this way.

### 2. VSCode extension API: `vscode.env.openExternal(target: Uri)`

This API supports open file in application which is made by electron, but has one limit that [can't open file path which includes `Non-ascii` characters](https://github.com/microsoft/vscode/issues/88273). This API can only pass one argument `target`, `openCommand` and `args` configuration is also not work.

If you want to open file in application which is made by electron, you can choose one of two ways:

1. don not config it in VSCode settings, and set the default application of your operation system to open that file format.

2. using `isElectronApp` option:

   ```javascript
   {
        "extensionName": "md",
        "isElectronApp": true,
   }
   ```

   multiple apps example:

   ```javascript
   {
        "extensionName": "md",
        "apps": [
            {
                "title": "typora",
                "isElectronApp": true,
                // following config item is not work
                // "openCommand": "/path/to/typora.exe",
                // "args": ["--xxx"]
            },
            {
                "title": "idea",
                "openCommand": "/path/to/idea.exe",
                "args": ["--xxx"],
            }
        ]
    }
   ```

## ❓ FAQ

### Can I use variables in args and shellCommand?

Yes. you can use the variables placeholder documented at [predefined-variables](https://code.visualstudio.com/docs/editor/variables-reference#_predefined-variables). In addition to that, you can use:

- ${cursorLineNumber}
- ${cursorColumnNumber}

```jsonc
{
  "extensionName": "ts",
  "apps": [
    {
      "extensionName": "*",
      "apps": [
        {
          "title": "Explorer",
          // shell command combined with placeholder
          "shellCommand": "Explorer.exe /root,${fileDirname}"
        }
      ]
    },
    {
      "title": "run ts file",
      "shellCommand": "ts-node ${file}"
    }
  ]
}
```

### assign keyboard shortcut for specific config item

`keybindings.json`:

```jsonc
{
    "key": "cmd+k cmd+o",
    "command": "openInExternalApp.open",
    "args": {
        // same with following id
        "configItemId": "xxx"
    }
},
```

`settings.json`:

```jsonc
{
  "openInExternalApp.openMapper": [
    {
      // extensionName is ignored when set configItemId arg in shortcut
      "extensionName": "",
      "id": "xxx",
      "apps": ""
    }
  ]
}
```

## My extensions

- [Open in External App](https://github.com/tjx666/open-in-external-app)
- [Package Manager Enhancer](https://github.com/tjx666/package-manager-enhancer)
- [Neo File Utils](https://github.com/tjx666/vscode-neo-file-utils)
- [Reload Can Solve Any Problems](https://github.com/tjx666/reload-can-solve-any-problems)
- [VSCode FE Helper](https://github.com/tjx666/vscode-fe-helper)
- [VSCode archive](https://github.com/tjx666/vscode-archive)
- [Better Colorizer](https://github.com/tjx666/better-colorizer/tree/main)
- [Modify File Warning](https://github.com/tjx666/modify-file-warning)
- [Power Edit](https://github.com/tjx666/power-edit)

Check all here: [publishers/YuTengjing](https://marketplace.visualstudio.com/publishers/YuTengjing)

## 🧡 Backers

Thanks to `JiangShiqi` for designing the extension's logo.
