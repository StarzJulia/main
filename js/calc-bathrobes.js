$(function() {
	var bathrobe = [];

	function render() {
	  renderText(bathrobe.text);
	  renderTextColor(bathrobe.embroidery);
	  renderMainImg(bathrobe.id, bathrobe.color);
	  renderTopImg(bathrobe.top_picture);
	  renderBottomImg(bathrobe.bottom_picture);
	  setFontFamily(bathrobe.font);

	  if(bathrobe.set_front) {
		renderFrontMainImg(bathrobe.id, bathrobe.color);
	  	renderFrontText(bathrobe.front_text, bathrobe.autolines_front);
		renderFrontImg(bathrobe.front_picture);
	  }

	  function renderText(text) {
	  	$(".fancy-back .fancy-text").html(text.replace(/\r\n|\r|\n/g,"<br />"));
	  }

	  function renderFrontText(front_text, autolines_front) {
	  var text = "";
	  	if(front_text.length > 1) {
	  		var words = front_text.split("");
			text = words[0] + "<span>" + words[1] + "</span>"
		}
		else text = front_text;
	  	$(".fancy-front .fancy-text").html(text);
		if (autolines_front) $(".fancy-front .fancy-text").addClass("autolines");
		else $(".fancy-front .fancy-text").removeClass("autolines");
	  }

	  function renderTextColor(color) {
	  	$("#make .result").css("color", color);
	  }

	  function renderMainImg(id, color) {
	  	$(".front-image").hide();
	    $(".bathrobe").attr("src", "img/form/" + id + "-" + color + ".jpg");
	  }

	  function renderFrontMainImg(id, color) {
	  	$(".front-image").show();
	  	$(".bathrobe-front").attr("src", "img/form/front-" + id + "-" + color + ".jpg");
	  }

	  function renderTopImg(top_picture) {
		if(top_picture != "default")
			$(".fancy-back .fancy-top img").attr("src", "img/form/" + top_picture + ".svg").show();
		else $(".fancy-back .fancy-top img").hide();
	  }

	  function renderBottomImg(bottom_picture) {
		if(bottom_picture != "default")
			$(".fancy-back .fancy-bottom img").attr("src", "img/form/" + bottom_picture + ".svg").show();
		else $(".fancy-back .fancy-bottom img").hide();
	  }

	  function renderFrontImg(front_picture) {
		if(front_picture != "default")
			$(".fancy-front .fancy-top img").attr("src", "img/form/front-" + front_picture + ".svg").show();
		else $(".fancy-front .fancy-top img").hide();
	  }


	  function setFontFamily(font) {
		$("#make .result").css("font-family", font);
	  }
	}

	$("#make form").on("keyup", "textarea", function() {
		bathrobe[$(this).attr("name")] = $(this).val();
		render();
	});

	$("#make form").on("change", "input[type=radio], select", function() {
		bathrobe[$(this).attr("name")] = $(this).data("val") || $(this).val();
		render();
	});

	$("#make form").on("change", "input[type=checkbox]", function() {
		bathrobe[$(this).attr("name")] = $(this).prop("checked");
		render();
	});

	$(".bathrobe-type").on("change", "input[name=form_type]", function() {
		bathrobe.type = $(this).val();
		bathrobe.id = $(this).attr("id");
		bathrobe.set_front = $(this).data("front");
		$("#make form").removeClass("visible");
		$("#make form." + bathrobe.id).addClass("visible");
		$("#make form." + bathrobe.id + " ul").each(function() {
			var li = $(this).find("li").first();
			li.find("input").prop("checked", "checked");
			bathrobe[li.find("input").attr("name")] = li.find("input").data("val");
		});
		$("#make form." + bathrobe.id + " select").each(function() {
			var option = $(this).find("option").first();
			option.prop("checked", "checked");
			bathrobe[$(this).attr("name")] = option.val();
		});
		$("#make form." + bathrobe.id + " input[type=checkbox]").each(function() {
			bathrobe[$(this).attr("name")] = $(this).prop("checked");
		});
		bathrobe.text = "Ваш текст";
		bathrobe.front_text = ($("#make form." + bathrobe.id).has("textarea[name=front_text]")) ? "АМ" : "";
		render();
	});

	$(".bathrobe-type li").first().find("input").click();
});