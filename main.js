$(".results-item.article").each(function() {
	
	var link = $(this).find("h2.list-view-item-title>a").first();
	var price = $(this).find(".price-wrap").first();
	 
	 $.get(link.attr('href'), function(response) {
		
		var shipping = $(response).find(".shipping-method-title .ch-price").parent().html();
		
		if (typeof shipping  != 'undefined')
			price.append(shipping);
		
	 });
});


