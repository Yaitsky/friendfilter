require('./index.css');

var friendFilterModule = function () {
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
    var saveButton = document.querySelector('#saveButton');


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

            correctArraysWithAdd(thisUserName, thisUserLastName);
            reloadArrays();
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

            correctArraysWithRemove(thisUserName, thisUserLastName);
            reloadArrays();
        }
    }

    function filterFullFriends() {
        var filterValue = filterFullList.value;
        var filteredFriendsArray = friendsArray.slice(0, friendsArray.length);

        filterArray(filteredFriendsArray, filterValue);

        if (filterValue == '') {
            friendsList.innerHTML = createFriendsList(friendsArray);
        } else {
            friendsList.innerHTML = createFriendsList(filteredFriendsArray);
        }
    }

    function filterFilteredFriends() {
        var filterValue = filterFilteredList.value;
        var filteredFriendsArray = newFriendsArray.slice(0, newFriendsArray.length);

        filterArray(filteredFriendsArray, filterValue);

        if (filterValue == '') {
            filteredList.innerHTML = createSecondList(newFriendsArray);
        } else {
            filteredList.innerHTML = createSecondList(filteredFriendsArray);
        }
    }

    function filterArray(filteredFriendsArray, filterValue) {
        for (var i = 0; i < filteredFriendsArray.length; i++) {
            if (!((isMatching(filteredFriendsArray[i].first_name, filterValue))
                || (isMatching(filteredFriendsArray[i].last_name, filterValue)))) {
                filteredFriendsArray.splice(i, 1);
                i--;
            }
        }
    }

    function saveFriends(e) {
        e.preventDefault();

        var friendsStorage = localStorage;
        var friendsArrayString = JSON.stringify(friendsArray);
        var newFriendsArrayString = JSON.stringify(newFriendsArray);

        friendsStorage.setItem("fullFriends", friendsArrayString);
        friendsStorage.setItem("newFriends", newFriendsArrayString);

        alert('Ваши списки друзей сохранены!');
    }

    function dragOverHandler(e) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        return false;
    }

    function dragStartAddHandler(e) {
        if (e.target.dataset.type !== 'friend-item') {
            return;
        }

        var thisItem = e.target;
        var thisUserBlockText = thisItem.querySelector('.friends__name').innerText;
        var userName = thisUserBlockText.split(" ")[0];
        var userLastName = thisUserBlockText.split(" ")[1];

        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('Text', 'add');
        e.dataTransfer.setData('userName', userName);
        e.dataTransfer.setData('userLastName', userLastName);
    }

    function dragStartRemoveHandler(e) {
        if (e.target.dataset.type !== 'friend-item') {
            return;
        }

        var thisItem = e.target;
        var thisUserBlockText = thisItem.querySelector('.friends__name').innerText;
        var userName = thisUserBlockText.split(" ")[0];
        var userLastName = thisUserBlockText.split(" ")[1];

        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('Text', 'remove');
        e.dataTransfer.setData('userName', userName);
        e.dataTransfer.setData('userLastName', userLastName);
    }

    function reloadArrays() {
        var filterFullValue = filterFullList.value;
        var filterFilteredValue = filterFilteredList.value;

        if (filterFullValue == '') {
            friendsList.innerHTML = createFriendsList(friendsArray);
        } else {
            var filteredFullFriendsArray = friendsArray.slice(0, friendsArray.length);

            for (var i = 0; i < filteredFullFriendsArray.length; i++) {
                if (!((isMatching(filteredFullFriendsArray[i].first_name, filterFullValue))
                    || (isMatching(filteredFullFriendsArray[i].last_name, filterFullValue)))) {
                    filteredFullFriendsArray.splice(i, 1);
                    i--;
                }
            }

            friendsList.innerHTML = createFriendsList(filteredFullFriendsArray);
        }

        if (filterFilteredValue == '') {
            filteredList.innerHTML = createSecondList(newFriendsArray);
        } else {
            var filteredSecondFriendsArray = newFriendsArray.slice(0, newFriendsArray.length);

            for (var i = 0; i < filteredSecondFriendsArray.length; i++) {
                if (!((isMatching(filteredSecondFriendsArray[i].first_name, filterFilteredValue))
                    || (isMatching(filteredSecondFriendsArray[i].last_name, filterFilteredValue)))) {
                    filteredSecondFriendsArray.splice(i, 1);
                    i--;
                }
            }

            filteredList.innerHTML = createSecondList(filteredSecondFriendsArray);
        }
    }

    function correctArraysWithAdd(thisUserName, thisUserLastName) {
        var friendIndex;

        for (var i = 0; i < friendsArray.length; i++) {
            if ((friendsArray[i].first_name == thisUserName)
                && (friendsArray[i].last_name) == thisUserLastName) {
                friendIndex = i;
                newFriendsArray.push(friendsArray[i]);

                break;
            }
        }

        friendsArray.splice(friendIndex, 1);
    }

    function correctArraysWithRemove(thisUserName, thisUserLastName) {
        var friendIndex;

        for (var i = 0; i < newFriendsArray.length; i++) {
            if ((newFriendsArray[i].first_name == thisUserName)
                && (newFriendsArray[i].last_name) == thisUserLastName) {
                friendIndex = i;
                friendsArray.push(newFriendsArray[i]);
                break;
            }
        }

        newFriendsArray.splice(friendIndex, 1);
        friendsArray.sort(compareNames);
    }

    function dropFilteredHandler(e) {
        if (e.stopPropagation) e.stopPropagation();

        if (e.dataTransfer.getData('Text') != 'add') {
            return;
        }

        var thisUserName = e.dataTransfer.getData('userName');
        var thisUserLastName = e.dataTransfer.getData('userLastName');

        correctArraysWithAdd(thisUserName, thisUserLastName);
        reloadArrays();
    }

    function dropFullHandler(e) {
        if (e.stopPropagation) e.stopPropagation();

        if (e.dataTransfer.getData('Text') != 'remove') {
            return;
        }

        var thisUserName = e.dataTransfer.getData('userName');
        var thisUserLastName = e.dataTransfer.getData('userLastName');

        correctArraysWithRemove(thisUserName, thisUserLastName);
        reloadArrays();
    }

    function loadFromStorage(result) {
        var storageFriendsArray = localStorage.getItem("fullFriends");
        var storageNewFriendsArray = localStorage.getItem("newFriends");

        if (!storageFriendsArray) {
            friendsArray = result.items.sort(compareNames);
            friendsList.innerHTML = createFriendsList(friendsArray);
        } else {
            friendsArray = JSON.parse(storageFriendsArray).slice(0, JSON.parse(storageFriendsArray).length);
            newFriendsArray = JSON.parse(storageNewFriendsArray).slice(0, JSON.parse(storageNewFriendsArray).length);

            friendsList.innerHTML = createFriendsList(friendsArray);
            filteredList.innerHTML = createSecondList(newFriendsArray);
        }
    }

    login()
        .then(function () {
            console.log('Hello');
            return callAPI('friends.get', {v: 5.62, fields: 'photo_100'})
        })
        .then(function (result) {
            // LOAD FROM LOCAL STORAGE
            loadFromStorage(result);

            // ADD-REMOVE FRIENDS
            friendsList.addEventListener('click', addFriend);
            filteredList.addEventListener('click', removeFriend);

            // FILTER FRIENDS
            filterFullList.addEventListener('keyup', filterFullFriends);
            filterFilteredList.addEventListener('keyup', filterFilteredFriends);

            // SAVE FRIENDS LISTS
            saveButton.addEventListener('click', saveFriends);

            // DRAG AND DROP - FRIEND LIST
            friendsList.addEventListener('dragstart', dragStartAddHandler);
            filteredList.addEventListener('dragover', dragOverHandler);
            filteredList.addEventListener('drop', dropFilteredHandler);

            // DRAG AND DROP - SECOND LIST
            filteredList.addEventListener('dragstart', dragStartRemoveHandler);
            friendsList.addEventListener('dragover', dragOverHandler);
            friendsList.addEventListener('drop', dropFullHandler);
        })
        .catch(function () {
            alert('Загрузка не удалась! Повторите попытку позже.')
        })
}

window.onload = friendFilterModule();