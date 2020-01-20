function extractValueFromPriceText(priceText) {
    var parts = priceText.trim().split(' ');

    if (parts.length == 2) {
        return eval(parts[1]);
    }

    return eval(parts[1] + '.' + parts[2]);
}

function extractValueFromShippingPrice(htmlElement) {
    var html = htmlElement.html().replace(/<sup>/g, '<sup>.');
    var priceText = $($.parseHTML(html)).text();

    return extractValueFromPriceText(priceText);
}

$(".results-item").each(function () {

    var link = $(this).find("a").first();

    var mainTitleDiv = $(this).find(".main-title").first();
    var findResult = $(this).find(".item__price");

    if (findResult.length == 0) {
        findResult = $(this).find(".price-fraction");
    }

    var price = findResult.first();

    chrome.runtime.sendMessage(
        { contentScriptQuery: "fetchShipping", url: link.attr('href') },
        response => {

            var shippingPriceElement = $(response).find(".shipping-method-title .ch-price");
            var shippingDetailElement = $(response).find(".shipping-method-title").parent().parent();

            if (typeof shippingPriceElement.html() != 'undefined') {

                var p1 = extractValueFromPriceText(price.text());
                var s1 = extractValueFromShippingPrice(shippingPriceElement);

                var total = (p1 + s1).toFixed(2);
                total = '<span class="price__fraction">' + total;
                total = total.replace('.', '</span><span class="price__decimals" style="left:0">');
                total = total + '</span>';

                shipping = shippingPriceElement.html().replace('<sup>', '<span class="price__decimals" style="left:0">');
                shipping = shipping.replace('</sup>', '</span>');

                price.append(' + ' + shipping + ' = ' + total);
            }

            var shippingEstimated = shippingDetailElement.find(".subtitle").html();

            if (typeof shippingEstimated != 'undefined') {
                shippingEstimated = shippingEstimated.replace('Chegará entre os dias ', 'Chegará entre ');
                shippingEstimated = shippingEstimated.replace('\.', '');

                mainTitleDiv.parent().append('<span style="font-size: 14px; font-weight:bold; color: #00a650;">' + shippingEstimated + '</span>');
            }
        }
    );
});