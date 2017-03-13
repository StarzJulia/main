$(function() {
    var defCams = 2,
        defUsers = 0,
        defArch = 0,
        archive = ["0", "7", "14", "30", "60"];

    $("#slider-cam").slider({
        range: 'min',
        value: defCams,
        min: 1,
        max: 101,
        slide : function (e, ui) {
            $('#cams').val(ui.value);
            calc();
        },
        create : function (e, ui) {
            $('#cams').val(defCams);
        }
    });

    $("#slider-user").slider({
        range: 'min',
        value: defUsers,
        min: 0,
        max: 17,
        slide : function(e, ui) {
            $('#users').val(ui.value);
            calc();
        },
        create : function (e, ui) {
            $('#users').val(defUsers);
        }
    });

    $("#slider-archive").slider({
        range: 'min',
        value: defArch,
        min: 0,
        max: archive.length - 1,
        slide : function(e, ui) {
            $('#archive').val(archive[ui.value]);
            calc();
        },
        create : function (e, ui) {
            $('#archive').val(archive[defArch]);
        }
    });

    $('.btn').on('click', function(e) {
        e.preventDefault();
        var data = {
            cams: parseInt($('#cams').val()),
            users: parseInt($('#users').val()),
            archive: parseInt($('#archive').val())
        };
        data.getPrice = calculator.getPrice();

        var href = $(this).attr('href') + '?' + jQuery.param(data);
        $.fancybox({
            'padding' : 0,
            'margin' : 0,
            'width' : 380,
            'height' : 320,
            'autoScale' : false,
            'transitionIn' : 'none',
            'transitionOut' : 'none',
            'type' : 'iframe',
            'href' : href
        });
    });

    function calc() {
        var result = calculator.getPrice();
        if(typeof result !== "boolean")
            $('.result-price').html("<span>" + result + "</span> <i>руб/мес</i>");
        else $('.result-price').html("<i>свяжитесь с нами для получения специального предложения</i>");
    }
    var calculator = {
        // тарифы
        rateMap : [
            {
                userMax : 0,
                camMax : 2,
                archMax : 0,
                price : 0,
                type: "Free"
            },
            {
                userMax : 4,
                camMax : 16,
                archMax : 30,
                price : 54,
                type: "Standart"
            },
            {
                userMax : 10000000,
                camMax : 10000000,
                archMax : 60,
                price : 135,
                type: "Premium"
            }
        ],

        archStandartMap : [
            {
                left : 0, right : 7, price : 216
            },
            {
                left : 7, right : 14, price : 324
            },
            {
                left : 14, right : 30, price : 405
            }
        ],

        archPremiumMap : [
            {
                left : 0, right : 7, price : 270
            },
            {
                left : 7, right : 14, price : 324
            },
            {
                left : 14, right : 30, price : 405
            },
            {
                left : 30, right : 60, price : 594
            }
        ],

        getArchPrice : function(archive, type) {
            var price = 0;
            map = (type == "Standart") ? this.archStandartMap : this.archPremiumMap;
            for (var i = 0; i < map.length; i++) {
                var current = map[i];
                if (archive > current.left && archive <= current.right) {
                    price = current.price;
                    break;
                }
            }
            return price;
        },

        getPriceByMapAndSize : function(cams, users, archive, map) {
            var price = 0;
            for (var i = 0; i < map.length; i++) {
                var current = map[i];
                if (users <= current.userMax &&
                    cams <= current.camMax &&
                    archive <= current.archMax) {
                    price = current.price * cams;
                    if(archive > 0) {
                        price += this.getArchPrice(archive, current.type) * cams;
                    }
                    break;
                }
            }
            return price;
        },

        setCamsVal : function (cams) {
            var text = "<span>" + cams + '</span> шт';
            if(cams > 100) text = "более <span>100</span>";
            $('#cams-val').html(text);
        },

        setUsersVal : function (users) {
            var text = 'пользователей';
            if(users == 1) text = 'пользователя';
            var num = 'до ' + "<span>" + users + '</span> ';
            if(users > 16) num ='более ' + "<span>16</span> ";
            $('#users-val').html(num + text);
        },

        setArchVal : function (archive) {
            $('#archive-val').html("<span>" + archive + "</span> дней");
        },

        getPrice : function () {
            var cams = +$("#cams").val(),
                users = +$("#users").val(),
                archive = +$("#archive").val();

            this.setCamsVal(cams);
            this.setUsersVal(users);
            this.setArchVal(archive);

            if((users > 16) || (cams > 100))
                return false;
            else
                return this.getPriceByMapAndSize(cams, users, archive, this.rateMap);
        }
    };
    calc();
});