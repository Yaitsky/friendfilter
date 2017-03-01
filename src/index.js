require('./index.css');

function login() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5267932
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}

function createFriendsDiv(friends) {
    var templateFn = require('../friend-template.hbs');

    return templateFn({
        friends: friends
    });
}

var friendsList = document.querySelector('#friends');
var loadFriends = document.querySelector('#loadFriends');

loadFriends.addEventListener('click', () => {
    login()
        .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
        .then(result => friendsList.innerHTML = createFriendsDiv(result.items))
        .then(() => loadFriends.parentNode.removeChild(loadFriends))
        .catch(() => alert('всё плохо'));
});
