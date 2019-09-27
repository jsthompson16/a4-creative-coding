const d3 = require("d3");
const dat = require("dat.gui");
let gui;
const xvals = [];
const yvals = [];

let globals = {
	radius: 40,
	y: window.innerHeight / 2,
	x: window.innerWidth / 2,
	xmulti: 350,
	ymulti: 350
};

const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.6/dat.gui.min.js";
document.head.appendChild( script);

if ( typeof gui !== "undefined" ) gui.destroy();
gui = new dat.GUI();
gui.add(globals, "xmulti");
gui.add(globals, "ymulti");
gui.add(globals, "radius");


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

window.addEventListener( "load", () => {
	createCircles();
});

function createCircles() {
	document.body.appendChild(
		document.createElementNS( "http://www.w3.org/2000/svg", "svg" )
	);

	fetch( "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json" )
		.then( data => data.json() )
		.then( jsonData => {
			const group = d3.select( "svg" ).selectAll( "circle" )
				.data( d3.entries( jsonData.pokemon ) )
				.join( "g" );

			group.append( "circle")
				.attr( "fill", "rgba( 237, 28, 28, .5 )")
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