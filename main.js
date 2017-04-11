$(".results-item").each(function() {
	
	var link = $(this).find("h2.list-view-item-title>a").first();
	var findResult = $(this).find(".price-wrap .ch-price");
	
	if (findResult.length == 0)
	{
		findResult = $(this).find(".price-info-cost .ch-price");
	}
	
	var price = findResult.first();
		 
	 $.get(link.attr('href'), function(response) {
		
		var shipping = $(response).find(".shipping-method-title .ch-price").html();
		
		var shippingEstimated = $(response).find(".shipping-estimated").html();
						
		if (typeof shipping  != 'undefined')
		{
			price.append(' + ' + shipping);
											
			var total = price.text().replace(/R\$/g, '');
			total = '(' + total + ') / 100';
			total = eval(total).toFixed(2);
			total = total.replace('.', '<sup>');
			total = total + '</sup>';
			 
			price.append(' = ' + total);
			price.parent().append('<br/>' + shippingEstimated);
		}
		
	 });
});


