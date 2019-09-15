/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID 87f6af0e48b96fa00ecf0ab1b0c5f07cb2de10606deba9189b1a2ae3ea8dd3c5',
            }
        }).done(addImage)
        .fail(function (err) {
            console.log(err);
        });

        function addImage(imgs) {
            // 하단 코드 작성전에 debugger 를 통해 수신되는 값 알아내기
            console.log('this', this);
            //제비쿼리는 자동으로 JSON 데이터를 parsing 해주므로 JSON.parse() 불필요
            const firstImage = imgs.results[0];
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

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0Z14yF82dhkBNmCQIGCpGxMtFIl0fZ5C`,
        }).done(addArticles)
        .fail(function (err) {
            console.log(err);
        });

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
