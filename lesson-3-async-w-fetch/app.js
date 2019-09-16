(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 87f6af0e48b96fa00ecf0ab1b0c5f07cb2de10606deba9189b1a2ae3ea8dd3c5',
            }
        }).then(function (response) {
            return response.json();
        }).then(addImage)
        .catch((error)=> requestError(error, 'image'));

        function addImage(data) {
            const firstImage = data.results[0];
            let htmlConent;

            if (firstImage) {
                htmlConent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlConent = `<div class="error-no-articles">No "${searchedForText}" Image available</div>`;
            }

            responseContainer.insertAdjacentHTML('afterbegin', htmlConent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }

        
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0Z14yF82dhkBNmCQIGCpGxMtFIl0fZ5C`)
            .then(response => response.json())
            .then(addArticles)
            .catch(err => requestError(err, 'articles'));

        function addArticles(articles) {
            // debugger
            //하단 코드 작성전에 debugger 를 통해 수신되는 값 알아내기

            let htmlConent = '';
            console.log('data', articles);
            if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
                console.log('뉴스 수신 완료');
                htmlConent = '<ul>' + articles.response.docs.map(article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`
                ).join('') + '</ul>';
            } else {
                htmlConent = `<div class="error-no-articles">No articles available</div>`;
            }

            responseContainer.insertAdjacentHTML('beforeend', htmlConent);
        }



    });
})();
