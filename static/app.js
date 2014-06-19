function fillCells(prefix, colors) {
	for (var i = 0; i < colors.length; i++) {
		$(prefix + i).css("background-color", colors[i]);
	}
}

function setTriad(color) {
	$.ajax({
		dataType: "json",
		url: "../triad/" + encodeURIComponent(color),
		success: function (data) {
			fillCells(".triad-", data.palette);

			// build icon using triad colors
			setIcon($("#input").val(), {
				on_fill: data.palette[1],
				off_fill: data.palette[2],
				background_fill: data.palette[0]
			});
		}
	});
}

function setTetrad(color) {
	$.ajax({
		dataType: "json",
		url: "../tetrad/" + encodeURIComponent(color),
		success: function (data) {
			fillCells(".tetrad-", data.palette);
		}
	});
}

function setAnalogous(color) {
	$.ajax({
		dataType: "json",
		url: "../analogous/" + encodeURIComponent(color),
		success: function (data) {
			fillCells(".analogous-", data.palette);
		}
	});
}

function setTriadTree(color) {
	$.ajax({
		dataType: "json",
		url: "../triad_tree/" + encodeURIComponent(color),
		success: function (data) {
			fillCells(".triad-tree-", data.palette);
		}
	});
}

function setIcon(str, colors) {
	var options = {
		width: 150,
		on_fill: colors.on_fill,
		off_fill: colors.off_fill,
		background_fill: colors.background_fill
	};

	var url = "../icon/" + encodeURIComponent(str) + "?";
	url += $.param(options);

	$("#icon").attr("src", url);
}

$(document).ready(function () {
	$("#input").keyup(function () {
		var value = $(this).val(),
			sort = $("#sort").is(":checked");

		$.ajax({
			dataType: "json",
			url: "../hue_color/" + value,
			data: {
				"sort": sort
			},
			success: function (data) {
				$(".hue").css("background-color", data.color);
				setTriad(data.color);
				setTetrad(data.color);
				setAnalogous(data.color);
				setTriadTree(data.color);
			}
		});

		$.ajax({
			dataType: "json",
			url: "../color/" + value,
			data: {
				"sort": sort
			},
			success: function (data) {
				$(".random-color").css("background-color", data.color);
				$(".pastel").css("background-color", data.pastel);
			}
		});
	});
});
