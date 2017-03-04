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
var newFriendsArray = [];
var filterFilteredList = document.querySelector('#filterFilteredList');
var filterFullList = document.querySelector('#filterFullList');


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

function isMatching(full, chunk) {
    var string = full.toLowerCase(),
        substring = chunk.toLowerCase();

    if (string.indexOf(substring) + 1) {
        return true;
    }

    return false;
}


function compareNames(a, b) {
    if (a.first_name > b.first_name) return 1;
    if (a.first_name < b.first_name) return -1;

    return 0;
}

function addFriend(e) {
    if (e.target.dataset.type !== 'add-button') {
        return;
    } else {
        var thisButton = e.target;
        var thisUserBlockText = thisButton.parentNode
            .previousElementSibling.querySelector('.friends__name').innerText;
        var thisUserArray = thisUserBlockText.split(" ");
        var thisUserName = thisUserArray[0];
        var thisUserLastName = thisUserArray[1];
        var friendIndex;

        for (var i = 0; i < friendsArray.length; i++) {
            if ((friendsArray[i].first_name == thisUserName)
                && (friendsArray[i].last_name) == thisUserLastName) {
                friendIndex = i;
                newFriendsArray.push(friendsArray[i]);
            }
        }

        friendsArray.splice(friendIndex, 1);
        friendsList.innerHTML = createFriendsList(friendsArray);
        filteredList.innerHTML = createSecondList(newFriendsArray);
    }
}

function removeFriend(e) {
    if (e.target.dataset.type !== 'remove-button') {
        return;
    } else {
        var thisButton = e.target;
        var thisUserBlockText = thisButton.parentNode
            .previousElementSibling.querySelector('.friends__name').innerText;
        var thisUserArray = thisUserBlockText.split(" ");
        var thisUserName = thisUserArray[0];
        var thisUserLastName = thisUserArray[1];
        var friendIndex;

        for (var i = 0; i < newFriendsArray.length; i++) {
            if ((newFriendsArray[i].first_name == thisUserName)
                && (newFriendsArray[i].last_name) == thisUserLastName) {
                friendIndex = i;
                friendsArray.push(newFriendsArray[i]);
            }
        }

        newFriendsArray.splice(friendIndex, 1);
        friendsArray.sort(compareNames);
        friendsList.innerHTML = createFriendsList(friendsArray);
        filteredList.innerHTML = createSecondList(newFriendsArray);
    }
}

function filterFullFriends() {
    var filterValue = filterFullList.value;
    var filteredFriendsArray = friendsArray.slice(0, friendsArray.length);

    for (var i = 0; i < filteredFriendsArray.length; i++) {
        if (!((isMatching(filteredFriendsArray[i].first_name, filterValue))
            || (isMatching(filteredFriendsArray[i].last_name, filterValue)))) {
            filteredFriendsArray.splice(i, 1);
            i--;
        }
    }

    if (filterValue == '') {
        friendsList.innerHTML = createFriendsList(friendsArray);
    } else {
        friendsList.innerHTML = createFriendsList(filteredFriendsArray);
    }
}

function filterFilteredFriends() {
    var filterValue = filterFilteredList.value;
    var filteredFriendsArray = newFriendsArray.slice(0, newFriendsArray.length);

    for (var i = 0; i < filteredFriendsArray.length; i++) {
        if (!((isMatching(filteredFriendsArray[i].first_name, filterValue))
            || (isMatching(filteredFriendsArray[i].last_name, filterValue)))) {
            filteredFriendsArray.splice(i, 1);
            i--;
        }
    }

    if (filterValue == '') {
        filteredList.innerHTML = createSecondList(newFriendsArray);
    } else {
        filteredList.innerHTML = createSecondList(filteredFriendsArray);
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

        friendsList.addEventListener('click', addFriend);
        filteredList.addEventListener('click', removeFriend);

        filterFullList.addEventListener('keyup', filterFullFriends);
        filterFilteredList.addEventListener('keyup', filterFilteredFriends);
    })