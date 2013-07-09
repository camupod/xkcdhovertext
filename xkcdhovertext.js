/* xkcdhovertext.js */

function loadxkcdhovertext (options) {
	reloadxkcdhovertext(options);
	setInterval(reloadxkcdhovertext, 1000, options);
}

function reloadxkcdhovertext(options) {
	var images = $('img');
	images.each(function () {
		var image = $(this);
		if (image.data('hovertextified')) {
			return;
		}
		image.data('hovertextified', true);
		var src = image.attr('src');

        // only match images hosted on *.xkcd.com
		if (!/.*xkcd\.com|^(?!http)/ig.test(src)) return;

		var title = image.attr('title');
		if (!title || $.trim(title) === '') return;

		var hovertext = $('<div class="xkcdhovertext">').appendTo('body');
		hovertext.css({
			width:					options.width + 'px',
			color:					toRGBA(options.font_color, 1),
			'background-color':		toRGBA(options.bg_color, options.bg_opacity),
			'font-size':			options.font_size + 'px'
		});

		if (options.border) {
			hovertext.css('border', '1px solid ' + toRGBA(options.border_color, 1));
		}

		if (options.shadow) {
			hovertext.css('box-shadow', '4px 4px 4px rgba(0, 0, 0, 0.60)');
		}

		if (options.round_corners) {
			hovertext.css('border-radius', options.corner_radius + 'px');
		}

		hovertext.append(title);
		image.attr('title', '');
		var off = $('body').offset();
		var move = function (e) {
			if (e.relatedTarget === hovertext.get(0)) {
				return;
			}
			var top = e.pageY + 20;// + off.top;
			var left = e.offsetX + 10;// + off.left;

			if (left + hovertext.outerWidth() > $(window).width()) {
				left -= hovertext.outerWidth() - 10;
			}
			if (top + hovertext.outerHeight() > $(window).height()) {
				top -= hovertext.outerHeight() + 40;
			}
			hovertext.css({
				top: top,
				left: left
			});
		};

		var tid;
		var over = function (e) {
			if (e.relatedTarget !== hovertext.get(0)) {
				clearTimeout(tid);
				tid = setTimeout(function () {
					hovertext.show();
					if (!options.move_with_mouse) {
						$(document).unbind('mousemove.hovertext');
					}
				}, options.delay * 1000);
				hovertext.hide();
				$(document).bind('mousemove.hovertext', move);
			}
		};

		var out = function (e) {
			if (e.relatedTarget !== hovertext.get(0)) {
				clearTimeout(tid);
				if (!options.move_with_mouse && options.fade_out) {
					hovertext.delay(200).fadeOut('slow', function () {
						$(document).unbind('mousemove.hovertext');
					});
				} else {
					hovertext.hide();
					$(document).unbind('mousemove.hovertext');
				}
			}
		};

		image.hover(over, out);
	});
}

function toRGBA(hex, opacity) {
	hex = hex.toString();
	opacity = opacity.toString();
	var result = 'rgba(';

	if (hex.charAt(0) === '#') {
		hex = hex.substring(1, hex.length);
	}

	if (hex.length === 3) {
		result += parseInt(hex.charAt(0), 16) + ', ';
		result += parseInt(hex.charAt(1), 16) + ', ';
		result += parseInt(hex.charAt(2), 16) + ', ';
	} else if (hex.length === 6) {
		result += parseInt(hex.substring(0, 2), 16) + ', ';
		result += parseInt(hex.substring(2, 4), 16) + ', ';
		result += parseInt(hex.substring(4, 6), 16) + ', ';
	}

	if (opacity.indexOf('%') > -1) {
		opacity = opacity.substring(0, opacity.length - 1);
		opacity = parseFloat(opacity) / 100;
	}

	return result + opacity + ')';
}

chrome.extension.sendMessage('options', loadxkcdhovertext);
