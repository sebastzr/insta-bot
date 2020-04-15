const { ipcRenderer } = require('electron');
const fs = require('fs');

//buttons
const followBtn = document.getElementById('followBtn');
const unfollowBtn = document.getElementById('unfollowBtn');

//inputs
const username = document.getElementById('username');
const password = document.getElementById('password');

const followTarget = document.getElementById('followTarget');
const followAmount = document.getElementById('followAmount');

const unfollowAmount = document.getElementById('unfollowAmount');

const checkbox = document.getElementById('checkbox');

let userData = JSON.parse(fs.readFileSync('./resources/userData/data.json'));

//fill
username.value = userData.username;
password.value = userData.password;
followTarget.value = userData.followTarget;
followAmount.value = userData.followAmount;
unfollowAmount.value = userData.unfollowAmount;

let Data = {
    action: "",
    username: "",
    password: "",
    followTarget: "",
    amount: ""
};

function saveData() {
    if (checkbox.checked) {
        var newUserData = {
                "username": username.value,
                "password": password.value ,
            
                "followTarget": followTarget.value ,
                "followAmount": followAmount.value ,
            
                "unfollowAmount": unfollowAmount.value
            }
        fs.writeFile('./resources/userData/data.json', JSON.stringify(newUserData, null, 2), () => console.log('Saved user data.'));
    }
}

followBtn.addEventListener("click", () => {

    saveData();

    console.log("Running Follow");

    Data = {
        action: "follow",
        username: username.value,
        password: password.value,
        followTarget: followTarget.value,
        amount: followAmount.value    
    };
    ipcRenderer.send('request-mainprocess-action', Data);
});

unfollowBtn.addEventListener("click", () => {
    
    saveData();

    console.log("Running Unfollow");
    Data = {
        action: "unfollow",
        username: username.value,
        password: password.value,
        followTarget: username.value,
        amount: unfollowAmount.value    
    }
    ipcRenderer.send('request-mainprocess-action', Data);
});