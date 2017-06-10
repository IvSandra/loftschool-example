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
    <div class="friend">
        <img src="{{photo_200}}">
        <div class="name">{{first_name}} {{last_name}}</div>
    </div>
{{/each}}
`;

var templateFn = Handlebars.compile(template);


new Promise(resolve => window.onload = resolve)
    .then(() => vkInit())
    .then(() => vkApi('friends.get', {fields: 'photo_200'}))
    .then(response => listfriends.innerHTML = templateFn(response))
    .catch(e => alert('Ошибка: ' + e.message));


var parsefriends = JSON.parse(response);    

filterInput1.addEventListener('keyup', function () {
    listfriends.innerHTML = parsefriends.filter(items => 
    first_name.includes(filterInput1.value) || last_name.includes(filterInput1.value))
    .join('');
})