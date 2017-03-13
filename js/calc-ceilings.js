$(function() {
	$.ajax({
		type: "GET",
		async : false,
		url: "http://www.cbr.ru/scripts/XML_daily.asp",
		dataType: "xml",
		crossDomain: true,
		success: XmlKurs
	});
	function XmlKurs (xml) {
		$(xml).find("Valute").each(function(){
			if($(this).attr('ID')=='R01235') {
				d=$(this).find("Value").text().replace(",",".");
				$("#dollar").val(d);
			} 
			if($(this).attr('ID')=='R01239') {
				e=$(this).find("Value").text().replace(",",".");
				$("#euro").val(e);
			} 
		});
	}
    
    $('select#types').on('change', function() {
        var sel_option = $(this).find('option:selected').val();
        $('label.hidden_select').hide();
        if(sel_option == 'cottage') {
            $('label.cottage_type').show();
        }
        else {$('label.all_types').show();}
    });

    $('select#types, select#mode, select#surtface').on('change', function() {
        var types_option = $('select#types').find('option:selected').val(),
            mode_option = $('select#mode').find('option:selected').val();
        surfaces = $('select#surface').val();
        $('label.chiller_hidden_select').hide();
        if((surfaces == 'ceilings' || surfaces == 'floors' ||
            surfaces == 'walls' || surfaces == 'ceilings-walls' ||
            surfaces == 'ceilings-walls-floors') && mode_option == 'heating') {
            if(types_option == 'cottage' || types_option  == 'townhouse') {
                $('label.chiller_hidden_select').show();
                $('#boiler option:nth-child(2)').attr('disabled', 'disabled');
            }
            if(types_option == 'flat' || types_option  == 'office') {
                $('label.chiller_hidden_select').show();
                $('#boiler option:nth-child(2)').removeAttr('disabled');
            }
        }
    });
    $("input#f_name, input#f_phone").on('change keyup', function() {
        var name = $('input#f_name').val(),
            mail = $('input#f_email').val(),
            phone = $('input#f_phone').val();
        $('input#f_Name').val(name);
        $('input#email').val(mail);
        $('input#f_Subject').val(phone);
    });

    $(".calc_form input:not(#f_name, #f_phone, #f_your_square)").on('change keyup', function() {
        calc();
    });
    $('#f_your_square').on('change, keyup', function() {
        var value = $(this).val();
        $(this).attr('data-value', value);
        calc();
    });
    $('#f_square').on('change, keyup', function() {
        updateSquare();
    });
    $("select").on('change', function() {
        calc();
    });
    $("select#currency").on('change', function() {
        var text = $(this).find(':selected').text();
        $('.cost i').text(text);
    });
    visual();

    function visual() {
        var content,
            mode = $("#mode").val(),
            types = $("#types").val(),
            boiler = $("#boiler").val(),
            smart_house = $('#smart_house').val(),
            mounting = $('#mounting').val(),
            conditioning = $('#conditioning').val(),
            block = [];
        $('select').each(function() {
            var text = $(this).find(':selected').text();
            if(text == 'Да' || text == 'Есть') {
                text = $(this).parent().find('span').text();
            }
            if(text == 'USD') { text = '$';}
            if(text == 'EU') { text = '&euro;'}
            if(text == 'Руб.') { text = '<span class="ruble line-through">p</span><span class="dot">уб.</span>';}
            if(text == 'Нет' || text == '' || $(this).parent().css('display') == 'none') {
                return;
            }

            block.push('<div>' + text + '</div>');
        });

        content = block.join("+");
        $('.visual').html(content);
    }
    function updateSquare() {
        var commonSquare = $('#f_square').val(),
            data_value = +$('#f_your_square').attr('data-value'),
            value = +$('#f_your_square').val();
        if(data_value == 0) {
            value = (commonSquare * 0.8);
            $('#f_your_square').val(value.toFixed(2));
        }
        if (value === 0) {
            $('#f_your_square').val("");
        }       
    }
    function calc() {
        $(".errorMessage").html('');
        visual();
        var f_square = +$('#f_square').val(),
            f_your_square = +$('#f_your_square').val(),
            num_rooms = $('#num_rooms').val();
        $('.message').text('');
        $('#f_total, #f_cost').val('');
        if((f_your_square == "") || (f_your_square == 0) || (num_rooms == '')) {
            $(".errorMessage").html('* поля со звёздочками обязательны для заполнения');
            return;
        }
        if(f_your_square < 30) {
            $('.message').text('Модульные решения для небольших площадей разрабатываются. Следите за нашими новостями');
            return;
        }
        if(f_your_square > 430) {
            $('.message').text('Для данной площади необходим индивидуальный расчет, пришлите планы помещений на электронную почту');
            return;
        }
        var result = (calculator.getPrice()).toFixed(2);
        var cost = (result / f_your_square).toFixed(2);
        $('#f_total').val(result.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
        $('#f_cost').val(cost.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    }
    var calculator = {
        chillerMap : [
            {
                left : 29.99, right : 56, price : 5410
            },
            {
                left : 56, right : 61, price : 5583
            },
            {
                left : 61, right : 74, price : 5858
            },
            {
                left : 74, right : 95, price : 6754
            },
            {
                left : 95, right : 133, price : 9063
            },
            {
                left : 133, right : 163, price : 10235
            },
            {
                left : 163, right : 203, price : 10924
            },
            {
                left : 203, right : 221, price : 11786
            },
            {
                left : 221, right : 263, price : 14301
            },
            {
                left : 263, right : 326, price : 15680
            },
            {
                left : 326, right : 430, price : 18092
            }
        ],

        circulationPumpMap : [
            {
                left: 29.99, right: 99, price : 527
            },
            {
                left: 99, right: 219, price : 624
            },
            {
                left: 219, right: 430, price : 1322
            }
        ],

        mountingMap : [
            {
                left : 29.99, right : 99, price : 40
            },
            {
                left : 99, right : 199, price : 39
            },
            {
                left : 199, right : 299, price : 38
            },
            {
                left : 299, right : 430, price : 37
            }
        ],

        commissioningMap : [
            {
                left : 29.99, right : 99, price : 8
            },
            {
                left : 99, right : 199, price : 7
            },
            {
                left : 199, right : 299, price : 6
            },
            {
                left : 299, right : 430, price : 5
            }
        ],

        getProjectJobPrice : function(s) {
            return 6 * s;
        },

        getCapillaryMatsPrice : function(s) {
            return 75 * s;
        },

        getAutomaticsPrice : function(roomsAmount, smart_house) {
            var price = 155 * roomsAmount;
            if(smart_house == 'yes') {
                price *= 0.7;
            }
            return price;
        },

        getCollectorsPrice : function(s) {
            var colCount = s / 9;
            var result =  125 * colCount;
            this.fillInput(result, "#collectPrice");
            return  result;
        },

        getChillerPrice : function(s, surfaces, mode, types, conditioning, geothermal, boiler ) {
            if (surfaces == 'ceilings-walls' || surfaces == 'ceilings-walls-floors') {
                s *= 1.3;
            }
            $('#ChillerName').val('Чиллер');
            var price = this.getPriceByMapAndSize(s, this.chillerMap);

            $('.cottage_type b').html('Есть ли <span>геотермальный коллектор</span>');
            $('.all_types  b').html('Есть ли <span>центральное кондиционирование</span>');

            if ((surfaces == 'ceilings' && mode == 'cooling-heating') ||
                (surfaces == 'walls' && mode == 'cooling-heating') ||
                (surfaces == 'ceilings-walls' && mode == 'cooling-heating') ||
                (surfaces == 'ceilings-floors' && mode == 'cooling-heating') ||
                (surfaces == 'ceilings-floors' && mode == 'heating') ||
                (surfaces == 'ceilings-walls-floors' && mode == 'cooling-heating')) {
                price *= 1.2;
            }

            if ((surfaces == 'ceilings' && mode == 'heating') ||
                (surfaces == 'walls' && mode == 'heating') ||
                (surfaces == 'ceilings-walls' && mode == 'heating') ||
                (surfaces == 'floors' && mode == 'heating') ||
                (surfaces == 'ceilings-walls-floors' && mode == 'heating')) {
                price = this.getPriceByBoiler(price, boiler);
            }

            if(types == 'cottage' && geothermal == 'yes') {
                price *= 0.2;
                $('.cottage_type b').html('<span>Автоматика геотермального коллектора</span>');
            }
            if (types == 'flat' && types == 'townhouse' && types == 'office' || conditioning == 'yes') {
                price *= 0.5;
                $('.all_types  b').html('<span>Электронный блок управления</span>');
            }

            this.fillInput(price, "#chillerPrice");
            return price * 0.8;
        },

        getPriceByBoiler : function(price, boiler) {
            if(boiler == 'heatPump') {
                price += price * 0.2;
               $('#ChillerName').val('Тепловой насос');
            }
            if(boiler == "gasBoiler") {
                price *= 0.3;
                $('#ChillerName').val('Газовый котёл');
            }
            if(boiler == "electricBoiler") {
                price *= 0.2;
                $('#ChillerName').val('Электрический котёл');
            }
            return price;
        },
        getCirculationPumpPrice : function(s, mounting) {
            var price = this.getPriceByMapAndSize(s, this.circulationPumpMap);
            $('#PumpPrice').val(price);
            return price;
        },

        getPriceByMapAndSize : function(s, map) {
            var price = 100000;
            for (var i = 0; i < map.length; i++) {
                var current = map[i];
                if (s > current.left && s <= current.right) {
                    price = current.price;
                    break;
                }
            }
            return price;
        },

        fillInput : function(value, selector) {
            $(selector).val(value);
        },

        getHeatExchangerPrice : function(s) {
            var result = 3.5 * s;
            this.fillInput(result, "#heatExchangerPrice");
            return result;
        },

        getZraPrice : function(s) {
            var result = 4.5 * s;
            this.fillInput(result, "#zraPrice");
            return result;
        },

        getIsolationPrice : function(s) {
            var result = 8.7 * s;
            this.fillInput(result, "#isolationPrice");
            return result;
        },

        getMaterialsPrice : function(s) {
            var result = 3.3 * s
            this.fillInput(result, "#materialsPrice");
            return result;
        },

        getMountingPrice : function(s, mounting, surfaces, types, mode, geothermal, boiler, smart_house) {
            var result = this.getPriceByMapAndSize(s, this.mountingMap);
            /*if(((surfaces == 'ceilings') || (surfaces == 'ceilings-walls')) && types == 'cottage' && (mode == 'cooling' || mode == 'cooling-heating')){
                if (mounting == 'drywall') {
                    result *= 0.8;
                }
                if (mounting == 'metalTape') {
                    result *= 0.7;
                }
            }
            if(((surfaces == 'ceilings') || (surfaces == 'ceilings-walls')) && types == 'cottage' && mode == 'heating' && geothermal == 'no' && smart_house == 'no' && boiler == 'heatPump') {
                if (mounting == 'drywall') {
                    result *= 0.8;
                }
                if (mounting == 'metalTape') {
                    result *= 0.7;
                }
            }*/
            if(mounting == 'drywall') {result *= 0.8;}
            if(mounting == 'metalTape') {result *= 0.7;}
            this.fillInput(result, "#mountingPrice");
            result *= s;
            return result;
        },

        getCommissioningPrice : function(s) {
            var result = this.getPriceByMapAndSize(s, this.commissioningMap);
            this.fillInput(result, "#commissioningPrice");
            result *= s;
            return result;
        },

        getPriceWithExchangeRate : function(currency, dollar, euro) {
            var exchange = 1;
            if(currency == 'rub') {exchange = euro;}
            if(currency == 'USD') {exchange = euro/dollar;}
            return exchange;
        },

        getPrice : function () {
            var s = $("#f_your_square").val(),
                roomsAmount = $("#num_rooms").val(),
                surfaces = $("#surface").val(),
                mode = $("#mode").val(),
                types = $("#types").val(),
                geothermal = $('#geothermal_reservoir').val(),
                boiler = $("#boiler").val(),
                smart_house = $('#smart_house').val(),
                mounting = $('#mounting').val(),
                conditioning = $('#conditioning').val(),
                currency = $('#currency').val(),
                dollar = $('#dollar').val(),
                euro = $('#euro').val();
            return (this.getProjectJobPrice(s) + this.getCapillaryMatsPrice(s) + this.getAutomaticsPrice(roomsAmount, smart_house) +
                this.getChillerPrice(s, surfaces, mode, types, conditioning, geothermal, boiler) + this.getCirculationPumpPrice(s) + this.getCollectorsPrice(s) +
                this.getCommissioningPrice(s) + this.getHeatExchangerPrice(s) + this.getIsolationPrice(s) +
                this.getMaterialsPrice(s) + this.getMountingPrice(s, mounting, surfaces, types, mode, geothermal, boiler, smart_house) + this.getZraPrice(s)) * this.getPriceWithExchangeRate(currency, dollar, euro);
        }
    };
});