
function restoreOptions () {
	$.each(Options.getAll(), function (optn, value) {
		var elt = $('#'+optn);
		if (elt.length) {
			if (elt.get(0).type === 'checkbox') {
				elt.get(0).checked = value;
				elt.trigger('change');
			} else {
				elt.val(value);
			}
		}
		elt.removeClass('invalid');
	});
}

function saveOptions () {
	$.each(Options.getAll(), function (optn) {
		var elt = $('#'+optn);// = Options.get(optn);
		if (elt.length) {
			if (validate(elt)) {
				if (elt.get(0).type === 'checkbox') {
					Options.set(optn, elt.get(0).checked);
				} else {
					Options.set(optn, elt.val());
				}
			} else {
				elt.val(Options.get(optn));
				validate(elt);
			}
		}
	});
	$('#saved-status').show().delay(600).fadeOut('slow');
}

function validate(elt) {
	if (Options.isValid(elt.get(0).id, elt.val())) {
		elt.removeClass('invalid');
		return true;
	} else {
		elt.addClass('invalid');
		return false;
	}
}

function loadDefaults () {
	Options.reset();
	restoreOptions();
}

function init() {
	restoreOptions();
	$('input[type="text"]').keyup(function (evt) {
		validate($(evt.target));
	});
	$(document).keydown(function (evt) {
		if (evt.metaKey && evt.keyCode == 83) {
			saveOptions();
			evt.preventDefault();
		}
	});
    $('.save-btn').click(saveOptions);
    $('.defaults-btn').click(loadDefaults);
    $('#round_corners').on('change', function () { $('#corner_opts').toggle(this.checked); });
    $('#border').on('change', function () { $('#border_opts').toggle(this.checked); });
}

$(init);
