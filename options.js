(Options = {
	// defaults
	defaults: {
		bg_color:			'#636F82',
		bg_opacity:			'90%',
		shadow:				true,
		round_corners:		true,
		corner_radius:		10,
		border:				true,
		border_color:		'#000000',
		font_color:			'#FFFFFF',
		font_size:			16,
		width:				300,

		delay:				2,
		move_with_mouse:	false,
		fade_out:			true
	},

	validation: {
		bg_color: /^\#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
		bg_opacity: /^(100(\.0{1,3}?)?%)$|^((0|[\d]|[1-9][\d])?(\.\d{1,3})?%)$|^([0]|[0](\.[\d]{1,3})?)$|^([1](\.0{1,3})?)$/,
		border_color: /^\#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
		font_color: /^\#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
		font_size: /^([1-9])$|^([1-2][\d])$/,
		width: /^\d+$/,
		corner_radius: /^\d+$/,

		delay: /^[\d](\.[\d]{1,2})?$/
	},

	// the current set of options (populated at init)
	options: {},

	init: function ()
	{
		if (this._firstTime()) {
			this._setDefaults();
		} else {
			this._load();
		}
	},

	set: function (option, value)
	{

		if (!this.isValid(option, value)) {
			throw "Invalid value ("+value+") for option " +option;
		}
		this.options[option] = value;
		this._save();
	},

	get: function (option)
	{
		return this.options[option];
	},

	getAll: function ()
	{
		this._load();
		var result = merge({}, this.options);
		return result;
	},

	isValid: function (option, value)
	{
		if (!this._isValidOption(option)) {
			throw "Invalid option "+option;
		}
		return !this._shouldValidate(option) || this.validation[option].test(value);
	},

	reset: function ()
	{
		this._setDefaults();
	},

	////////////////

	_save: function ()
	{
		localStorage['xkcdhovertext_options'] = JSON.stringify(this.options);
	},

	_load: function ()
	{
		this.options = JSON.parse(localStorage['xkcdhovertext_options']);
	},

	_isValidOption: function (option)
	{
		return this.defaults[option] !== undefined;
	},

	_shouldValidate: function (option)
	{
		return this.validation[option] !== undefined;
	},

	_setDefaults: function ()
	{
		merge(this.options, this.defaults);
		this._save();
	},

	_firstTime: function ()
	{
		return localStorage['xkcdhovertext_options'] === undefined || localStorage['xkcdhovertext_options'] === "undefined";
	}
}).init();

function merge(into, from) {
    for (var p in from) {
        if (from.hasOwnProperty(p)) {
            into[p] = from[p];
        }
    }
    return into;
}
