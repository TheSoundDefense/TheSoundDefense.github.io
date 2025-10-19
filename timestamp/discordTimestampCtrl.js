var discordTimestampCtrl = function discordTimestampCtrl() {
    var self = this;

    var defaultDate = new Date();
    defaultDate.setSeconds(0);
    defaultDate.setMilliseconds(0);
    self.localtime = defaultDate;

    self.convert = function convert() {
        var timestampNoMillis = self.localtime.getTime() / 1000;
        self.timestampText = `<t:${timestampNoMillis}:f>`;
    };
};
