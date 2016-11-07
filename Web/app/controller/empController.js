'use strict';

app.controller("empCtrl", function ($scope, $location, $http, eHRSettings) {
    var vm = this;
    var pageRangeSize = 5;

    //Variable declaration and initialization
    vm.DataSet = [];
    vm.PageSizes = [2, 5, 10, 20];
    vm.PageSize = vm.PageSizes[1];
    vm.PageCount = 0;
    vm.CurrentPage = 1;
    vm.PageRange = [];
    vm.ViewMode = 'no-data';
    

    //Data loading
    var buildUrl = function () {//todo:pagination, $top=1&$skip=1
        var top = vm.PageSize;
        var skip = vm.PageSize * (vm.CurrentPage - 1);
        var url = eHRSettings.baseUri
            + "Employee?$expand=Department&$inlinecount=allpages"
            + "&$top=" + top + "&$skip=" + skip;
        return url;
    }

    var loadData = function () {
        vm.ViewMode = 'data-loading';
        $http.get(buildUrl())
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
    loadData();


    //Page size 
    vm.OnPageSizeChange = function (size) {
        if (size == vm.PageSize) {
            return;
        } else if (vm.PageSizes.indexOf(size) > -1) {
            vm.PageSize = size;
            vm.CurrentPage = 1;
            loadData();
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
            loadData();
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
        loadData();
    };

    vm.LastPage = function () {
        vm.CurrentPage = vm.PageCount;
        loadData();
    };

    vm.IsCurrentPage = function (page) {
        return page == vm.CurrentPage;
    };

    //Filter
    vm.ApplyFilter = function () {
        if (event.key == "Enter") {
            vm.filterKeyword = vm.keyword;
            localStorage["filter"] = vm.keyword;
        }
    }

    var initilizeFilter = function () {
        if (!!localStorage && typeof localStorage["filter"] != "undefined") {
            vm.filterKeyword = vm.keyword = localStorage["filter"];
        }
    };
    initilizeFilter();

    console.log($scope);
});