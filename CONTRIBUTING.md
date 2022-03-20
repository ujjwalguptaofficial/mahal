# Contributing

From opening a bug report to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the api - please create an issue first. This way we can ensure that your precious work is not in vain.

Thing that should not be change - 

1. package.json
2. ignore files like - gitignore, npmignore
3. .github config
4. license
5. webpack config
6. tsconfig
7. tslint 

These are the files which contains some config & makes the jsstore bug free thats why we dont want user to change as thing may become messy. But we understand that sometimes you need to change these things, so in that case please give a description files name with reason of why you need to change in the pull request.

## Issues

Feel free to create any issues. We love to answer and solve problems.

## Discussions

Use github discussions to discuss anything related. Asking questions on how to do, to showcasing what you have built.

## Documentation

If you find some mistakes ( anything like spelling or design etc.) or want to improve the docs. Please feel free to send the PR. 

Our documentation is on another repo - https://github.com/ujjwalguptaofficial/mahal-docs.

## Learning Contribution

Learning can be promoted by many ways like - 

* An article
* Examples
* Tutorial - text or video
* jsfiddle, codeplunk etc. demo

if you have anything that helps users learn mahal and you want them to list on our board. Feel free to link those in our get_started page.

## Setup

Setting up mahal in your local is very easy - 

* Just fork and clone or just clone
* Run `npm ci` - this will install all dependencies
* There are multiple commands that you can see in package.json.

#### Commands

* lint - Run linter for every codes
* test:dev - Test the development code
* test:prod - Test the production code
* build:dev - Build the code for development
* build:prod - Build the code for production
* build:ci - Build the code that needed by CI
* webpack:dev - run the webpack config for dev
* webpack:prod - run the webpack config for prod
* deploy - This one create both dev and prod code and also test both codes. This is used when some new version is to be deployed.   

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* Follow the existing coding style
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
