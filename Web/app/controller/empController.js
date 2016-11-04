'use strict';

app.controller("empCtrl", function ($scope, $location, $http, eHRSettings) {
    var vm = this;

    vm.DataSet = [];

    vm.viewMode = 'no-data';

    vm.loadData = function () {
        vm.viewMode = 'data-loading';
        var url = eHRSettings.baseUri + "Employee?$expand=Department";
        $http.get(url)
        .success(function (response) {
            if (response.value != undefined && response.value.length > 0) {
                vm.DataSet = response.value;
                vm.viewMode = 'data-loaded';
            }
        })
        .error(function () {
            vm.viewMode = 'no-data';
        });
    };

    vm.loadData();

    console.log($scope);
});