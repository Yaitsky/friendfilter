require('./index.css');

function login() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5902403
        });
        VK.Auth.login(function (result) {
            if (result.status === 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function callAPI(method, params) {
    return new Promise(function (resolve, reject) {
        VK.api(method, params, function (result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        })
    })
}

var friendsList = document.querySelector('#friendList');
var filteredList = document.querySelector('#filteredList');
var friendsArray = [];

function createFriendsList(friends) {
    var templateFn = require('../friend-template.hbs');

    return templateFn({
        friends: friends
    });
}

function createSecondList(friends) {
    var templateFn = require('../friend-second-template.hbs');

    return templateFn({
        friends: friends
    });
}

function compareNames(a, b) {
    if (a.first_name > b.first_name) return 1;
    if (a.first_name < b.first_name) return -1;

    return 0;
}

function addNewFriendAndRemove(i) {
    return function (e) {
        newArray.push(friendsArray[i]);
        filteredList.innerHTML = createSecondList(newArray);

        delete  friendsArray[i];
        friendsList.innerHTML = createFriendsList(friendsArray);
        console.log(i);
    }
}

login()
    .then(function () {
        console.log('Hello');
        return callAPI('friends.get', {v: 5.62, fields: 'photo_100'})
    })
    .then(function (result) {
        friendsArray = result.items.sort(compareNames);
        friendsList.innerHTML = createFriendsList(friendsArray);

        // var addFriendButton = friendsList.querySelectorAll('.plus-icon');
        // for (var i = 0; i < addFriendButton.length; i++) {
        //     addFriendButton[i].addEventListener('click', addNewFriendAndRemove(i));
        // }
    })