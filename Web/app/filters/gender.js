app.filter("gender", function () {
    return function (sourceVal) {
        if (sourceVal === undefined) {
            return "";
        } else {
            return sourceVal ? 'Male' : 'Female';
        }
    };
})