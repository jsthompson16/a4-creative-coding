const d3 = require("d3");
let radius = 40, y = window.innerHeight / 2, x = window.innerWidth / 2;
const xvals = [];
const yvals = [];

function calcY(d, i) {
	let randomVal;
	if (Math.random() > 0.5) {
		randomVal = y + Math.random() * 350;
	}
	else {
		randomVal = y - Math.random() * 350;
	}

	yvals.push(randomVal);

	return randomVal;
}

function calcX(d, i) {
	let randomVal;
	if (Math.random() > 0.5) {
		randomVal = x + Math.random() * 350;
	}
	else {
		randomVal = x - Math.random() * 350;
	}

	xvals.push(randomVal);

	return randomVal;
}

window.addEventListener( "load", () => {

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
				.attr( "r", radius );

			group.append( "text" )
				.text( d => d.value.name )
				.attr( "fill", "white" )
				.attr( "x", function(d, i) {
					return xvals[i] - radius + 10;
				} )
				.attr( "y", function(d, i) {
					return yvals[i] + radius;
				} );

		});
});