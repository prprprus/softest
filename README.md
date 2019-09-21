# softest

<img src="https://i.loli.net/2019/09/21/5ybk4xDOeAgJwRL.png" alt="logo" width="600"></a>

![build status](https://travis-ci.org/prprprus/softest.svg?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/prprprus/softest/badge.svg?targetFile=package.json)](https://snyk.io//test/github/prprprus/softest?targetFile=package.json)
[![](https://img.shields.io/badge/npm-6.10.2-orange)]()
[![license](https://img.shields.io/badge/license-license-yellow.svg)](./LICENSE)
[![](https://img.shields.io/badge/CN-%E4%B8%AD%E6%96%87-%09%23ff2121.svg)](./README-zh.md)

The softest is a test tool for recording browser interactions and generating test scripts, simple and practical. It allows you to get test scripts without writing code.

[![softest2.png](https://i.loli.net/2019/09/21/O3kMSqW4Deny7Al.png)](https://vimeo.com/354273223)

## 🔍 Why

When I needed a tool that could record browser interactions and generate corresponding scripts, I found [puppeteer-recorder](https://github.com/checkly/puppeteer-recorder) and [Selenium IDE](https://www.seleniumhq.org/selenium-ide/), of course, they are excellent projects. But I found that they can't support multi-tab recording, screenshots, etc., and Selenium IDE always gives an error when playing a script, so I made this wheel.

## 🔥 Features

#### Supported Features

- Single tab recording
- Multiple tab recording
- Screenshot
- Generating test script
- Playback script
- Download test report (contains screenshots and test script)

#### Supported Interactions

- Click
- New tab
- Close tab
- Change URL
- Input
- Scroll page

Tab switching rules: temporarily not support manual tapping tabs to switch pages. For example, opened three tabs, currently in the latest tab3, you can't manually switch to tab2 or tab1 at this time, which will cause inconsistency, but you can go back to tab2 through close tab3, then close tab2 and return to tab1.

## ⚙️ Installation

#### Dependencies

- Node >= v10.16.3 (recommend v12.8.0)
- Npm (recommend 6.10.2)

```bash
$ npm i -g softest
```

The softest is based on Puppeteer, when downloading Puppeteer, Chromium will be downloaded by default. Chinese users may be affected by GFW. If you encounter difficulties, you can move to [README-Zh.md](./README-zh.md).

## 🚀 Usage

Add environment variables to facilitate running commands:

```bash
$ export PATH=$PATH:$HOME/.npm-global/bin
```

`softest` has only a few parameters:

```bash
$ softest --help
Usage: index [options]

Options:
  -h, --host <hostname>  Server hostname, optional. (default: "127.0.0.1")
  -p, --port <port>      Server port, optional. (default: 2333)
  -c, --chromium <path>  The absolute path of the chromium execution file, necessary.
  -r, --report <path>    The absolute path of the test report, necessary.
  -h, --help             output usage information
```

To run the `softest` command, you need to specify the directory where the Chromium and the directory where the test report is saved:

```bash
$ soft -c PATH_CHROMIUM -r PATH_REPORT
```

> If you don't know where the Chromium is, you can start Chromium and type `chrome://version/` in the address bar to find the location of its executable.

If you see an output similar to the following, congratulations 🎉🎉🎉👏

```bash
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

Open a browser, type `host` and `port`, you will see the following web interface:

![softest1.png](https://i.loli.net/2019/09/21/rpWZjdP5lkYwHJM.png)

## ⭐️ Show Your Support

Please give a ⭐️ if this project helped you!

## 👏 Contributing

If you have any questions or requests or want to contribute to `moveable` or other packages, please write the [issue](https://github.com/prprprus/softest/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/prprprus/softest/issues) on GitHub.

## 📝 License

See [LICENSE](./LICENSE) for more information.
