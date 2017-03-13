$(function() {
	var defaultPlaceholderValue = [];
	var defVal = $('input, textarea');		
	for (var i = 0; i < defVal.length; i++) {
		defaultPlaceholderValue[defVal[i].id] = defVal[i].placeholder;				
	}		
	$('input, textarea').click( function() {		
		this.placeholder = "";
	});	
	$('input, textarea').blur( function() {
		if (this.value == "") {
			this.placeholder = defaultPlaceholderValue[this.id];			
		};
	});
	/* Placeholder for IE */
	var ua = navigator.userAgent;
	if (ua.search(/MSIE/) > 0) {
		$('body').addClass('ie');
		$(document).find("input[type='text']").each(function() {
			var tp = $(this).attr("placeholder");
			$(this).attr('value',tp).css('color','#999999');
		}).focusin(function() {
			var val = $(this).attr('placeholder');
			if($(this).val() == val) {
				$(this).attr('value','').css('color','#999999');
			}
		}).focusout(function() {
			var val = $(this).attr('placeholder');
			if($(this).val() == "") {
				$(this).attr('value', val).css('color','#999999');
			}
		});
		$(document).submit(function() {
			$(this).find("input[type='text']").each(function() {
				var val = $(this).attr('placeholder');
				if($(this).val() == val) {
					$(this).attr('value','');
				}
			})
		});
	}
});