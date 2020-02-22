// UI Elements
const select = document.querySelector('#country');

select.addEventListener('change', e => {
    let currentCountry = e.target.value;
    newsService.showTopNews(currentCountry, onGetResponse);
});

const newsService = (function () {
    const apiKey = '693f0002ef4e454992a422bf9829ca8b';
    const apiUrl = 'http://newsapi.org/v2';

    return {
        showTopNews(country = 'pl', cb) {
            let url = `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`;

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
    const container = document.querySelector('.news-container .row');
    let fragment;

    news.forEach(item => {
        const elem = itemTemplate(item);
        fragment += elem;
    });

    let modifiedFragment = fragment.slice(10);

    container.insertAdjacentHTML('afterbegin', modifiedFragment);

}

// News item template function
function itemTemplate({urlToImage, title, url, description}) {

    return `
    <div class="col s12">
    <div class="card">
       <div class="card-image">
       <img src="${urlToImage}" alt="">
       <span class="card-title">${title || ''}</span>
    </div>
    <div class="card-content">
        <p>${description || ''}</p>
    </div>
    <div class="card-action">
        <a href="${url}">Read more</a>
    </div>
    </div>
    </div>
    `
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

