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

function geocode(adress) {
    return ymaps.geocode(adress).then(result => {
        var points = result.geoObjects.toArray();

        if (points.length) {
            return points[0].geometry.getCoordinates();
        }

    });
}


var myMap;
var clusterer;
var names;
var photos;
var customItemContentLayout;

new Promise(resolve => window.onload = resolve)
    .then(() => vkInit())
    .then(response => new Promise(resolve => ymaps.ready(resolve)))
    .then(() => vkApi('friends.get', {fields: 'photo_200, city, country'}))
    .then(friends => {
        myMap = new ymaps.Map('map', {
        center: [59.94, 30.19], // Санкт-Петербург
        zoom: 5
    }, {
        searchControlProvider: 'yandex#search'
    });

    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h2 class=ballon_header>{{ properties.balloonContentHeader }}</h2>' +
        '<div class=ballon_body><img src="{{ properties.balloonContentBody }}"></div>' 
    );
    
        clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 350,
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonLeftColumnWidth: 120
    });

    myMap.geoObjects.add(clusterer);

    return friends.items;
})

    .then(friends => {

       names = friends
       .filter(friend => friend.country || friend.city)   
       .map(friend => friend.first_name + ' ' + friend.last_name)

       photos = friends
       .filter(friend => friend.country || friend.city)   
       .map(friend => friend.photo_200)

       var promises = friends
        .filter(friend => friend.country && friend.country.title)   
        .map(friend => {
            var parts = friend.country.title;
            if (friend.city) {
                parts += ' ' + friend.city.title;
            }
            return parts;
        })
        .map(string => geocode(string))

       
    return Promise.all(promises);
})    

    .then(coords => {
        console.log(coords);
    var placemarks = [];    
    for (var i = 0; i < coords.length; i++) {
    var placemark = new ymaps.Placemark(coords[i], {
            // Устаналиваем данные, которые будут отображаться в балуне.
            balloonContentHeader: getContentHeader(i),
            balloonContentBody: getContentBody(i)
        }, {

            balloonContentLayout: customItemContentLayout    

        });
        placemarks.push(placemark);
    }
        clusterer.add(placemarks);
}) 

    
.catch(e => alert('Ошибка: ' + e.message));

 function getContentHeader (num) {
       
    var  placemarkHeader = names;
    return placemarkHeader[num % placemarkHeader.length];
}
 function getContentBody (num) {
       
    var  placemarkBodies = photos;
    return placemarkBodies[num % placemarkBodies.length];
}

   
     
   

