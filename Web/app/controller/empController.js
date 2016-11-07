'use strict';

app.controller("empCtrl", function ($scope, $location, $http, eHRSettings) {
    var vm = this;
    var pageRangeSize = 5;

    //Variable declaration and initialization
    vm.DataSet = [];
    vm.PageSizes = [2, 5, 10, 20];
    vm.PageSize = vm.PageSizes[0];
    vm.PageCount = 0;
    vm.CurrentPage = 1;
    vm.PageRange = [];
    vm.ViewMode = 'no-data';


    //Data loading
    vm.loadData = function () {
        vm.ViewMode = 'data-loading';
        var url = eHRSettings.baseUri + "Employee?$expand=Department&$inlinecount=allpages"; //todo:pagination, $top=1&$skip=1
        $http.get(url)
        .success(function (response) {
            if (response.value != undefined && response.value.length > 0) {
                vm.DataSet = response.value;
                vm.ViewMode = 'data-loaded';
                vm.PageCount = Math.round(response["odata.count"] / vm.PageSize);
                if (response["odata.count"] == 0) {
                    vm.ViewMode = 'no-data';
                    return;
                }
                initializePage(vm.PageCount);
            }
        })
        .error(function () {
            vm.ViewMode = 'no-data';
        });
    };
    vm.loadData();


    //Page size 
    vm.OnPageSizeChange = function (size) {
        if (vm.PageSizes.indexOf(size) > -1) {
            vm.PageSize = size;
            vm.loadData();
        }
    };

    vm.IsActivePageSize = function (size) {
        return size == vm.PageSize;
    };


    //Pagination
    var initializePage = function (pageCount) {
        var firstPage = 1,
            lastPage = 0,
            criticalRange = Math.floor(pageRangeSize / 2);

        if (vm.CurrentPage > pageCount) {
            vm.CurrentPage = 1;
        }

        if (pageCount <= pageRangeSize) {
            firstPage = 1;
            lastPage = pageCount;
        } else if (vm.CurrentPage <= criticalRange) {
            firstPage = 1;
            lastPage = pageRangeSize;
        } else if (vm.CurrentPage > (pageCount - criticalRange)) {
            firstPage = pageCount + 1 - pageRangeSize;
            lastPage = pageCount;
        } else {
            firstPage = vm.CurrentPage - criticalRange;
            lastPage = vm.CurrentPage + criticalRange;
        }

        vm.PageRange = [];
        for (var i = firstPage; i <= lastPage; i++) {
            vm.PageRange.push(i);
        }
    };

    vm.PrevDisabled = function () {
        return vm.CurrentPage == 1;
    };

    vm.NextDisabled = function () {
        return vm.CurrentPage == vm.PageCount;
    };

    vm.OnPageChange = function (page) {
        if (vm.CurrentPage == page) {
            return;
        } else {
            vm.CurrentPage = page;
            vm.loadData();
        }
    };

    vm.PrevPage = function () {
        if (vm.PrevDisabled()) {
            return;
        } else {
            vm.OnPageChange(vm.CurrentPage - 1);
        }
    };

    vm.NextPage = function () {
        if (vm.NextDisabled()) {
            return;
        } else {
            vm.OnPageChange(vm.CurrentPage + 1);
        }
    };

    vm.FirstPage = function () {
        vm.CurrentPage = 1;
        vm.loadData();
    };

    vm.LastPage = function () {
        vm.CurrentPage = vm.PageCount;
        vm.loadData();
    };

    vm.IsCurrentPage = function (page) {
        return page == vm.CurrentPage;
    };

    console.log($scope);
});