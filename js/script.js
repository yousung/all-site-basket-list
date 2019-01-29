$(document).ready(function() {
  $("body").on("click", "a", function(data) {
    chrome.tabs.create({ url: $(this).attr("href") });
    return false;
  });
});

function createList(basketList) {
  // $("#item-list>li").remove();
  basketList.forEach((item, idx) => {
    let liItem = `<a class="card" href="${item.url}">
    <img src="${item.image}" class="card-img-top" alt="${item.url}" />
    <div class="card-body">
      <p class="card-text">
        ${item.url}
      </p>
    </div>
  </a>`;
    $("#item-list").append(liItem);
  });
}

chrome.storage.sync.get(function(data) {
  var basket = [];

  if (data.allBasketList) {
    basket = data.allBasketList;
  }

  createList(basket);
  //컨텐트 페이지
  chrome.tabs.executeScript(
    {
      code: `(function(){
      return {
        fullUrl : location.href,
        image : document.querySelector('meta[property="og:image"]') ? document.querySelector('meta[property="og:image"]').getAttribute('content') : null,
      }
    })()`
    },
    function(data) {
      if (basket.length) {
      } else {
        basket.push({
          url: data[0].fullUrl,
          image: data[0].image
        });

        chrome.storage.sync.set({
          allBasketList: basket
        });
      }
    }
  );
});
