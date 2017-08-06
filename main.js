function formatNumber(number)
{
	decimalSeparator = ',';
	thousandSeparator = '.';
		
	number += '';
	integerAndDecimalArray = number.split('.');
	
	integerPart = integerAndDecimalArray[0];
	decimalPart = integerAndDecimalArray.length > 1 ? decimalSeparator + integerAndDecimalArray[1] : '';
	
	var thousandGroupRegex = /(\d+)(\d{3})/;
	
	while (thousandGroupRegex.test(integerPart)) {
		integerPart = integerPart.replace(thousandGroupRegex, '$1' + thousandSeparator + '$2');
	}
	
	return integerPart + decimalPart;
}

$(".results-item").each(function() {
	
	var link = $(this).find("a").first();
	var shippingDiv = $(this).find(".stack_column_item.shipping").first();
	var mainTitleDiv = $(this).find(".main-title").first();
	var findResult = $(this).find(".item__price");
	
	if (findResult.length == 0)
	{
		findResult = $(this).find(".price-fraction");
	}
	
	var price = findResult.first();
		 
	 $.get(link.attr('href'), function(response) {
		
		var shipping = $(response).find(".shipping-method-title .ch-price").html();
										
		if (typeof shipping  != 'undefined')
		{
			price.append(' + ' + shipping);
											
			var total = price.text().replace(/R\$/g, '');
			total = total.replace('.', '');
			total = '(' + total + ' / 100.0)';
			total = eval(total).toFixed(2);
			total = total.replace('.', '<sup>');
			total = total + '</sup>';
			total = formatNumber(total);
			
			price.append(' = ' + total);
			
			var shippingEstimated = $(response).find(".shipping-estimated").html();
			shippingEstimated = shippingEstimated.replace('Chegará entre os dias ', '(');
			shippingEstimated = shippingEstimated.replace('\.', ')');
			//price.parent().append('<br/>' + shippingEstimated);
			shippingDiv.first().find('p').append(shippingEstimated);
			if(shippingDiv == null)
				mainTitleDiv.parent().append(shippingEstimated);
		}
		
	 });
});


