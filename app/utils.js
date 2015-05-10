CATS.Utils = Classify({
    init: function () {
    },

    add_time: function (date, time) {
        var d = new Date();
        d.setTime(date.getTime() + time * 60 * 1000);
        return d;
    },

    get_time_diff: function (date1, date2) {
        return Math.floor((date2 - date1) / (1000 * 60));
    },

    zeroPad: function (num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    },

    minutes_to_formated_hours: function (min) {
        return Math.floor(min / 60) + ":" + this.zeroPad(min % 60, 2);
    },

    formated_hours_to_minutes: function (h) {
        var time = h.split(":");
        return time[0] * 60 + time[1] * 1;
    },

    proxy_get: function(url, callback) {
        $.get(CATS.Config.proxy_path + "proxy.pl?u=" + encodeURIComponent(url), callback);
    },

    json_get: function (url, callback) {
        $.ajax({
            // Avoid "not well-formed" error when loading JSON from local file.
            beforeSend: function(req) { req.overrideMimeType('application/json'); },
            url: url,
            dataType: 'json',
            success: callback
        });
    },

    jsonp_get: function (url, callback) {
        var parseJsonp = function (data) {
            return data;
        }
        $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'parseJsonp',
            success: callback
        });
    },
});

