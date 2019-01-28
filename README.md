# Welcome to Trio

Trio is an open source toolkit for building static websites using HTML, CSS and JavaScript and requires almost "zero configuration". You use YAML front matter, JavaScript and Sass to quickly prototype and implement your designs, which makes Trio the perfect tool for those who love to design in the browser.

## Documentation

https://4awpawz.github.io/trio-docs-pages/


## Changelog

### v0.0.5

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/58">#58</a> which would raise an exception when generating the public destination paths for category pages.

### v0.0.4

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/57">#57</a> which adds the `source/etc` folder to generated projects and whose files are copied as is to the root of the public folder for both dev and release builds. This folder is intended to be used for files like `favicon.ico, robots.txt, sitemaps, .nojekyll, .etc` which need to reside in the public folder.


### v0.0.3

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/56">#56</a> which adds a new configuration option, `"nojekyll"`, which when set to `true` instructs Trio to write a `.nojekyll` file to the public folder when generating a release build to completely bypass Jekyll processing on GitHub Pages.

### v0.0.2

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/55">#55</a> which would cause the generation of inaccurate public paths for blog articles that have nested categories.

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/54">#54</a> which would cause the generation of inaccurate public paths for blog articles that have complex names.

## Copyright And License

Code and documentation Copyright &copy;2018 Jeffrey Schwartz All Rights Reserved

Code licensed <a target="_blank" href="https://github.com/4awpawz/trio/blob/master/LICENSE">MIT</a>, docs <a target="_blank" href="https://creativecommons.org/licenses/by/3.0/">CC By 3.0</a>.