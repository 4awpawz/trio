# Trio

Fast, simple yet powerful JavaScript-driven static site generation.

## Documentation

### v2

https://gettriossg.com/docs/v2

### Prior Versions

<mark>Please note that earlier versions are no longer supported.</mark>

## Changelog

### v2.0.0

#### Highlights!

* Collections!
* Enhancements To The CLI

#### Other Changes

* Trio no longer appends "-map" to the output css map file name. This was cruft left over from when Buster was still appending its hash to file names, which it no longer does as it now prepends the file name with the hash.

* The trio.manifest.json file is no longer compressed.

* You are no longer required to include the .html file extension in the fragment's front matter template property.

#### Changes To gettriossg.com

There's a new home page, which more succinctly expresses what Trio is all about, and the documentation has received numerous corrections, and enhancements to make it more accurate and easier to read.

#### Upgrading From v1 to v2

The schema for the cache has changed for v2.0.0, and is incompatible with prior versions. Therefore, if you are upgrading your projects from v1 to v2, you will have to regenerate your project's cache, which you can do by running the following build command in the terminal:

```shell
$ trio build | b
```

#### Bug Fixes

* Fixed <a href="https://github.com/4awpawz/trio/issues/88">#88</a> - excerpts in markdown fragments aren't being converted to HTML.

* Fixed <a href="https://github.com/4awpawz/trio/issues/87">#87</a> - css source maps are being generated incorrectly.


### v1.1.1 (IKIGAI)

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/84">#84</a>, where stats for JSON data files and modules indicate they have dependencies to callbacks even when those callbacks no longer declare them as internal dependencies.

### v1.1.0 (IKIGAI)

#### Highlights!

* Trio now provides more information when it is unable to resolve assets. See issue <a target="_blank" href="https://github.com/4awpawz/trio/issues/83">#83</a> for more information.

#### Bug Fixes

* Addresses issue <a target="_blank" href="https://github.com/4awpawz/trio/issues/82">#82</a>, where integrity checking and dependency resolution failed to account for templates having indirect references to includes, which caused builds to fail during page generation because of missing include files.

### v1.0.0 (IKIGAI)

This marks the first stable release of v1.0.0. I'm so excited and I hope you all are too.

#### Highlights!

* Project scaffolding (<a href="https://github.com/4awpawz/trio/issues/80">issue #80</a>) is now supported as an option (i.e. `-s` | `--scaffold`) when creating a new project from the command line (e.g. `$ trio new -s path/to/new/project`).

### v1.0.0-rc.6 (IKIGAI)

#### Highlights!

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/79">#79</a> which formalizes blog archive pages into the project just like blog tag and blog category pages are.

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/81">#81</a> which would cause destination paths for blog subsidiary pages and archive pages to be generated incorrectly.

### v1.0.0-rc.5 (IKIGAI)

#### Highlights!

* For callbacks that throw exceptions, Trio would catch the exceptions and print just their message to the console, leaving it up to the user to determine which module actually threw the exception. Now, when callbacks throw exceptions, Trio will also print their module names along with their messages to the console.

#### Bug Fixes

* Breaking Change - Fragment properties `destPath` (the generated page's target file path) and `url` (the generated page's URL) are now generated in all lowercase.

* Breaking Change - Trio no longer generates a unique `id` property for fragments due to the expense in terms of the development time required to maintain their integrity during incremental builds. In its place, users should now use the fragment's `url` property, which is intrinsically always unique.

* Breaking Change - Callback argument `$` has been renamed to `$page` for clarity and consistency.

### v1.0.0-rc.4 (IKIGAI)

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/74">#74</a> which would cause garbage collection to fail to identify the _original_ blog article to delete when the user changes the blog article's category.

### v1.0.0-rc.3 (IKIGAI)

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/73">#73</a> which would cause dependency resolution to fail if tag-based callbacks are declared with their `.js` file extensions.

### v1.0.0-rc.2 (IKIGAI)

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/72">#72</a> which would cause include assets with `.html` file extension to be wrongly interpreted as markdown files.

### v1.0.0-rc.1 (IKIGAI)

This marks the first release candidate for Trio v1. The journey from v0.0.6, which served as a solid proof of concept, to now, has been a long and sometimes difficult one, but in the end I can truly say that it has been a labor of love. I hope you all enjoy it.

#### Highlights!

* Integrity Checking checks your project's chains of dependencies and notifies you when assets can't be resolved.

* Incremental Build reduces project build times by limiting processing to only stale assets.

* Tag-Based JavaScript Callbacks replace the template engines and frameworks that other static site generators require you to use to extend your composites.

### v0.0.6

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/59">#59</a> which would cause etc folder processing to ignore dot files.

### v0.0.5

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/58">#58</a> which would raise an exception when generating the public destination paths for category pages.

### v0.0.4

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/57">#57</a> which adds the `source/etc` folder to generated projects and whose files are copied as is to the root of the public folder for both dev and release builds. This folder is intended to be used for files like `favicon.ico, robots.txt, sitemaps, .nojekyll, .etc` which need to reside in the public folder.


### v0.0.3

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/56">#56</a> which adds a new configuration option, `"nojekyll"`, which when set to `true` instructs Trio to write a `.nojekyll` file to the public folder when generating a release build to completely bypass Jekyll processing on GitHub Pages.

### v0.0.2

#### Bug Fixes

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/55">#55</a> which would cause the generation of inaccurate public paths for blog articles that have nested categories.

* Addresses issue <a href="https://github.com/4awpawz/trio/issues/54">#54</a> which would cause the generation of inaccurate public paths for blog articles that have complex names.

## Copyright And License

Code and documentation Copyright &copy;2018 Jeffrey Schwartz All Rights Reserved

Code licensed <a target="_blank" href="https://github.com/4awpawz/trio/blob/master/LICENSE">MIT</a>, docs <a target="_blank" href="https://creativecommons.org/licenses/by/3.0/">CC By 3.0</a>.