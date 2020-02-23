// UI Elements
const select = document.querySelector('#country');

//Elemetns
const form = document.forms['newsControls'];
const searchInput = form.elements['search'];

//Event Listeners
select.addEventListener('change', e => {
    let currentCountry = e.target.value;
    newsService.showTopNews(currentCountry, onGetResponse);
});

form.addEventListener('submit', e => {
    e.preventDefault();
    let searchWord = searchInput.value;
    newsService.showSearchNews(searchWord, onGetResponse);
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
    const searchWord = searchInput.value;

    if (!searchWord) {
        newsService.showTopNews(initCountry, onGetResponse);
    } else {
        newsService.showSearchNews(searchWord, onGetResponse);
    }

}

// function getResponse
function onGetResponse(err, res) {
    if (err) {
        showAlert(err, 'error-msg');
        return;
    }
    if (!res.articles.length) {
        showAlert('No elements to show', 'no-article-msg');
        return;
    }
    renderNews(res.articles);
}

//function Render News
function renderNews(news) {
    const container = document.querySelector('.news-container .row');
    if (container.children.length) {
        clearContainer(container);
    }
    searchInput.value = '';
    let fragment = '';

    news.forEach(item => {
        const elem = itemTemplate(item);
        fragment += elem;
    });

    container.insertAdjacentHTML('afterbegin', fragment);
}

//function clearContainer
function clearContainer(container) {
    let child = container.lastElementChild;

    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}

//function showPreloader
function showPreloader() {
    document.body.insertAdjacentHTML('afterbegin', `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>`)
}

//function stopPreloader

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

//function showAlert
function showAlert(msg, type = 'successs') {
    M.toast({html: msg, classes: type});
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

