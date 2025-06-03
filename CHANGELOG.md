## v0.11.0 (2025-06-03)

### 🚀 Features

- Add short pathSeparator alias ([7fcb7af](https://github.com/tjx666/open-in-external-app/commit/7fcb7af))
- Add Russian localization ([84cc5c1](https://github.com/tjx666/open-in-external-app/commit/84cc5c1))
- Add environment variables to shell command ([014f333](https://github.com/tjx666/open-in-external-app/commit/014f333))

### 🐞 Bug Fixes

- Make async loop awaited ([080e99a](https://github.com/tjx666/open-in-external-app/commit/080e99a))

### ❤️ Contributors

- Dmitriy Pomerantsev ([@pda0](http://github.com/pda0))

[View changes on GitHub](https://github.com/tjx666/open-in-external-app/compare/v0.10.0...v0.11.0 '2025-06-03')

## v0.10.0 (2023-08-10)

### 🐞 Bug Fixes

- Wsl file path #58 ([#58](https://github.com/tjx666/open-in-external-app/issues/58))

### ❤️ Contributors

- King-of-Infinite-Space

[View changes on GitHub](https://github.com/tjx666/open-in-external-app/compare/v0.9.12...v0.10.0 '2023-08-10')

## v0.9.12 (2023-08-05)

No significant changes

[View changes on GitHub](https://github.com/tjx666/open-in-external-app/compare/v0.9.11...v0.9.12 '2023-08-05')

## v0.9.11 (2023-08-05)

### 🐞 Bug Fixes

- Doesn't work in wsl #58 ([#58](https://github.com/tjx666/open-in-external-app/issues/58))

### ❤️ Contributors

- YuTengjing ([@tjx666](http://github.com/tjx666))

[View changes on GitHub](https://github.com/tjx666/open-in-external-app/compare/v0.9.10...v0.9.11 '2023-08-05')

## [0.9.10] - 2023-04-28

### Fixed

- #55

## [0.9.9] - 2023-04-27

### Changed

- just fix the publish github action

## [0.9.8] - 2023-04-27

### Added

- new setting `openInExternalApp.enableLog` to toggle log

### Changed

- update deps
- code optimize

## [0.9.7] - 2023-03-20

### Changed

- adjust esbuild target to ESNext

## [0.9.6] - 2023-03-20

### Changed

- reduce extension size

## [0.9.5] - 2023-03-20

### Fixed

- fix broken badges

## [0.9.4] - 2023-03-19

### Fixed

- fix broken badges

## [0.9.3] - 2023-03-19

### Changed

- just upgrade deps

## [0.9.1] - 2022-12-25

### Fixed

- <https://github.com/tjx666/open-in-external-app/issues/46#issuecomment-1363591395>

## [0.9.0] - 2022-11-29

### Added

- new variables cursorLineNumber, cursorColumnNumber
- support shared config #45
- support set shortcut for specific config item #44

## [0.8.4] - 2022-11-07

### Added

- add more logging to help debug bugs

## [0.8.3] - 2022-11-07

### Added

- add some logging to help debug bugs

## [0.8.2] - 2022-10-31

### Fixed

- fix: can't parse fileDirname out of current folder

## [0.8.1] - 2022-10-17

### Changed

- update package.nls.pt-br.json

## [0.8.0] - 2022-10-17

### Added

- Brazilian Portuguese nls support

## [0.7.0] - 2022-10-16

### Added

- Chinese nls support

## [0.6.3] - 2022-10-14

### Added

- feat: new shellCommand setting support custom shell command for file

## [0.6.2] - 2022-10-12

### Added

- feat: support pass variables to command arguments(#35)

## [0.6.1] - 2022-10-11

### Fixed

- Key bindings not working for binary files(#36)

## [0.6.0] - 2022-08-08

### Fixed

- try fix #16

## [0.5.0] - 2022-06-14

### Added

- try fix #5

### Changed

- hide context menu of this extension on webview editor title

## [0.4.1] - 2022-02-06

### Changed

- remove useless husky config in extension dist

## [0.4.0] - 2022-02-06

### Changed

- upgrade dependencies to latest

## [0.3.1] - 2021-05-01

### Changed

- upgrade dependencies to latest

## [0.3.0] - 2021-02-22

### Fixed

- configuration description

### Added

- `extensionName` config item support wildcard which support open all files in specified app

## [0.2.1] - 2020-10-23

### Changed

- upgrade deps to latest includes webpack5

## [0.2.0] - 2020-07-18

### Added

- extensionName in configuration allows string array [issue #9](https://github.com/tjx666/open-in-external-app/issues/9)

## [0.1.0] - 2020-06-06

### Fixed

- [issue #6](https://github.com/tjx666/open-in-external-app/issues/6)

## [0.0.8] - 2020-05-06

### Added

- support open with editor title context menu

## [0.0.7] - 2020-05-01

### Added

- support configure the openCommand arguments

## [0.0.6] - 2020-01-09

### Added

- known issues

## [0.0.5] - 2019-12-17

### Changed

- add some file to .vscodeignore

## [0.0.4] - 2019-12-17

### Added

- add configuration properties suggestion
- support open current active editor document in external app using command panel

## [0.0.2] - 2019-12-12

### Added

- add backers to README

### Fixed

- correct the title emoji

## [0.0.1] - 2019-12-12

### Added

- support open file with external app in VScode
