'use strict';

var app = angular.module("eHR", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
        template: "<div class='text-center'>welcome</div>"
    })
    .when("/employee", {
        templateUrl: "/app/views/emp/list.html"
    })
    .when("/department", {
        templateUrl: "/app/views/dept/list.html"
    })
    .otherwise({
        template: "404 error"
    });
});

app.constant("eHRSettings", {
    baseUri: "http://localhost:5141/odata/"
});
