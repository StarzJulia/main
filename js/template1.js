$(function() {
	/*	scroll	*/
	$(window).scroll(function() {
		var separator = $('.separator').offset().top,
			your_pos = $(window).scrollTop(),
			content_pos = $('#main').offset().top,
			banner = $(".fix_banner").outerHeight(),
			fixline = separator - banner;
		$('.sidebar_banner_btm').removeClass('fix_position');
		$('.fix_banner').removeClass('fix_position');
		$('.sidebar_banner_btm').css("top", 0);
		$('.totop').hide();
		if(your_pos >= fixline - 20) {
			var banner = $(".fix_banner").outerHeight();
			$('.sidebar_banner_btm').addClass('fix_position');
			$('.sidebar_banner_btm').css("top", banner);
		}
		if(your_pos >= content_pos - 20) {
			$('.fix_banner').addClass('fix_position');
		}
	});
	
	/*	countdown	*/
	var arr  = '2016-04-04 02:00:00'.split(/[- :]/);	// в формате 	год месяц день 	часы : минуты : секунды
	var duration = 6; 									// время отсчёта в часах
	
	var date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

	var start = new Date(date);
	var deadline = new Date(date);	
	deadline = new Date(deadline.setHours(deadline.getHours() + duration));
	var now = new Date();
	
	while((deadline - now) <= 0) {
		start = new Date(start.setHours(start.getHours() + duration));;
		deadline = new Date(deadline.setHours(deadline.getHours() + duration));
	}
	
	var countdown = new Countdown({
		selector: '.timer',
		leadingZeros: true,
		msgPattern: "<div class='t-tabs'>" +
						"<div class='t-name'>Дней</div>" +
						"<div class='t-num day'>{days}</div>" +
					"</div>" +
					"<div class='t-tabs'>" +
						"<div class='t-name'>Часов</div>" +
						"<div class='t-num hour'>{hours}</div>" +
					"</div>" +
					"<div class='t-tabs'>" +
						"<div class='t-name'>Минут</div>" +
						"<div class='t-num minute'>{minutes}</div>" +
					"</div>" +
					"<div class='t-tabs'>" +
						"<div class='t-name'>Секунд</div>" +
						"<div class='t-num second'>{seconds}</div>" +
					"</div>",
		dateStart: start,
		dateEnd: deadline,
		onEnd: function() {
			start = new Date(start.setHours(start.getHours() + duration));
			deadline = new Date(deadline.setHours(deadline.getHours() + duration));
			countdown.initialize();
		}
	});
});