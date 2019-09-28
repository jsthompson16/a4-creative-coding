const d3 = require("d3");
const dat = require("dat.gui");
let gui;
const xvals = [];
const yvals = [];
let showDocs = true;

let globals = {
	radius: 25,
	y: window.innerHeight / 2,
	x: window.innerWidth / 2,
	xmulti: 350,
	ymulti: 350,
	alpha: 0.5
};

function calcY(d, i) {
	let randomVal;
	if (Math.random() > 0.5) {
		randomVal = globals.y + Math.random() * globals.ymulti;
	}
	else {
		randomVal = globals.y - Math.random() * globals.ymulti;
	}

	yvals.push(randomVal);

	return randomVal;
}

function calcX(d, i) {
	let randomVal;
	if (Math.random() > 0.5) {
		randomVal = globals.x + Math.random() * globals.xmulti;
	}
	else {
		randomVal = globals.x - Math.random() * globals.ymulti;
	}

	xvals.push(randomVal);

	return randomVal;
}

function calcColor(d, i) {
	let red, green, blue;
	switch(d.value.type[0]) {
	case "Normal":
		red = 255;
		green = 255;
		blue = 255;
		break;
	case "Water":
		red = 21;
		green = 36;
		blue = 207;
		break;
	case "Grass":
		red = 30;
		green = 113;
		blue = 37;
		break;
	case "Fire":
		red = 235;
		green = 64;
		blue = 52;
		break;
	case "Electric":
		red = 240;
		green = 240;
		blue = 31;
		break;
	case "Flying":
		red = 81;
		green = 225;
		blue = 232;
		break;
	case "Rock":
		red = 138;
		green = 107;
		blue = 4;
		break;
	case "Ground":
		red = 102;
		green = 81;
		blue = 12;
		break;
	case "Poison":
		red = 110;
		green = 9;
		blue = 153;
		break;
	case "Psychic":
		red = 237;
		green = 104;
		blue = 237;
		break;
	case "Fighting":
		red = 166;
		green = 38;
		blue = 7;
		break;
	case "Bug":
		red = 166;
		green = 230;
		blue = 99;
		break;
	case "Ghost":
		red = 109;
		green = 59;
		blue = 140;
		break;
	case "Ice":
		red = 11;
		green = 184;
		blue = 166;
		break;
	case "Dragon":
		red = 27;
		green = 14;
		blue = 150;
		break;
	default:
		red = 100;
		green = 100;
		blue = 100;
		console.log("You missed a type");
		break;
	}

	return `rgba( ${ red }, ${ green }, ${ blue }, ${ globals.alpha } )`;
}

window.addEventListener( "load", () => {

	document.body.appendChild(
		document.createElementNS( "http://www.w3.org/2000/svg", "svg" )
	);

	drawCircles();

	if ( typeof gui !== "undefined" ) gui.destroy();
	gui = new dat.GUI();
	gui.add(globals, "xmulti").onChange(drawCircles);
	gui.add(globals, "ymulti").onChange(drawCircles);
	gui.add(globals, "radius").onChange(drawCircles);
	gui.add(globals, "x").onChange(drawCircles);
	gui.add(globals, "y").onChange(drawCircles);
	gui.add(globals, "alpha").onChange(drawCircles);
});

window.addEventListener("keydown", function(event) {
	if (event.key === "h" || event.key === "H") {
		if (showDocs) {
			document.getElementById("doc1").style.display = "none";
			document.getElementById("doc2").style.display = "none";
			showDocs = false;
		}
		else {
			document.getElementById("doc1").style.display = "flex";
			document.getElementById("doc2").style.display = "flex";
			showDocs = true;
		}
	}
});

function drawCircles() {
	xvals.length = 0;
	yvals.length = 0;
	d3.selectAll("svg > *").remove();
	fetch( "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json" )
		.then( data => data.json() )
		.then( jsonData => {
			const group = d3.select( "svg" ).selectAll( "circle" )
				.data( d3.entries( jsonData.pokemon ) )
				.join( "g" );

			group.append( "circle")
				.attr( "fill", calcColor )
				.attr( "cx", calcX )
				.attr( "cy", calcY )
				.attr( "r", globals.radius );

			group.append( "text" )
				.text( d => d.value.name )
				.attr( "fill", "white" )
				.attr( "x", function(d, i) {
					return xvals[i] - globals.radius + 10;
				} )
				.attr( "y", function(d, i) {
					return yvals[i] + globals.radius;
				} );

		});
}