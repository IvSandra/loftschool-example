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
 <div class="friend" draggable="true" data-id={{id}}>
        <img src="{{photo_200}}">
        <div class="name">{{first_name}} {{last_name}}</div>
        <i class="fa fa-plus"></i>
</div>
{{/each}}
`;
var templateFn = Handlebars.compile(template);
var friends;
var saved = JSON.parse(localStorage.getItem("mykey"));

new Promise(resolve => window.onload = resolve)
     .then(() => vkInit())
    .then(() => vkApi('friends.get', {fields: 'photo_200'}))
    .then(response => {
        friends = response;
        listfriends.innerHTML = templateFn({items: friends.items.filter(item => !saved.includes(item.id))});
        selectedfriends.innerHTML = templateFn({items: friends.items.filter(item => saved.includes(item.id))})
    })
    .catch(e => alert('Ошибка: ' + e.message));

//Filter
filterInput1.addEventListener('keyup', function () {
    var listdata = friends.items
    .filter(item => item.first_name.includes(filterInput1.value) || item.last_name.includes(filterInput1.value))
    listfriends.innerHTML = templateFn({items: listdata});
});

filterInput2.addEventListener('keyup', function () {
    var filterfriends = friends.items.filter(item => saved.includes(item.id))
    var filterdata = filterfriends.filter(item => item.first_name.includes(filterInput2.value) || 
        item.last_name.includes(filterInput2.value))
    selectedfriends.innerHTML = templateFn({items: filterdata});
});

//Drag & Drop
listfriends.addEventListener('dragstart', function (event) {
    var data = event.target.dataset.id;
    event.dataTransfer.setData("text", data);
})

selectedfriends.addEventListener('dragover', function (event) {
    event.preventDefault();
})

selectedfriends.addEventListener('drop', function (event) {
    event.preventDefault();
    var drag = event.dataTransfer.getData("text");
    event.target.appendChild(document.querySelector(`[data-id="${drag}"]`));
    document.querySelector(`[data-id="${drag}"] i`).className = "fa fa-close";;   
})
//appendChild
listfriends.addEventListener('click', function(event) {
    if (event.target.getAttribute("class") == "fa fa-plus") {
    event.target.setAttribute("class", "fa fa-close");
    selectedfriends.appendChild(event.target.parentNode);
}

})

selectedfriends.addEventListener('click', function(event) {
    if (event.target.getAttribute("class") == "fa fa-close") {
    event.target.setAttribute("class", "fa fa-plus");
    listfriends.appendChild(event.target.parentNode);
}
})
//Save
    savebutton.addEventListener('click', function() {
    var selecteddata = [].map.call(selectedfriends.querySelectorAll('[data-id]'), 
        item => item.dataset.id)
    var serialdata = JSON.stringify(selecteddata);
    localStorage.setItem("mykey", serialdata);
})