/**
 * Created by arturmagalhaes on 20/08/14.
 */
define([
    'angular',
    './login'
], function (angular) {
    'use strict';

    // You can place operations that need to initialize prior to app start here
    // using the `run` function on the top-level module

    // as script is at the very bottom of the page no waiting for domReady
    angular.bootstrap(document, ['login']);
});