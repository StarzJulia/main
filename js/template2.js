$(function() {
	$('.menu_btn').on('click', function() {
		$('.menu-top-menu-container').slideToggle();
	});	
	$(window).scroll(function() {
		var your_pos = $(window).scrollTop();
		$('.totop').hide();
		if(your_pos >= 200) {
			$('.totop').show();
		}
	});
	$('a[href^="#"]').click(function(){
        var el = $(this).attr('href');
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false; 
	});
});