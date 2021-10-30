function extractValueFromPriceText(priceText) {
    return parseFloat(
        priceText
        .replace('R$', '')
        .replace('.', '')
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
            var shippingPriceElement = $(response).find(".ui-pdp-container__row--shipping-summary span.price-tag").first();

            if (typeof shippingPriceElement.html() != 'undefined') {
                var productPrice = extractValueFromPriceText(productPriceElement.find(".price-tag-amount").text());
                var shippingPrice = extractValueFromPriceText(shippingPriceElement.find(".price-tag-amount").text());

                var totalPrice = (productPrice + shippingPrice).toFixed(2);

                var totalPriceHtml = '<span class="price__fraction">' + Number(totalPrice).toLocaleString("pt-br", {minimumFractionDigits: 2});
                totalPriceHtml = totalPriceHtml.replace(',', '</span><span class="price-tag-cents" style="left:0">');
                totalPriceHtml = totalPriceHtml + '</span></span>';

                var shippingPriceHtml = shippingPriceElement.html().replace('<sup>', '<span class="price-tag-cents" style="left:0">');
                shippingPriceHtml = shippingPriceHtml.replace('</sup>', '</span>');

                productPriceElement.append('&plus;<span style="color:#3483fa !important;">' + shippingPriceHtml + '</span>&equals;<span style="color:#3483fa !important; font-weight: bolder !important;">' + totalPriceHtml + "</span>");
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