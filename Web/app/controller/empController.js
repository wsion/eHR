'use strict';

app.controller("empCtrl", function ($scope, $location, $http, eHRSettings) {
    var vm = this;

    vm.DataSet = [];
    vm.PageSizes = [2, 5, 10, 20];
    vm.PageSize = vm.PageSizes[0];
    vm.PageCount = 0;
    vm.CurrentPage = 1;
    vm.PageRange = [];
    vm.ViewMode = 'no-data';

    vm.loadData = function () {
        vm.viewMode = 'data-loading';
        var url = eHRSettings.baseUri + "Employee?$expand=Department&$inlinecount=allpages"; //todo:pagination, $top=1&$skip=1
        $http.get(url)
        .success(function (response) {
            if (response.value != undefined && response.value.length > 0) {
                vm.DataSet = response.value;
                vm.ViewMode = 'data-loaded';
                vm.PageCount = Math.round(response["odata.count"] / vm.PageSize);
                vm.CurrentPage = 1;
                vm.PageRange = new Array(vm.PageCount);
            }
        })
        .error(function () {
            vm.ViewMode = 'no-data';
        });
    };

    vm.loadData();

    vm.OnPageSizeChange = function (size) {
        if (vm.PageSizes.indexOf(size) > -1) {
            vm.PageSize = size;
        }
    };

    console.log($scope);
});