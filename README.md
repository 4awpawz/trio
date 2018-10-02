# Welcome to Trio

Trio is a simple to use static website generator built with Node.js. It reflects its author's desire to rely exclusively upon the three pillars of the web - *HTML*, *JavaScript* and *CSS* - along with *YAML front matter* and with the *least amount of configuration necessary*, to create static websites.

As such, Trio is somewhat opinionated but if you love working with HTML, CSS and JavaScript then you just might love creating static websites with it. 

This isn't just la di da!

__!__ _Please note that throughout this document the term `content`, when used, is understood to mean `HTML`, which could also have been derived from markdown._

## Features

* Simple and easy to reason about [project structure](#project-structure).

* [Front Matter](#front-matter) will parse as HTML comments and wont break your markup's formatting.

* Built in support for SASS as well as CSS.

* Automatic generation of all internal links as permalinks, which are based on an index.html file's parent folder name.

* Built in support for `base url` segments, which are generated when building your site's release build. For more information see [data-trio attributes](#data-trio-attributes) and [configuration](#configuration).

* Built in support for MD5 hash-based cache busting, which Trio performs when building your site's release build.

* Extensive support for [blogging](#blogging), including tags, categories and numerous catalogs of metadata that are passed to JavaScript callbacks to use when customizing your blog pages.

* Trio exposes its extensive collections of [metadata](#metadata) that it generates as a JSON file, `trio.metadata.json`, which it saves in the root of your project folder. Having the ability to actually see this data makes it much easier to reason about when coding the [JavaScript callbacks](#javascript-callbacks) that will use this data to to dynamically add content to and customize your web pages.

* Through the use of *convention over configuration*, Trio requires almost zero [configuration](#configuration), which means you can start using Trio right out of the box.

* Trio provides comprehensive [command line](#command-line) support to assist you while developing your website.

    * Create a new project
    * Build project for development.
    * Watch for changes and refresh the browser.
    * Build project for release.
    * Ask for help, but honestly Trio is so simple to use that you probably wont even need to ask for help.

## Installing Trio

Trio is meant to be installed globally. From the command line please run the following:

```
npm i -g @4awpawz/trio
```

## Quick Start

## High Level - How Trio Creates Web Pages

Trio performs the following action for every [include](#includes) file it finds in the [source/includes folder](#project-structure).

1. If the include has front matter and its front matter declares one or more [JavaScript callbacks](#javascript-callbacks), Trio will synchronously call each of the callbacks, passing them a single argument called a [context](#context-argument) whose properties can be destructured and used by the callback to further customize the include's content. 

Having processed all of the include files, Trio then performs the following actions for every [page fragment](#page-fragments) file it finds in the [source/fragments folder](#project-structure).

1. Trio merges any content that might be contributed by the page fragment with the content contributed by the page fragment's associated [page template](#page-templates). This produces what can be called a *mashup*.

1. If the mashup contains one or more HTML tags that have a `data-trio-include` attribute, Trio will merge the content of each requested [include](#includes) with the mashup.

1. If the page fragment's front matter declares one or more [JavaScript callbacks](#javascript-callbacks), Trio will synchronously call each of the callbacks, passing them a single argument called a [context](#context-argument) whose properties can be destructured and used by the callback to further customize the mashup. 

## Front Matter

Trio projects can make extensive use of YAML front matter to add content to and customize their web pages. Trio also predefines and reserves several front matter data properties that can be used.

__!__ _Trio uses the resilient and fast [gray-matter library](https://github.com/jonschlinkert/gray-matter) to implement its front matter support. If you aren't already familiar with front matter you are urged to follow the link to this library and read its excellent documentation._

__!__ _You are free to define and use your own front matter data properties to further customize your web pages as long as they do not collide with the the names of those predefined by Trio._

__!__ _Trio uses the open and close HTML comment tags (i.e. &lt;!--, --&gt;) as YAML front matter open and close delimiters, so front matter will not create formatting issues in your .html and .md files._

### Front Matter Data Properties Predefined By Trio

#### template

```html
<!--
template: default.html
-->
```

value type: a `string`

context: page fragments only

required: yes

It is used to associate a [page template](#page-templates) file with this [page fragment](#page-fragments).

#### appendToTarget

```html
<!--
appendToTarget: true
-->
```

value type: a `boolean`

context: includes and page fragments

required: no

When used in an [include](#includes) and if set to `true` then Trio will append the include's content to the html tag in the associated [page template](#page-templates) that has the [`data-trio-include`](#data-trio-include) attribute. If set to `false` or if the property isn't declared then Trio replaces the html tag in the associated page template that has the `data-trio-include` attribute with the include's content.

When used in a [page fragment](#page-fragments) and if set to `true` then Trio will append the page fragment's content to the html tag in the associated [page template](#page-templates) that has the [`data-trio-fragment`](#data-trio-fragment) attribute. If set to `false` or if the property isn't declared then Trio replaces the html tag in the associated page template that has the `data-trio-fragment` attribute with the page fragment's content.

#### title

```html
<!--
title: About
-->
```

value type: a `string`

context: page fragments only

required: no

It is used to set the title of the generated page. If it isn't provided, Trio will use the *title tag in the head section* of the associated [page template](#page-templates).

#### callback

```html
<!--
callback:
  - article.js
  - showCurrentPageInHeader.js
-->
```

value type: an `array of strings` or a `single string`

context: includes and page fragments

required: no

It is used to declare one or more names of JavaScript files whose *modules* will be called synchronously by Trio. For more information see [JavaScript Callbacks](#javascript-callbacks).

#### tag

```html
<!--
tag:
  - javascript
  - html
  - css
-->
```

value type: an `array of strings` or a `single string`

context: blog article page fragments only

required: no

It is used to assign one or more tags to this blog article. See [blog] and [tag] for more information.

#### category

```html
<!--
category:
  - Web Development
  - Trio
-->
```

value type: an `array of strings` or a `single string`

context: blog article page fragments only

required: no

It is used to assign one or more categories to this blog article. See [blog] and [category] for more information.

#### forTag

```html
<!--
forTag: css
-->
```

value type: a `string`

context: blog tag page fragments only

required: no

It is used to identify the blog tag that this page fragment is associted with. See [blog] and [forTag] for more information.

#### forCategory

```html
<!--
forCategory:
  - web development
  - trio
-->
```

value type: an `array of strings` or a `single string`

context: blog category page fragments only

required: no

It is used to identify the blog categories that this page fragment is associted with. See [blog] and [forCategory] for more information.

### Excerpts

```html
<!--
.
.
.
-->
This is an excerpt.
<!-- end -->
This is the rest of the content.
```

You can explicitly declare a part of an include's or page fragment's content that directly follows front matter as an excerpt by using the separator `<-- end -->`.

## Page Fragments

Page fragments, often just called fragments, can be either markdown or HTML files and must always contain [YAML front matter](https://github.com/jonschlinkert/gray-matter). They optionally may also contain markdown or HTML content.

Page fragments must always declare in their front matter which [page template](#page-templates) they are associated with using the front matter `template` property.

Below is an example of a fragment with front matter and HTML content:

```html
<!--
template: default.html
appendToTarget: true
title: About
activeHeaderItem: 4
callback: showCurrentPageInHeader.js
-->
<div class="banner">
    <img data-trio-link class="banner__image" src="/media/mist-niagara-falls-river.jpg" alt="image of blog">
</div>

<section class="container">
    <h1 class="page-title">About</h1>
</section>
```
__--__ _source/fragments/about.html_

Below is an example of a fragment that only contains front matter:

```html
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

## Includes

Includes are either markdown files or HTML files whose markup is used as snippets, such as for site-wide headers and footers. Includes can also optionally contain YAML front matter.

Below is an example of an include file with YAML front matter whose content is used as a site-wide header:

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
__--__ _source/includes/header.html_

## Page Templates

Page templates, often just called templates, are HTML files whose markup define the overall structure of static web pages.

Below is an example of a template:

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
__--__ _source/templates/default.html_

## Metadata

Trio generates an extensive amount of  metadata while building your project's source folder. During the build process, for example, Trio accumulates data about each page fragment, including any front matter each may have. If the project includes a blog, Trio also generates numerous blog specific metadata. Much of this metadata is organized as lists, making them simple to iterate over in the [JavaScript callbacks](#javascript-callbacks).

Below is a list of the metadata items that Trio generates, including their key names and their descriptions:

### timestamp

```js
{
    timestamp: "2018-9-25 19:27:50"
}
```

The project's build date and time.

### userConfig

_* trio.json_
```js
{
    userConfig: {
        blogFolderName: "trioblog",
        baseUrl: "/trioiopages"
    }
}
```
    
The content of the prject's `trio.json` [configuration](#configuration) file.

### dataCatalog

_* source/data/author.json, source/data/fruits.json, source/data/vegies.json_
```js
{
    dataCatalog: {
        author: {
            name: "Janet Doe",
            birthday: "1978-01-14",
            email: "janetdoe@janetdoe.com",
            country: "United State",
            address: "1 East Drive Lane",
            city: "Manchester",
            state: "Newhamshire",
            zip: "00000"
        },
        fruits: ["apples", "pears", "grapes"],
        vegies: ["spinach", "zucchini", "peas"]
    }
}
```

A hash with one key/value pair for each .json file found in the the project's [source/data folder](#project-structure). The keys are the names of the individual files and the values are the file's content.


### frags

```js
{
    frags: [
        {
            path: "source/fragments/index.html",
            matter: {
                content: "<div class=\"banner\">\n    <img data-trio-link class=\"banner__image\" src=\"/media/triad.jpg\" alt=\"image of triad\">\n</div>\n\n<section class=\"container\">\n    <h1 class=\"page-title\">Everything you always wanted in a static site generator... but less.</h1>\n</section>",
                data: {
                    template: "source/templates/default.html",
                    appendToTarget: true,
                    title: "Welcome to Trio!",
                    activeHeaderItem: 1,
                    callback: "showCurrentPageInHeader.js"
                },
                isEmpty: false,
                excerpt: ""
            },
            id: 13,
            destPath: "public/index.html",
            url: "/"
        },
        .
        .
        .
    ]
}
```

A list with one item for each page fragment that isn't a blog article.

### articlesCount

```js
{
    articlesCount: 3
}
```

The total number of blog articles.

### articlesCatalog

```js
{
    articlesCatalog: [
        {
            path: "source/fragments/blog/articles/2018-08-02-unlockyourimagination.md",
            matter: {
                content: "<p>Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute.</p>\n<!-- end -->\n<p>Exercitation laborum tempor nulla consequat nisi minim consequat magna magna sint ut ut culpa. Id irure dolore veniam deserunt velit sint qui enim id occaecat ipsum. Magna sunt laboris quis ut mollit mollit laborum veniam mollit sunt reprehenderit laboris.</p>\n<p>Velit reprehenderit fugiat Lorem minim non duis exercitation ex. Occaecat consectetur duis duis consequat minim tempor occaecat cupidatat nostrud nulla aliqua. Velit deserunt nostrud cillum labore irure esse duis cupidatat dolor eiusmod. Occaecat quis veniam magna enim Lorem commodo esse ea esse. In quis id laborum dolore laborum magna ullamco. Culpa ex cillum deserunt enim culpa nulla anim elit duis.</p>\n",
                data: {
                    description: "blog article",
                    template: "source/templates/article.html",
                    appendToTarget: true,
                    title: "Unlock Your Imagination",
                    subtitle: "and liberate your mind",
                    image: "chain-key-lock.jpg",
                    activeHeaderItem: 3,
                    callback: [
                        "article.js",
                        "showCurrentPageInHeader.js"
                    ],
                    category: [
                        "web development"
                    ],
                    tag: [
                        "html"
                    ]
                },
                isEmpty: false,
                excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute.\n"
            },
            id: 5,
            destPath: "public/trioblog/Web Development/2018/08/02/unlockyourimagination/index.html",
            url: "/trioblog/Web Development/2018/08/02/unlockyourimagination/",
            articleDate: "2018-08-02",
            nextArticleUrl: "",
            previousArticleUrl: "/trioblog/Web Development/2018/08/01/skyisthelimit/",
            relatedArticlesByTag: [
                {
                    tag: "html",
                    related: [
                        {
                            date: "2018-08-01",
                            url: "/trioblog/Web Development/2018/08/01/skyisthelimit/",
                            title: "The Sky's The Limit",
                            id: 4,
                            excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute.\n"
                        },
                        {
                            date: "2018-07-14",
                            url: "/trioblog/Web Development/Trio/2018/07/14/thepowerofthree/",
                            title: "The Power of Three",
                            id: 3,
                            excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute.\n"
                        }
                    ]
                }
            ],
            relatedArticlesByTagFlattened: [
                {
                    date: "2018-08-01",
                    url: "/trioblog/Web Development/2018/08/01/skyisthelimit/",
                    title: "The Sky's The Limit",
                    id: 4,
                    excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute."
                },
                {
                    date: "2018-07-14",
                    url: "/trioblog/Web Development/Trio/2018/07/14/thepowerofthree/",
                    title: "The Power of Three",
                    id: 3,
                    excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute."
                }
            ],
            relatedArticlesByCategory: {
                category: "web development",
                related: [
                    {
                        date: "2018-08-01",
                        url: "/trioblog/Web Development/2018/08/01/skyisthelimit/",
                        title: "The Sky's The Limit",
                        id: 4,
                        excerpt: "Esse ea sint magna occaecat occaecat veniam. Dolore ex pariatur ullamco minim dolor laboris ipsum. Laboris cillum esse incididunt est est irure officia ipsum duis sit. Est voluptate eiusmod sit adipisicing aute.\n"
                    }
                ]
            }
        },
        .
        .
        .
    ]
}
```

A list whose items contain the metadata for each blog article related page fragment in descending date order.

### sortedTagCatalog

A list whose items contain the metadata for each blog tag in alphabetical order.

### catagoriesCatalog

A list whose items contain the metadata for  each blog category in alphabetical order.

## JavaScript Callbacks

After Trio merges the content of an include or a page fragment with the content of its associated template, Trio then calls one or more JavaScript callbacks if they are declared in the include's or page fragment's front matter with the `callback` property.

Each callback is passed a single object called a [context](#context-argargujment), which, in addition to the context's other properties, includes all the front matter declared in the include or page fragment file. This, along with the context's other properties, can be used to dynamically manipulate the content of your web pages.

Below is an example of a JavaScript callback used to customize a web page's navigation menu: 

```js
module.exports = ({$, frag}) => {
    $(`li.header__nav-item:nth-child(${frag.activeHeaderItem})`)
        .addClass("header__nav-item--active");
};
```
__--__ _source/callbacks/showCurrentPageInHeader.js_

In the callback example above, you might think that the `$` argument is a `jQuery` object, but it is not.

__!__ _There is absolutely no browser involved here, only streams of static markup text. So jQuery, which interacts with the browser, and not with streams of static markup text, would be totally useless._

The `$` argument is, in fact, a `cheerio` object that wraps the mashed up page.

__!__ _Instead of peppering your markup with templating language tags, such as those used with Liquid and Handlebars templates for instance, Trio uses [cheerio]( https://github.com/cheeriojs/cheerio), which is a jQuery-like JavaScript API based screen-scraper, along with front matter and synchronous JavaScript callbacks to dynamically manipulate the content of your web page._

### Context Argument

Trio passes a single object, called a `context`, to each callback:

```js
{
    $,
    frag,
    siteMetadata,
    cheerio
};
```

#### $

A `cheerio` object that wraps the mashed up page.

#### frag

An object that exposes all the `metadata` specific to the include or page fragment for which this callback was called, including all its front matter properties.



#### site

An object that exposes all the `metadata` for the entire site.

#### cheerio

A cheerio object that can be used to create new cheerio wrappers.

## data-trio Attributes

Trio recognizes numerous *data attributes* in HTML tags that begin with `data-trio-`. The presence of these attributes instruct Trio to take unique actions according to each specific data attribute.

Below is a complete list of these attributes along with their descriptions.

### data-trio-fragment

```html
<main data-trio-fragment></main>
```

This attribute is meant to be used in page tempates and instructs Trio to target this HTML tag when merging the page fragment content with this page template.

__!__ _data-trio-fragment can be omitted if the page template is designed to be used by page fragments that do not contribute content._

By default, Trio replaces the HTML tag with the content from the page fragment. To append the content to this HTML tag, declare `appendToTarget: true` in your page fragment front matter. For more information see [appendToTarget](#appendtotarget).

### data-trio-include

```html
<header data-trio-include="header.html"></header>
```

This attribute, which can be used in page fragments and page templates, instructs Trio to target this HTML tag when merging the specified include file's content.

By default, Trio replaces the HTML tag with the content from the include file. To append the content to this HTML tag, declare `appendToTarget: true` in your include file front matter. For more information see [appendToTarget](#appendtotarget).

### data-trio-link

```html
<link data-trio-link rel="stylesheet" href="/css/style.css">

<a data-trio-link href="/">

<a data-trio-link href="/about">

<img data-trio-link src="/media/mist-niagara-falls-river.jpg">
```

This attribute, which can be used in includes, page fragments and page templates, instructs Trio to prepend your production site's *base url* to this tag's `src` or `href` attribute's value when you run a *release build*. For more information see [release build]. You declare your site's base url in your project's `trio.json` configuration file. For more information see [configuration].

For example, if in your trio.json configuration file you declare `baseUrl` as follows:

```json
{
    "baseUrl": "/xyz",
}
```

then when you run a release build, Trio will generate the following:

```html
<link rel="stylesheet" href="/xyz/css/style.css">

<a href="/xyz">

<a href="/xyz/about">

<img src="/xyz/media/mist-niagara-falls-river.jpg">
```

## Blogging

Trio provides extensive support for blogging, including [ tags ], [ categories ] and numerous [ catalogs of metadata ] that are passed to [ JavaScript callbacks ](#javascript-callbacks) to use when customizing your blog pages.

## Project Structure

### root/

The root project folder for the Trio project.

### root/public/

The folder where the generated website is saved to and is recreated whenever Trio builds the project's source folder.

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

Contains extensive collections of metadata that is generated every time Trio builds the project.

## Configuration

## Command Line

## Community

## License/Copyright