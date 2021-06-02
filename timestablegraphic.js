/*
* TimesTableGraphic - math graphics demo
* ©2021 Keian Rao <keian.rao@gmail.com>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

//  Parameters  //  \\  //  \\  //  \\  //  \\  //  \\

const FPS = 15;

const MAJOR_VERTEX_SIZE = 2.5;
const MINOR_VERTEX_SIZE = 1.5;

const VERTEX_COUNT = 100;
const INITIAL_MULTIPLIER = 2;
const MULTIPLIER_INCREMENT = 0.05;

/*
* I've set the FPS to a safer value, to avoid hanging any computers.
* It's still illustrative, with the high multiplier increment.
*
* If you know your computer can handle it, you can increase the FPS
* (and decrease MULTIPLIER_INCREMENT to match). If it runs okay, but
* stutters, that's the fault of my programming.
*
* If there is a memory leak, do tell me. I looked at `top` for a minute,
* and I've ran it for a few minutes to feel its effects on my browser.
* It appears stable..
*/


//  Startup     //  \\  //  \\  //  \\  //  \\  //  \\

console.log("Initialising.");

const view = document.getElementById("view");
console.assert(view, "Parent HTML document not of expected structure!");

var vertexCount;
var multiplier;

var vertices;

if (view != null) {
	vertexCount = VERTEX_COUNT;
	multiplier = INITIAL_MULTIPLIER;

	redraw();
	
	window.addEventListener("resize", redraw);
	window.setInterval(function () {
		multiplier += MULTIPLIER_INCREMENT;
		redraw();
		// Yes, this is incredibly costly of an operation.
		// This removes a lot of SVG nodes then regenerates them.
	}, 1000 / FPS);
	
	console.log("Finished initialising.");
}


//  Subroutines     \\  //  \\  //  \\  //  \\  //  \\

function redraw() {
	view.replaceChildren();

	var w = view.clientWidth;
	var h = view.clientHeight;
	var cx = w / 2;
	var cy = h / 2;
	
	const TAU = Math.PI * 2;
	var slice = TAU / vertexCount;
	var r = (3 * h) / 8;
	
	for (var modNumber = 1; modNumber <= vertexCount; ++modNumber) {
		var angle = (modNumber - 1) * slice;
		var x = cx - (r * Math.cos(angle));
		var y = cy - (r * Math.sin(angle));
		
		var nextModNumber = multiplier * modNumber;
		var nextAngle = (nextModNumber - 1) * slice;
		var nx = cx - (r * Math.cos(nextAngle));
		var ny = cy - (r * Math.sin(nextAngle));
		
		var svgStartingVertex = addCircle(x, y, MAJOR_VERTEX_SIZE);
		var svgEndingVertex = addCircle(nx, ny, MINOR_VERTEX_SIZE);
		var svgEdge = addLine(x, y, nx, ny);
		/*
		addTitle(
			svgStartingVertex, 
			"Mod number: " + modNumber
			+ "\nConnected to mod number: " + nextModNumber
		);
		*/
	}
}


//  DOM manipulation helpers    //  \\  //  \\  //  \\

function createSVGElement(tagName) {
	return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function addCircle(xCentre, yCentre, radius) {
	var elem = createSVGElement("circle");
	elem.setAttribute("cx", xCentre);
	elem.setAttribute("cy", yCentre);
	elem.setAttribute("r", radius);	
	view.appendChild(elem);
	return elem;
}

function addLine(x1, y1, x2, y2) {
	var elem = createSVGElement("line");
	elem.setAttribute("x1", x1);
	elem.setAttribute("y1", y1);
	elem.setAttribute("x2", x2);
	elem.setAttribute("y2", y2);
	elem.setAttribute("stroke", "black");
	view.appendChild(elem);
	return elem;
}

function addTitle(parentElem, text) {
	var elem = createSVGElement("title");
	elem.innerHTML = text;
	parentElem.appendChild(elem);
	return elem;
}

function addText(x, y, text) {
	// Not implemented yet
}
