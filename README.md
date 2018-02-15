# Thumbnail generator microservice

[![travis build](https://travis-ci.org/anu-007/nodejs_microservice.svg?branch=master)](https://travis-ci.org/anu-007/nodejs_microservice)

docker image - [image](https://hub.docker.com/r/poxito/initialdoc/)

demo app url - [app](https://evening-brook-66750.herokuapp.com/)

A simple thumbnail generator microservice which generates thumbnails of size 50x50. It uses jwt authorization for its protected routes.

# Installation

## Prerequisites
* [git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM v5.3.x)

## Installation
* `git clone <repository-url>` this repo
* `cd nodejs_microservice`
* `npm install`

## Running
* `npm start`
* test with postman for the following end-points
* Visit app at [http://localhost:4000.](http://localhost:4000)

## Running tests
* `npm test`

## Running coverage
* `npm run coverage`

# API endpoints
use any API testing tools like postman to test this API. App is hosted at https://evening-brook-66750.herokuapp.com if you are not testing on localhost mahe sure to append this url before the API requests.

GET  `/`
1. Request
    * Headers
        `content-Type: application/json`
2. Response
    * Headers
        `content-Type: application/json; charset=utf-8`
    * Body
    ```
    {
        "message": "welcome to the microservice: go to /login route and enter username and password"
    }
    ```
POST `/login`
1. Request
    * Headers
        `content-Type: application/json`
    * Body
    ```
    {
	    "user"	:	<any-usernaem>,
	    "password"	:	<any-password>
    }
    ```
2. Response
    * Headers
        `content-Type: application/json; charset=utf-8`
    * Body
    ```
    {
        "token": <jwt-token>
    }
    ```
POST `/ptch`
1. Request
    * Headers
        `content-Type: application/json`
        `Authorization: bearer <access-token>`
    * Body
    ```
    {
        <any-key>: <any-value>
    }
    ```
2. Response
    * Headers
        `content-Type: application/json; charset=utf-8`
    * Body
    ```
    {
        <patched-keys>: <patched-values>
    }
    ```
POST `/thumb`
1. Request
    * Headers
        `content-Type: application/json`
        `Authorization: bearer <access-token>`
    * Body
    ```
    {
        "url": <any-image-url>
    }
    ```
1. Response
    * Headers
        `content-Type: image/<type-of-image>`
    * Body
        `<image>`