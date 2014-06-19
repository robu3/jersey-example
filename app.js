var express = require("express"),
	palette = require("jersey-gen").palette,
	icon = require("jersey-gen").icon,
	HexColor = require("jersey-gen").HexColor,
	//palette = require("../jersey/index.js").palette,
	//icon = require("../jersey/index.js").icon,
	//HexColor = require("../jersey/index.js").HexColor,
	app = express(),
	config = require("./config.js"),
	fs = require("fs");

function colorResponse(evaluated, hexColor) {
	return {
		color: hexColor,
		evaluated: evaluated
	};
}

app.use("/", express.static(__dirname + "/static"));

app.get("/color/:string", function (req, res) {
	var sort = (req.query.sort === "true");

	var color = palette.hexColorFromWords(
		req.params.string,
		{
			sort: sort,	
			lerpT: .4
		}
	);

	res.send({
		color: color.toHexCode(),
		pastel: color.pastelize().toHexCode(),
		evaluated: req.params.string
	});
});

app.get("/hue_color/:string", function (req, res) {
	var sort = (req.query.sort === "true"),
		hue = palette.hueFromWords(
			req.params.string,
			0.5,
			0.1,
			sort
		);

	var color = HexColor.buildFromHsb([hue, 1, 1]);

	res.send({
		color: color.toHexCode(),
		evaluated: req.params.string
	});
});

app.get("/triad/:hex", function (req, res) {
	var hex = req.params.hex,
		color = HexColor.buildFromHexCode(hex),
		triad = palette.triad(color),
		colors = [];

	triad.forEach(function (c) {
		colors.push(c.toHexCode());
	});

	res.send({
		color: color.toHexCode(),
		palette: colors,
	});
});

app.get("/tetrad/:hex", function (req, res) {
	var hex = req.params.hex,
		color = HexColor.buildFromHexCode(hex),
		tetrad = palette.tetrad(color),
		colors = [];

	tetrad.forEach(function (c) {
		colors.push(c.toHexCode());
	});

	res.send({
		color: color.toHexCode(),
		palette: colors,
	});
});

app.get("/analogous/:hex", function (req, res) {
	var hex = req.params.hex,
		color = HexColor.buildFromHexCode(hex),
		hexColors = palette.analogous(color),
		colors = [];

	hexColors.forEach(function (c) {
		colors.push(c.toHexCode());
	});

	res.send({
		color: color.toHexCode(),
		palette: colors,
	});
});

app.get("/triad_tree/:hex", function (req, res) {
	var hex = req.params.hex,
		color = HexColor.buildFromHexCode(hex),
		hexColors = palette.triadTree(color),
		colors = [];

	hexColors.forEach(function (c) {
		colors.push(c.toHexCode());
	});

	res.send({
		color: color.toHexCode(),
		palette: colors,
	});
});

app.get("/tetrad_tree/:hex", function (req, res) {
	var hex = req.params.hex,
		color = HexColor.buildFromHexCode(hex),
		hexColors = palette.tetradTree(color),
		colors = [];

	hexColors.forEach(function (c) {
		colors.push(c.toHexCode());
	});

	res.send({
		color: color.toHexCode(),
		palette: colors,
	});
});

app.get("/color_debug/:string", function (req, res) {
	var color = palette.hexColorFromWords(req.params.string);

	res.send({
		color: color.toHexCode(),
		pastel: color.pastelize().toHexCode(),
		evaluated: req.params.string
	});
});

app.get("/icon/:string", function (req, res) {
	var str = req.params.string,
		options = {};

	if (req.query.width) {
		options.width = parseInt(req.query.width);
	}

	if (req.query.bit_size) {
		options.bitSize = parseInt(req.query.bit_size);
	}

	if (req.query.on_fill) {
		options.onFill = req.query.on_fill;
	}

	if (req.query.off_fill) {
		options.offFill = req.query.off_fill;
	}

	if (req.query.background_fill) {
		options.backgroundFill = req.query.background_fill;
	}

	if (req.query.word_mode) {
		options.wordMode = (req.query.word_mode === "true");
	}

	if (req.query.sort) {
		options.sort = (req.query.sort === "true");
	}

	icon.buildIconFromString(str, options, function (err, buffer) {
		res.set("Content-Type", "image/png");
		res.send(buffer);
	});
});

app.listen(config.port);
