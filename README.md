# most-web-admin-demo

![MOST Web Framework Logo](https://www.themost.io/assets/images/most_logo_sw_240.png)

A [MOST Web Framework](https://github.com/kbarbounakis/most-web) OMS demo application based on [Admin LTE](https://github.com/almasaeed2010/AdminLTE) template.

### Installation

##### Clone git repository

    git clone https://github.com/kbarbounakis/most-web-admin-demo.git

##### Install dependencies

    cd most-web-admin-demo
    npm install

##### Install phantomjs (optional)

Note: This demo application uses [node-html-pdf](https://github.com/marcbachmann/node-html-pdf) for generating pdf files for invoices. This module has a dependency on [phantomjs](https://github.com/ariya/phantomjs)
You may need to install [phantomjs](https://github.com/ariya/phantomjs) first before use this feature.
If you want to test invoice printing install phantomjs globally

    npm install -g phantomjs-prebuilt

##### Install bower components

    cd app
    bower install

##### Run application

    npm start



