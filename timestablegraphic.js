/*
* TimesTableGraphic - math graphics demo
* ©2020 Keian Rao <keian.rao@gmail.com>
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


console.log("Initialising.");

const view = document.getElementById("view");
console.assert(view, "Parent HTML document not of expected structure!");

var vertexCount;
var multiplier;

var vertices;

if (view != null) {
	vertexCount = 100;
	multiplier = 2;
	reevaluate();

	redraw();
	
	window.addEventListener("resize", redraw);
	
	console.log("Finished initialising.");
}


//  Subroutines     \\  //  \\  //  \\  //  \\  //  \\

function reevaluate() {
	vertices = [];
	
	const TAU = Math.PI * 2;
	var slice = TAU / vertexCount;	
	for (var vertexIndex = 1; vertexIndex <= vertexCount; ++vertexIndex) {
		var vertex = {
			modNumber: vertexIndex - 1,
			angle: (vertexIndex - 1) * slice,
			nextModNumber: null
		};
		vertices.push(vertex);
	}
	
	// Okay, let's multiply and fill the edges.
	for (var vertex of vertices) {
		vertex.nextModNumber = (multiplier * vertex.modNumber) % vertexCount;
	}
	// We can inline this above, but.
}

function redraw() {
	view.replaceChildren();

	var w = view.clientWidth;
	var h = view.clientHeight;
	var cx = w / 2;
	var cy = h / 2;
	
	var r = (3 * h) / 8;
	for (var vertex of vertices) {
		var x = cx - (r * Math.cos(vertex.angle));
		var y = cy - (r * Math.sin(vertex.angle));
		
		var nextVertex = vertexForModNumber(vertex.nextModNumber);
		// Deja vu..
		console.assert(nextVertex != null);
		var nx = cx - (r * Math.cos(nextVertex.angle));
		var ny = cy - (r * Math.sin(nextVertex.angle));
		
		var svgVertex = addCircle(x, y, 5);
		addTitle(
			svgVertex, 
			"Mod number: " + vertex.modNumber
			+ "\nConnected to mod number: " + vertex.nextModNumber
		);
		
		var svgEdge = addLine(x, y, nx, ny);
	}
}

function vertexForModNumber(modNumber) {
	if (vertices.length == 0) return null;
	
	var lastClosestVertex;
	var diffFromLastClosestVertex;
	{
		lastClosestVertex = vertices[0];
		diffFromLastClosestVertex = lastClosestVertex.modNumber - modNumber;
	}
	for (var vertex of vertices) {
		var diff = Math.abs(vertex.modNumber - modNumber);
		
		if (diff == 0) return vertex;
		
		if (diff < diffFromLastClosestVertex) {
			lastClosestVertex = vertex;
			diffFromLastClosestVertex = diff;
			continue;
		}
	}
	return lastClosestVertex;
	
	// I'm trying to get the closest vertex rather than the exact vertex with
	// that mod number, because, I'd like to support fractional multipliers.
	// In regards to that, this code isn't working right now.
	//
	// An alternative is to not draw lines to existent vertices, but rather
	// to just return an angle corresponding to that mod number, so the
	// source vertex draws to the point on the circle for that angle.
	// Similarly we can drop vertex objects altogether, just loop over
	// angles in #redraw.
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
