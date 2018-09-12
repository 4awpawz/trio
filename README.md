# Welcome to Trio
Trio is a simple to use static website generator built with Node.js. It reflects its author's desire to rely exclusively upon the three pillars of the web, `HTML`, `JavaScript` and `CSS` along with `YAML front matter` and with the `least amount of configuration necessary` to create static websites.

As such, Trio is somewhat opinionated but if you love working with HTML, CSS and JavaScript then you just might love creating static websites with it. 

This isn't just la di da!

## Features

* Simple and easy to reason about project structure.

* Built in support for SASS as well as CSS.

* Automatic generation of all internal links as permalinks, which are based on an index.html file's parent folder name.

* Built in support for base url segments, which are generated when building your site's release build.

* Built in support for MD5 hash-based cache busting, which Trio performs when building your site's release build.

* Very generous built in support for bloging, including tags, categories and numerous catalogs of metadata that are passed to JavaScript callbacks to use when customizing your blog pages.

* Trio exposes the extensive collections of metadata it generates as a JSON file, `trio.metadata.json`, which it saves in the root of your project folder. Having the ability to actually see this data makes it much easier to reason about when coding the JavaScript callbacks that will use this data to customize your web pages.

* Through the use of *convention over configuration*, Trio requires "almost zero configuration",  which means you can start using Trio right out of the box.

* Trio provides comprehensive command line support to assist you while developing your website.

    * Create a new project
    * Build project for development.
    * Watch for changes and refresh the browser.
    * Build project for release.
    * Ask for help, but honestly Trio is so simple to use that you probably wont even need to ask for help.

## Installing Trio
Trio should be installed globally, so from the command line please run the following:

```
npm i -g @4awpawz/trio
```

## The Basics
In its most basic sense, Trio merges the markup it finds in page fragments with the markup it finds in page templates to create static web pages.

### Page Fragments
Page fragments, often just called fragments, are either markdown files or HTML files whose markup are merged with page templates and more often than not contain YAML front matter.

Below is an example of a fragment with front matter:

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

Trio recognizes numerous front matter properties which it uses internally, such as `template`, `appendToTarget`, `title` and `callback`. You are free to define any additional properties needed to further customize your web pages as long as there is no name collision with [those used internally by Trio].

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

The presence of these data-trio- attributes instruct Trio to take unique actions according to each specific data attribute and are covered in more detail [here].

For example, `data-trio-fragment` is used to indicate the HTML tag to target when merging the fragment's markup.

### JavaScript Callbacks
After Trio merges a fragment's markup with the markup of its appointed template, Trio then calls one or more JavaScript callbacks if they are declared in the fragment's front matter.

Trio passes each callback numerous arguments, which are explained in more detail [here], including all the front matter declared in the page fragment. This front matter, along with numerous other data items, can be used to dynamically add content to and customize a web page.

Below is an example of a JavaScript callback used to customize a web page's navigation menu: 

> *source/callbacks/showCurrentPageInHeader.js*
```javascript
module.exports = ($, frag) => {
    $(`li.header__nav-item:nth-child(${frag.activeHeaderItem})`)
        .addClass("header__nav-item--active");
};
```

In the callback example above, you might think that the `$` argument is a `jQuery` object, but it is not.

> **Important** There is absolutely no DOM involved here, only streams of markup. So jQuery, which interacts with the DOM and HTML elements, and not with streams of markup, would be totally useless.

The `$` argument is, in fact, a `cheerio` object that encapsulates the mashed up page.

> **Important** Instead of peppering your markup with templating language tags, such as those used with Liquid and Handlebars templates for instance, Trio uses [cheerio](https://www.npmjs.com/package/cheerio), which is a jQuery-like JavaScript API based screen-scraper, along with front matter and synchronous JavaScript callbacks to customize web pages.

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
