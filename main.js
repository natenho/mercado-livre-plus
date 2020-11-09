function extractValueFromPriceText(priceText) {
    return eval(
        priceText
        .replace('R$', '')
        .replace(',', '.'));
}

function extractValueFromShippingPrice(htmlElement) {
    var html = htmlElement.html().replace(/<sup>/g, '<sup>.');
    var priceText = $($.parseHTML(html)).text();

    return extractValueFromPriceText(priceText);
}

$(".ui-search-layout__item").each(function () {

    var link = $(this).find("a").first();

    var mainTitleDiv = $(this).find(".ui-search-item__title").first();
    var findResult = $(this).find(".item__price");

    if (findResult.length == 0) {
        findResult = $(this).find("span.price-tag");
    }

    var productPriceElement = findResult.first();

    chrome.runtime.sendMessage(
        { contentScriptQuery: "fetchShipping", url: link.attr('href') },
        response => {

            var title = $(response).find(".ui-pdp-title").first();
            var shippingPriceElement = $(response).find(".ui-pdp-container__row--shipping-summary span.price-tag").first();

            if (typeof shippingPriceElement.html() != 'undefined') {
                var productPrice = extractValueFromPriceText(productPriceElement.text());
                var shippingPrice = extractValueFromShippingPrice(shippingPriceElement);

                var totalPrice = (productPrice + shippingPrice).toFixed(2);

                var totalPriceHtml = '<span class="price__fraction">' + totalPrice;
                totalPriceHtml = totalPriceHtml.replace('.', '</span><span class="price-tag-cents" style="left:0">');
                totalPriceHtml = totalPriceHtml + '</span>';

                var shippingPriceHtml = shippingPriceElement.html().replace('<sup>', '<span class="price-tag-cents" style="left:0">');
                shippingPriceHtml = shippingPriceHtml.replace('</sup>', '</span>');

                productPriceElement.append('+' + shippingPriceHtml + '= ' + totalPriceHtml);
            }
                        
            var shippingDetailElement = $(response).find(".ui-pdp-container__row--shipping-summary .ui-pdp-media__title");
            var shippingEstimated = shippingDetailElement.text();

            if (typeof shippingEstimated != 'undefined') {
                shippingEstimated = shippingEstimated.replace('Chegará entre os dias ', 'Chegará entre ');
                shippingEstimated = shippingEstimated.replace('\.', '');
                shippingEstimated = shippingEstimated.replace(/ por.*/g, '');

                mainTitleDiv.parent().append('<span style="font-size: 14px; font-weight:bold; color: #00a650;">' + shippingEstimated + '</span>');
            }
            else
            {
                console.log('Erro analisando shippingEstimated em ' + location.href);                
            }
        }
    );
});