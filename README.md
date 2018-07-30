# Welcome to Trio
This isn't just la di da!

## FAQ

### What is Trio?
Trio is a static website generator.

### Why create Trio when there already is ...?
Because I don't believe for one minute that building a static website requires anything more than HTML, JavaScript and CSS. In my mind if a tool requires me to step outside of those 3 to build a static website, well then there is something wrong.

In that light Trio only requires you to use HTML, JavaScript and CSS. Trio also supports the use of front-matter in page fragments but even those are merely HTML comments and wont break your HTML formatting.

### Why doesn't Trio have more configuration options like other static website generators have?
Because trio employs the concept of convention over configuration wherever possible to reduce the need of having to configure its operations. Trio currently has less than a handful of configuration options and if I can further reduce that number I will do so gladly. 

### What conventions does Trio internalize?
1. All internal page links are permalinks. Name your web pages anything you like and Trio will use the names you give them to create folders with those names and in those folders Trio will create the web page named index.html.

1. Unlike other static website generators, Trio doesn't require you to learn a new template language just to customize your web pages. Instead, after Trio merges your page templates with your page fragments, it calls a JavaScript function that you name in your fragment's front-matter, passing it your mashed up page as a Cheerio object (see below), the fragment metadata and all site metadata collected when it analyzed your project's files. This provides the full power of JavaScript along with the static HTML markup scraping ability of Cheerio to customize your pages any way your imagination dictates.

1. Trio supports SASS out of the box and automatically generates CSS map files for development builds.

1. Trio prefixes your pages' "href=" and "src=" urls with a base url for release builds of your project easy by just adding the "data-trio-link" attribute to your HTML elements. When Trio parses your HTML pages during a release build and finds an HTML element with a data-trio-link attribute it will prefix the element's href/src attribute url with the baseUrl's value from your Trio config file (trio.json). 

### Is Trio ready for prime time?
Though Trio is still under active development, it is quite stable. Daily builds address breaking issues.

### I'm excited! How can I help?
Use Trio. File bugs. Propose enhancements. Most importantly, provide feedback.

### Where are the docs?
You're looking at it. It is my intention to make Trio so easy to use that the only documentation will be this FAQ.

### How do I install Trio?
Install Trio globally using npm: npm i -g @4awpawz/trio.

### How do I run Trio?
You interface with Trio via the terminal.

1. Create a new project: trio new path/to/new/project
1. Build a development version of your website: trio build
1. Launch your browser and watch your source folder for changes: trio watch
1. Build a release version of your website: trio release
1. Get help: trio help

### What's the difference between the two commands, trio build and trio release?
trio build is what you use while developing and testing your website locally. trio release is what you use when you are ready to actually roll out your website.

The trio release command, in addition to actually generating your website's pages, also prefixes "href=" and "src=" tag attributes with your production site's base url for every element that has a data-trio-link attribute. Release builds also strip out all data-trio-* attributes and HTML comments from your webpages' markup.;
