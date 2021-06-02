/*
* TimesTableGraphic - math graphics demo
* (C) 2021 Keian Rao <keian.rao@gmail.com>
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


import java.awt.Panel;
import java.awt.Image;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Shape;
import java.awt.geom.Ellipse2D;
import java.awt.RenderingHints;
import java.awt.Toolkit;

import java.awt.Frame;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;


class TimesTableGraphic extends Panel {

//  Parameters  //  \\  //  \\  //  \\  //  \\

private static final int FPS = 15;
private static final boolean ANTIALIAS = true;

private static final double MAJOR_VERTEX_SIZE = 2.5;
private static final double MINOR_VERTEX_SIZE = 1.5;

private static final int VERTEX_COUNT = 100;
private static final double INITIAL_MULTIPLIER = 2;
private static final double MULTIPLIER_INCREMENT = 0.05;



//  Classes     //  \\  //  \\  //  \\  //  \\

private class Timer extends Thread {
	public void run() {
		while (true) {
			multiplier += MULTIPLIER_INCREMENT;
			repaint();
			if (FPS < 12) Toolkit.getDefaultToolkit().sync();
			try { Thread.sleep(1000 / FPS); }
			catch (InterruptedException eIt) { break; }
		}
	}
}



//  Variables   //  \\  //  \\  //  \\  //  \\

double multiplier;

Image buffer;
Timer timer;



//  Constructor     \\  //  \\  //  \\  //  \\

TimesTableGraphic()
{
	multiplier = INITIAL_MULTIPLIER;

	timer = new Timer();
}


//  Private methods     //  \\  //  \\  //  \\

@Override
public void update(Graphics g) { paint(g); }
	
public void paint(Graphics g) {
	int width = getWidth();
	int height = getHeight();
	int bufferWidth = -1;
	int bufferHeight = -1;
	if (buffer != null) {
		bufferWidth = buffer.getWidth(this);
		bufferHeight = buffer.getHeight(this);
		// I'm okay with these returning -1.
	}
	if (buffer == null || bufferWidth != width || bufferHeight != height) {
		buffer = createImage(width, height);
	}
	
	Graphics bg = buffer.getGraphics();
	paintDirectly(bg);
	bg.dispose();
	g.drawImage(buffer, 0, 0, this);
}

private static String truncate(String str, int len) {
	if (str.length() <= len) return str;
	return str.substring(0, len);
}

public void paintDirectly(Graphics g) {
	assert g instanceof Graphics2D;
	Graphics2D g2d = (Graphics2D)g;
	
	if (ANTIALIAS) {
		g2d.setRenderingHint(
			RenderingHints.KEY_ANTIALIASING,
			RenderingHints.VALUE_ANTIALIAS_ON
		);
	}

	int width = getWidth();
	int height = getHeight();
	
	g.clearRect(0, 0, width, height);
	
	g.drawString(
		truncate("" + multiplier, 6),
		(9 * width) / 10,
		(9 * height) / 10
	);
	
	final double TAU = Math.PI * 2;
	final double SLICE = TAU / VERTEX_COUNT;
	int radius = (3 * height) / 8;
	int xCentre = width / 2;
	int yCentre = height / 2;
	for (int modNumber = 0; modNumber < VERTEX_COUNT; ++modNumber) {
		double angle = modNumber * SLICE;
		int x = (int)(xCentre - (radius * Math.cos(angle)));
		int y = (int)(yCentre - (radius * Math.sin(angle)));
		
		double nextModNumber = multiplier * modNumber;
		double nextAngle = nextModNumber * SLICE;
		int nextX = (int)(xCentre - (radius * Math.cos(nextAngle)));
		int nextY = (int)(yCentre - (radius * Math.sin(nextAngle)));
		
		Shape majorVertex = new Ellipse2D.Double(
			x - MAJOR_VERTEX_SIZE,
			y - MAJOR_VERTEX_SIZE, 
			MAJOR_VERTEX_SIZE * 2, 
			MAJOR_VERTEX_SIZE * 2
		);
		Shape minorVertex = new Ellipse2D.Double(
			nextX - MINOR_VERTEX_SIZE,
			nextY - MINOR_VERTEX_SIZE,
			MINOR_VERTEX_SIZE * 2,
			MINOR_VERTEX_SIZE * 2
		);
		g2d.fill(majorVertex);
		g2d.fill(minorVertex);
		
		g.drawLine(x, y, nextX, nextY);
	}
}


//  Main    \\  //  \\  //  \\  //  \\  //  \\

public static void main(String... args) {
	Frame frame = new Frame("Times table graphic");

	TimesTableGraphic graphic = new TimesTableGraphic();
	frame.add(graphic);
	
	class Stopper extends WindowAdapter {
		public void windowClosing(WindowEvent eW) {
			graphic.timer.interrupt();
			frame.dispose();
		}
	}
	frame.addWindowListener(new Stopper());
	
	frame.setLocationByPlatform(true);
	frame.setSize(800, 600);
	frame.setVisible(true);
	
	graphic.timer.start();
}

}


//  \\  //  \\  //  \\  //  \\  //  \\  //  \\
