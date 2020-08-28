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
        findResult = $(this).find(".price-tag");
    }

    var productPriceElement = findResult.first();

    chrome.runtime.sendMessage(
        { contentScriptQuery: "fetchShipping", url: link.attr('href') },
        response => {

            var shippingPriceElement = $(response).find(".shipping-method-title .ch-price").first();

            if (typeof shippingPriceElement.html() != 'undefined') {
                var productPrice = extractValueFromPriceText(productPriceElement.text());
                var shippingPrice = extractValueFromShippingPrice(shippingPriceElement);

                var totalPrice = (productPrice + shippingPrice).toFixed(2);

                var totalPriceHtml = '<span class="price__fraction">' + totalPrice;
                totalPriceHtml = totalPriceHtml.replace('.', '</span><span class="price-tag-cents" style="left:0">');
                totalPriceHtml = totalPriceHtml + '</span>';

                var shippingPriceHtml = shippingPriceElement.html().replace('<sup>', '<span class="price-tag-cents" style="left:0">');
                shippingPriceHtml = shippingPriceHtml.replace('</sup>', '</span>');
                shippingPriceHtml = shippingPriceHtml.replace(' ', '&nbsp;');

                productPriceElement.append('+' + shippingPriceHtml + '= ' + totalPriceHtml);
            }

            var shippingDetailElement = $(response).find(".shipping-method-title").parent().parent();
            var shippingEstimated = shippingDetailElement.find(".subtitle").html();

            if (typeof shippingEstimated != 'undefined') {
                shippingEstimated = shippingEstimated.replace('Chegará entre os dias ', 'Chegará entre ');
                shippingEstimated = shippingEstimated.replace('\.', '');

                mainTitleDiv.parent().append('<span style="font-size: 14px; font-weight:bold; color: #00a650;">' + shippingEstimated + '</span>');
            }
            else
            {
                var shippingEstimated = shippingDetailElement.find("span.green").html();

                if (typeof shippingEstimated != 'undefined') {    
                    mainTitleDiv.parent().append('<span style="font-size: 14px; font-weight:bold; color: #00a650;">' + shippingEstimated + '</span>');
                }
            }
        }
    );
});