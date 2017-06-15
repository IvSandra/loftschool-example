require('./main.css');

function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.64';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6066640
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

var template = `
{{#each items}}
    <div class="friend" draggable="true">
        <img src="{{photo_200}}">
        <div class="name">{{first_name}} {{last_name}}</div>
    </div>
{{/each}}
`;

var templateFn = Handlebars.compile(template);
var friends;

new Promise(resolve => window.onload = resolve)
    .then(() => vkInit())
    .then(() => vkApi('friends.get', {fields: 'photo_200'}))
    .then(response => {
        friends = response;
        listfriends.innerHTML = templateFn(friends);
    })
    .catch(e => alert('Ошибка: ' + e.message));


filterInput1.addEventListener('keyup', function () {
    const data = friends.items
    .filter(item => item.first_name.includes(filterInput1.value) || item.last_name.includes(filterInput1.value))
    listfriends.innerHTML = templateFn({items: data});
});


listfriends.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData("text", event.target.className);
})

listfriends.addEventListener('dragover', function (event) {
    event.preventDefault();
})

selectedfriends.addEventListener('drop', function (event) {
    event.preventDefault();
    var drag = event.dataTransfer.getData("text");
    event.target.appendChild(listfriends.getElementsByClassName(drag));
})
