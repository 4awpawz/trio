# Welcome to Trio

Trio is a simple to use static website generator built with Node.js. It reflects its author's desire to rely exclusively upon the three pillars of the web - `HTML`, `JavaScript` and `CSS` - along with `YAML front matter` and with the `least amount of configuration necessary`, to create static websites.

As such, Trio is somewhat opinionated but if you love working with HTML, CSS and JavaScript then you just might love creating static websites with it. 

This isn't just la di da!

## Features

* Simple and easy to reason about project structure.

* Built in support for SASS as well as CSS.

* Automatic generation of all internal links as permalinks, which are based on an index.html file's parent folder name.

* Built in support for `base url` segments, which are generated when building your site's release build. For more information, see [HTML Data Attributes Internally Used By Trio](#html-data-attributes-internally-used-by-trio).

* Built in support for MD5 hash-based cache busting, which Trio performs when building your site's release build.

* Very generous built in support for bloging, including tags, categories and numerous catalogs of metadata that are passed to JavaScript callbacks to use when customizing your blog pages.

* Trio exposes its extensive collections of metadata that it generates as a JSON file, `trio.metadata.json`, which it saves in the root of your project folder. Having the ability to actually see this data makes it much easier to reason about when coding the JavaScript callbacks that will use this data to customize your web pages.

* Through the use of *convention over configuration*, Trio requires "almost zero configuration",  which means you can start using Trio right out of the box.

* Trio provides comprehensive command line support to assist you while developing your website.

    * Create a new project
    * Build project for development.
    * Watch for changes and refresh the browser.
    * Build project for release.
    * Ask for help, but honestly Trio is so simple to use that you probably wont even need to ask for help.

## Installing Trio

Trio is meant to be installed globally, so from the command line please run the following:

```
npm i -g @4awpawz/trio
```

## The Basics

In its most basic sense, Trio merges the markup it finds in page fragments with the markup it finds in page templates to create static web pages.

### Page Fragments

Page fragments, often just called fragments, can be either markdown or HTML files and must always contain [YAML front matter](https://github.com/jonschlinkert/gray-matter). They optionally may also contain markdown or HTML content.

Page fragments must always declare in their front matter which page template they are asociated with using the front matter `template` property.

Below is an example of a fragment with front matter and HTML content. _**Please note that Trio requires HTML opening and closing comment tags (i.e. &lt;!--, --&gt;) as YAML opening and closing delimeters**_:

> *source/fragments/about.html*
```html
<!--
template: default.html
appendToTarget: true
title: About
activeHeaderItem: 4
callback: showCurrentPageInHeader.js
-->

<div class="banner">
    <img data-trio-link="" class="banner__image" src="/media/mist-niagara-falls-river.jpg" alt="image of blog">
</div>

<section class="container">
    <h1 class="page-title">About</h1>
</section>
```

Below is an example of a fragment that only contains front matter:

```yaml
<!--
description: blog index page fragment
template: blog.html
appendToTarget: true
title: Trio Blog
callback:
  - blogindex.js
  - showCurrentPageInHeader.js
page: 1
activeHeaderItem: 3
-->
```

Trio recognizes numerous front matter properties which it uses internally, such as `template`, `appendToTarget`, `title` and `callback`. You are free to define any additional properties needed to further customize your web pages as long as there is no name collision with those used internally by Trio. For more information, see [Front Matter Properties Internally Used By Trio](#front-matter-properties-internally-used-by-trio).

### Includes

Includes are either markdown files or HTML files whose markup is used as snippets, such as for site-wide headers and footers. Includes can also optionally contain YAML front matter.

Below is an example of an include file with YAML front matter whose content is used as a site-wide header:

> *source/includes/header.html*
```html
<!--
callback: setBlogFolderName.js
-->
<header class="header-container header-container--fixed">
    <div class="container">
        <div class="header__promo">
            <div class="header__promo-text">Trio</div>
        </div>
        <label class="hamburger-helper" for="hamburger-checkbox">
            <div class="header-hamburger">
                <div class="hamburger-bun">
                    <div class="hamburger-patty"></div>
                    <div class="hamburger-patty"></div>
                    <div class="hamburger-patty"></div>
                </div>
            </div>
        </label>
        <input class="hamburger-checkbox" type="checkbox" id="hamburger-checkbox" autocomplete="off">
        <nav class="header__nav">
            <ul class="header__nav-items">
                <li class="header__nav-item">
                    <a data-trio-link class="header__nav-item-link" href="/">
                        <i class="fas fa-home header__nav-item-icon"></i>Home</a>
                </li>
                <li class="header__nav-item">
                    <a data-trio-link class="header__nav-item-link" href="/docs">
                        <i class="fas fa-file header__nav-item-icon"></i>Docs</a>
                </li>
                <li class="header__nav-item">
                    <a id="trio-blog-link" data-trio-link class="header__nav-item-link" href="/blog">
                        <i class="fas fa-columns header__nav-item-icon"></i>Blog</a>
                </li>
                <li class="header__nav-item">
                    <a data-trio-link class="header__nav-item-link" href="/about">
                        <i class="fas fa-info header__nav-item-icon"></i>About</a>
                </li>
            </ul>
        </nav>
    </div>
</header>
``` 

### Page Templates

Page templates, often just called templates, are HTML files whose markup define the overall structure of static web pages.

Below is an example of a template:

> *source/templates/default.html*
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Trio Default Template</title>
    <link href="https://fonts.googleapis.com/css?family=Merriweather:900|Sacramento&text=Trio|Source+Sans+Pro" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
        crossorigin="anonymous">
    <link data-trio-link rel="stylesheet" href="/css/style.css">
</head>

<body>
    <header data-trio-include="header.html"></header>
    <main data-trio-fragment></main>
    <footer data-trio-include="footer.html"></footer>
</body>

</html>
```

In the template example above there are numerous HTML tags that have data attributes that begin with `data-trio-`, such as `data-trio-link`, `data-trio-include` and `data-trio-fragment`.

The presence of these data-trio- attributes instruct Trio to take unique actions according to each specific data attribute. For more information, see [HTML Data Attributes Internally Used By Trio](#html-data-attributes-internally-used-by-trio).

For example, `data-trio-fragment` is used to indicate the HTML tag to target when merging the fragment's markup.

### JavaScript Callbacks

After Trio merges a fragment's markup with the markup of its appointed template, Trio then calls one or more JavaScript callbacks if they are declared in the fragment's front matter.

Trio passes each callback numerous arguments, which are explained in more detail [here], including all the front matter declared in the page fragment. This front matter, along with numerous other data items, can be used to dynamically add content to and customize a web page.

Below is an example of a JavaScript callback used to customize a web page's navigation menu: 

> *source/callbacks/showCurrentPageInHeader.js*
```javascript
module.exports = ({$, frag}) => {
    $(`li.header__nav-item:nth-child(${frag.activeHeaderItem})`)
        .addClass("header__nav-item--active");
};
```

In the callback example above, you might think that the `$` argument is a `jQuery` object, but it is not.

> **Important** There is absolutely no DOM involved here, only static streams of markup text. So jQuery, which interacts with the DOM and HTML elements, and not with static streams of markup text, would be totally useless.

The `$` argument is, in fact, a `cheerio` object that encapsulates the mashed up page.

> **Important** Instead of peppering your markup with templating language tags, such as those used with Liquid and Handlebars templates for instance, Trio uses [cheerio](https://www.npmjs.com/package/cheerio), which is a jQuery-like JavaScript API based screen-scraper, along with front matter and synchronous JavaScript callbacks to customize your site's web pages.

## Front Matter Properties Internally Used By Trio

### template

A string value. Its value declares the name of the page template file that the fragment is associated with.

### appendToTarget

A boolean value. If `true` instructs Trio to append the page fragment's content to the html tag in the page template that has the `data-trio-fragment` attribute. If `false` or if the property isn't declared instructs Trio to replace the .html tag in the page template that has the `data-trio-fragment` attribute with the page fragment's content.

### title

A string value. Trio uses its value to set the title of the generated page.

### callback

An array of strings or a single string value. Used to declare the names of one or more JavaScirpt files whose modules  will be called synchronously by Trio. For more information see [JavaScript Callbacks](#javascript-callbacks).

## HTML Data Attributes Internally Used By Trio

As mentioned in [Page Templates](#page-templates), Trio recognizes numerous HTML tag data attributes that begin with data-trio-. Below is a complete list of these attributes along with their descriptions:

### data-trio-fragment

This attribute instructs Trio to taget this HTML tag in your page template markup when merging page fragment content with this template.

> Note: If a template isn't expecting any content from fragments then this data attribute can be omitted.

By default, Trio replaces the HTML tag with the content from the page fragment. To append the page fragment content to this HTML tag, you can declare `appendToTarget: true` in your page fragment front matter. For more information, see [Front Matter Properties Used Internally By Trio](#front-matter-properties-internally-used-by-trio).

> &lt;main data-trio-fragment&gt;&lt;/main&gt;

### data-trio-include

This attribute instructs Trio to target this HTML tag in your page template markup when merging the include file content with this template.

By default, Trio replaces the HTML tag with the content from the include file. To append the include file content to this HTML tag, you can declare `appendToTarget: true` in your include file front matter. For more information, see [Front Matter Properties Used Internally By Trio](#front-matter-properties-internally-used-by-trio).

> &lt;header data-trio-include="header.html"&gt;&lt;/header&gt;

### data-trio-link

This attribute instructs Trio to prepend your production site's *base url* to this tag's `src` or `href` attribute's value when you run a *release build*. See [release build] below for more details. You declare your site's base url in your project's `trio.json` configuration file. See [configuration] below for more information.

```html
<a data-trio-link class="header__nav-item-link" href="/">...</a>
```

## Trio Project Structure

### root/

The root project folder for the Trio project.

### root/public/

The folder where the generated webiste is saved to and is recreated whenever Trio builds the project's source folder

### root/source/

The Trio project's development folder.

### root/source/callbacks/

The folder where JavaScript callback modules are kept.

### root/source/css/

The folder where CSS files are kept.

### root/source/data/

The folder where .json data files are kept

### root/source/fragments/

The folder where .md and .html fragments are kept.

### root/source/fragments/blog

The folder where .md and .html blog specific fragments are kept.

### root/source/fragments/blog/articles

The folder where .md and .html blog article specific fragments are kept.

### root/source/includes/

The folder where .md and .html include files are kept.

### root/source/media/

The folder where media (.jpg, .gif, .pdf, .etc) are kept.

### root/source/sass/

The folder where the main and import .scss files are kept.

### root/source/scripts/

The folder where run-time JavaScript files are kept.

### root/source/templates/

The folder where .html templates are kept.

### root/trio.json

The project's configuration file.

### root/trio.manifest.json

Contains extensive collections of metadata that is generated everytime Trio builds the project.