'use strict';

app.controller("empAddCtrl", function ($scope, $location, $http, eHRSettings) {
    var vm = this;
    vm.departments = [];


    //Initilization
    var initialize = function () {
        var url = eHRSettings.baseUri + "Department";
        $http.get(url)
        .success(function (response) {
            if (response.value != undefined && response.value.length > 0) {
                vm.departments = response.value;
            }
        });
    };
    initialize();


    //Events
    vm.OnSubmit = function () {
        var url = eHRSettings.baseUri + "Employee";
        var data = {
            Name: vm.Name,
            Phone: vm.Phone,
            Sex: vm.Gender,
            BirthDate: vm.BirthDate,
            DepartmentID: vm.DepartmentID,
            Note: vm.Note
        };
        $http.post(url, data)
        .success(function (response) {
            $location.path("/employee");
            console.warn("Addition success");
        })
        .error(function () {
            console.warn("Addition failure");
        });
    };
});