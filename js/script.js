// UI Elements
const select = document.querySelector('#country');

select.addEventListener('change', e => {
    let currentCountry = e.target.value;
    newsService.showTopNews(currentCountry);
});

const newsService = (function () {
    const apiKey = '693f0002ef4e454992a422bf9829ca8b';
    const apiUrl = 'http://newsapi.org/v2';

    return {
        showTopNews(country = 'pl', cb) {
            let url = `${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`;

            customHttp().get(url, cb);
        },
        showSearchNews(search, cb) {
            let url = `${apiUrl}/everything?q=${search}&sortBy=popularity&apiKey=${apiKey}`;

            customHttp().get(url, cb);
        },
    }
})();


// Load news
function loadNews() {
    const initCountry = select.value;
    newsService.showTopNews(initCountry, onGetResponse);
}

// function getResponse
function onGetResponse(err, res) {
    renderNews(res.articles);
}

//function Render News
function renderNews(news) {
    news.forEach(item => {
        console.log(item.title);
    })
}


//  init selects
document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    loadNews();
});

// custom Http
function customHttp() {
    return {
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                xhr.addEventListener('load', () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error. Status code: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                });

                xhr.addEventListener('error', () => {
                    cb(`Error. Status code: ${xhr.status}`, xhr);
                });

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }

                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        },
    };
}

