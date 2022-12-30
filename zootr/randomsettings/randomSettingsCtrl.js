var randomSettingsCtrl = function randomSettingsCtrl($http) {
    let self = this;

    self.allSettings = {};

    $http.get('settings_list.json').then(function(response) {
        self.allSettings = response.data;
    });
}