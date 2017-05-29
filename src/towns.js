/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */

function loadTowns() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', function () {
            var result = xhr.response;
            var cities = result.sort(function (a, b) {
                if (a.name > b.name) {

                    return 1;
                }
                if (a.name < b.name) {

                    return -1;
                }

                return 0;
            });

            resolve(cities);
        });
    });
}

    /**
     * Функция должна проверять встречается ли подстрока chunk в строке full
     * Проверка должна происходить без учета регистра символов
     *
     * @example
     * isMatching('Moscow', 'moscow') // true
     * isMatching('Moscow', 'mosc') // true
     * isMatching('Moscow', 'cow') // true
     * isMatching('Moscow', 'SCO') // true
     * isMatching('Moscow', 'Moscov') // false
     *
     * @return {boolean}
     */
    function isMatching(full, chunk) {
        var lowerchunk = chunk.toLowerCase();
        var lowerfull = full.toLowerCase();
        var pos = lowerfull.indexOf(lowerchunk);
        if (pos > -1) {

            return true;
        }
        return false;
    }

    var loadingBlock = homeworkContainer.querySelector('#loading-block');
    var filterBlock = homeworkContainer.querySelector('#filter-block');
    var filterInput = homeworkContainer.querySelector('#filter-input');
    var filterResult = homeworkContainer.querySelector('#filter-result');
    var townsPromise;

    var arr = [];

    loadTowns('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
    .then(function (cities) {
        arr = cities;

        loadingBlock.style.display = 'none';
        filterBlock.style.display = 'block';
    });

    filterInput.addEventListener('keyup', function () {
        filterResult.innerHTML = filterInput.value ? arr.filter(function (item) {

            return isMatching(item.name, filterInput.value);
        }).map(function (item) {

            return '<div>' + item.name + '</div>';
        }).join('') : '';
    });


export {
    loadTowns,
    isMatching
};
