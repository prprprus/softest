# Softest

![build status](https://travis-ci.org/prprprus/softest.svg?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/prprprus/softest/badge.svg?targetFile=package.json)](https://snyk.io//test/github/prprprus/softest?targetFile=package.json)
[![license](https://img.shields.io/badge/license-license-yellow.svg)](./LICENSE)

Softest is an automated test tool for recording browser interactions and generating test scripts, simple and practical.
It allows you to get test scripts without writing code.

```
 _______  _______  _______  _______  _______  _______  _______
|       ||       ||       ||       ||       ||       ||       |
|  _____||   _   ||    ___||_     _||    ___||  _____||_     _|
| |_____ |  | |  ||   |___   |   |  |   |___ | |_____   |   |
|_____  ||  |_|  ||    ___|  |   |  |    ___||_____  |  |   |
 _____| ||       ||   |      |   |  |   |___  _____| |  |   |
|_______||_______||___|      |___|  |_______||_______|  |___|
```

![]()

#### Supported features

- Single tab recording
- Multiple tab recording
- Screenshot
- Generating test script
- Play test script
- Download test report (contains screenshots and test script)

#### Supported browser interactions

- Click
- New tab
- Close tab
- Change URL
- Input
- Scroll page

Note: Temporarily not support manual tapping tabs to switch pages. For example, opened three tabs, currently in the latest tab3, you can't manually switch to tab2 or tab1 at this time, which will cause inconsistency, but you can go back to tab2 through close tab3, then close tab2 and return to tab1.

# Installation

#### Dependencies

- Node >= v10.16.3 (recommend v12.8.0)

```
$ npm i -g softest
```

Softest is based on Puppeteer, when downloading Puppeteer, Chromium will be downloaded by default. Chinese users may be affected by GFW. If you encounter difficulties,you can move to [README-Zh.md](./README-Zh.md).

# Usage

Add environment variables to facilitate running commands:

```
$ export PATH=$PATH:$HOME/.npm-global/bin
```

`softest` has only a few parameters:

```
$ softest --help
Usage: index [options]

Options:
  -h, --host <hostname>  Server hostname, optional. (default: "127.0.0.1")
  -p, --port <port>      Server port, optional. (default: 2333)
  -c, --chromium <path>  The absolute path of the chromium execution file, necessary.
  -r, --report <path>    The absolute path of the test report, necessary.
  -h, --help             output usage information
```

To run the `softest` command, you need to specify the directory where the chromium and the directory where the test report are saved:

```
$ soft -c PATH_CHROMIUM -r PATH_REPORT
```

> If you don't know where the Chromium is, you can start Chromium and type `chrome://version/` in the address bar to find the location of its executable.

If you see an output similar to the following, congratulations 🎉🎉🎉👏

```
 _______  _______  _______  _______  _______  _______  _______
|       ||       ||       ||       ||       ||       ||       |     status: running
|  _____||   _   ||    ___||_     _||    ___||  _____||_     _|     host: 127.0.0.1
| |_____ |  | |  ||   |___   |   |  |   |___ | |_____   |   |       port: 2333
|_____  ||  |_|  ||    ___|  |   |  |    ___||_____  |  |   |
 _____| ||       ||   |      |   |  |   |___  _____| |  |   |
|_______||_______||___|      |___|  |_______||_______|  |___|

🎉 Running WebSocket server successfully

🎉 Running HTTP server successfully
```

# License

See [LICENSE](./LICENSE) for more information.
