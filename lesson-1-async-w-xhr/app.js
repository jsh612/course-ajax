(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;


        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function (err) {
            console.log('error', err);
        };
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 87f6af0e48b96fa00ecf0ab1b0c5f07cb2de10606deba9189b1a2ae3ea8dd3c5');
        unsplashRequest.send();
        
        //addImage 작성
        function addImage() {
            // debugger
            //하단 코드 작성전에 debugger 를 통해 수신되는 값 알아내기

            const data = JSON.parse(this.responseText);
            const firstImage = data.results[0];

            let htmlConent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;

            responseContainer.insertAdjacentHTML('afterbegin', htmlConent);
        }


        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=0Z14yF82dhkBNmCQIGCpGxMtFIl0fZ5C`);
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            console.log('error', err);
        };
        articleRequest.send();
        // 뉴욕타임즈는 별도의 header를 요구하지 않으므로 setRequestHeade 불필요


        function addArticles() {
            // debugger
            //하단 코드 작성전에 debugger 를 통해 수신되는 값 알아내기

            let htmlConent = '';
            const data = JSON.parse(this.responseText);
            console.log('data', data);
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                console.log(7777)
                htmlConent = '<ul>' + data.response.docs.map(article => `<li class="article">
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

