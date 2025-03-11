### [3.2.1](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v3.2.0...v3.2.1) (2025-03-11)


### Bug Fixes

* **ci:** jSR CI ([ac1a724](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/ac1a724ad4bf70eb8ce5d26e193764c680419dc0))

## [3.2.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v3.1.0...v3.2.0) (2025-03-11)

## [3.1.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v3.0.0...v3.1.0) (2025-03-11)


### Features

* **add jsr:** add jsr config ([40666fb](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/40666fb211f6a5f3c6245e946deffea11c740fd4))


### Miscellaneous Chores

* **remove jsr plugin from semantic:** remove JSR plugin ([466d873](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/466d873211f62da8faacde4d8787045ece7baca4))

## [3.0.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.6.0...v3.0.0) (2025-03-11)


### ⚠ BREAKING CHANGES

* **package name change:** The name needs to be adjusted in all package.json files

### refactor

* **package name change:** node was wrong in the package name, its a lib ([9a80556](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/9a8055669b05c6665d06e4e2839a7e6233de7f08))

## [2.6.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.5.1...v2.6.0) (2025-03-10)


### Features

* **support debugability:** show an alert once a day outside of wui env ([fb1aaa7](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/fb1aaa7d49f6968b5036ceba8a4f84ef849e19bd))

### [2.5.1](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.5.0...v2.5.1) (2025-03-05)


### Bug Fixes

* **package.json:** fix missingt type decalartions ([21791d4](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/21791d4339a83fca265ec89ca8350316f78c648f))

## [2.5.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.4.0...v2.5.0) (2025-03-05)


### Features

* **testing subsystem:** add mocks for testing wui more easily ([1fdb0a9](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/1fdb0a959ff5e564916e974ea7b0978077ef6a46))

## [2.4.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.3.1...v2.4.0) (2024-07-29)

### [2.3.1](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.3.0...v2.3.1) (2024-07-28)


### Bug Fixes

* **replatool:** replaytoool tried to overwrite query function even if backend was present ([dda54af](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/dda54af51b37c7853f94ab534cd5a340145e0970))

## [2.3.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.2.0...v2.3.0) (2024-07-27)


### Features

* **replay tools:** implement base functionality for replay buttons and file handling ([d4393c3](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/d4393c3a1cab678c4192a7b512433b768f688c7b)), closes [#8](https://gitlab.zweieuro.at/wui/web-user-interface-node/issues/8)
* **replaytool:** finish implementing CSV parsing and proper replay methods ([6c27127](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/6c27127b70b992ec63d9ea91eeed98346f557e6a)), closes [#8](https://gitlab.zweieuro.at/wui/web-user-interface-node/issues/8)


### Bug Fixes

* **replaytool:** fix include for replayTools file and skip invalid lines ([10595c5](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/10595c506809e50573c6b0b834364e5f5a298120)), closes [#8](https://gitlab.zweieuro.at/wui/web-user-interface-node/issues/8)

## [2.2.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.1.0...v2.2.0) (2024-07-11)

## [2.1.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v2.0.0...v2.1.0) (2024-07-11)


### Features

* **utility:** add prettier-eslint; add error element on body on failure & related tests ([c9be608](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/c9be60877f3b2231df750cc9ca94b22cdf9c4563))

## [2.0.0](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v1.0.8...v2.0.0) (2024-05-05)


### ⚠ BREAKING CHANGES

* **persistent callback identifier system:** callback identification changed fundermentally

### Features

* **persistent callback identifier system:** change persistent cb id from function to symbol ([457cac6](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/457cac6e12b1ec723cce51e818b218670e64c800)), closes [#6](https://gitlab.zweieuro.at/wui/web-user-interface-node/issues/6)


### Miscellaneous Chores

* **jsdocs:** add Better JSDocs and make use of JSdocs to md with a TS plugin add it to the pipeline ([d4b02eb](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/d4b02ebcf59deaf12e3fd1f0a40945eda59a7433))

### [1.0.8](https://gitlab.zweieuro.at/wui/web-user-interface-node/compare/v1.0.7...v1.0.8) (2024-03-03)


### Bug Fixes

* **ci:** add changelog, first full release and npm release ([dfb6fd7](https://gitlab.zweieuro.at/wui/web-user-interface-node/commit/dfb6fd71f8decf9e5ac73a40dd8999bf010205e2))
