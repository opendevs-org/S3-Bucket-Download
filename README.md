<h1 align="center">👋 Welcome to S3 Bucket Download (s3-bucket-download) 🕶</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/MiKr13/S3-Bucket-Download/#README" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/mikr1306" target="_blank">
    <img alt="Twitter: mikr1306" src="https://img.shields.io/twitter/follow/mikr1306.svg?style=social" />
  </a>
</p>

> This project enables downloading data from s3 a breeze, it has 3 modes (CLI mode, Interactive mode & Download All mode) using which you can download s3 bucket files into default or custom path.

### 🏠 [Homepage](https://github.com/MiKr13/S3-Bucket-Download/#README)

<!--### ✨ [Demo](https://github.com/MiKr13/S3-Bucket-Download/#README) -->

## Install

```sh
npm install
```

## Usage

#### _CLI mode:_

```sh
node download --bucketName=[comma,seperated,bucketnames] --path=[path where you want to save, for ex: ../data]
```
> Without brackets ofcourse.

#### _Interactive mode:_

```sh
node download
```
> It'll display list of all buckets in an array & ask for options like:

![Interactive mode options](.screenshots/interactive-mode.png)

#### _Download All mode:_

```sh
node download --all
```
> Just downloads all of the files in all of the buckets.

#### Logs:
It shows logs too, like these:
![Interactive mode options](.screenshots/logs.png)

## 🕺 Author

**Mihir Kumar**

* Twitter: [@mikr1306](https://twitter.com/mikr1306)
* Github: [@MiKr13](https://github.com/MiKr13)
* LinkedIn: [@mikr13](https://linkedin.com/in/mikr13)
* Medium: [@mikr13](https://medium.com/@mikr13)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/MiKr13/S3-Bucket-Download/issues).

## 🗒 Upcoming Plans

1. Support for different AWS profiles & regions
2. Add a GUI on top of this (React + Electron planned)

Welcoming contributions!

## 🦸 Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Mihir Kumar](https://github.com/mikr13).<br />
This project is [MIT](https://github.com/MiKr13/S3-Bucket-Download/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_