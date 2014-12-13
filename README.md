
Description
====

What is it? - It is a jQuery plugin to create interactive Instagram user tagging on your blog or website.

How can I use it? - Below there is a description about installing and using this plugin.

How can I get it? - There is a download link at the bottom of this page. Don't worry, it is easy to install and free to download.


Requirements:
====

    jQuery
    auth.php
    userinfo.php
    quicksmq.js
    quicksmq.css

Put the auth.php, userinfo.php and quicksmq.js files in the same folder. Link from your html file to the quicksmq.js and quicksmq.css files like this:

<link type="text/css" rel="stylesheet" href="quicksmq.css">

<script src="quicksmq.js"></script>

Install jQuery by linking from your html file to a CDN (Content Delivery Network), for example Google's like this:

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>

(see aditional information and instructions about installing jQuery at w3schools website.


Preparing Instagram profile
====

First you need an Instagram profile. If you don't have one, install the Instagram mobile app on your phone and sign up.

To be able to make queries you have to register a client here by clicking on the "Register a New Client" button. Give your application a name, a description and your website URL. Set the OAuth redirect_uri to the same as your website.

Once you have done with it your application will get a CLIEND ID. Open quicksmq.js, find the following lines:

/* YOUR CLIEND ID GOES HERE:*/

qsmq_setID("....");

Replace the dots with your application's CLIENT ID.


Usage
====

Create a span including the user's username and set the class attribute to qsmq-ins-user like this:

<span class="qsmq-ins-user">instagram-username</span>

Replace 'instagram-username' with the Instagram username you want (without @ sign).
