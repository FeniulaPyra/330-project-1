(function() {
	
'use strict'
	
let c = 1;
let divergence = 137.5;
let treeC = 4;
let leafSize = 5;
//let petalDotSize = 10;
	
let lepLIB = {
	
	getRandomColor(){
		const getByte = _ => Math.round(Math.random() * 255);
		return`rgba(${getByte()}, ${getByte()}, ${getByte()}, ${getRandomInt(0,10)/10})`; "rgba(" + getByte() + "," + getByte() + "," + getByte() + "," + (getRandomInt(0, 10)/10) + ")";
	},
	getRandomColorRange(minR, minG, minB, maxR, maxG, maxB, minA = 1, maxA = 1) {
		let r = lepLIB.getRandomInt(minR, maxR);
		let g = lepLIB.getRandomInt(minG, maxG);
		let b = lepLIB.getRandomInt(minB, maxB);
		let a = lepLIB.getRandomInt(minA, maxA);
		
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	},
	getRandomHSLRange(minH, minS, minL, maxH, maxS, maxL, minA=1, maxA=1) {
			
		let h = lepLIB.getRandomInt(minH, maxH);
		let s = lepLIB.getRandomInt(minS, maxS);
		let l = lepLIB.getRandomInt(minL, maxL);
		let a = lepLIB.getRandomInt(minA, maxA);	
		
		
		return `hsl(${h}, ${s}%, ${l}%)`;//, ${a})`;
	},
	getRandomInt(min, max) {
				
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	canvasClicked(e){
	  let rect = e.target.getBoundingClientRect();
	  let mouseX = e.clientX - rect.x;
	  let mouseY = e.clientY - rect.y;

		for(let i = 0; i < maxSize; i ++) {
			drawRandomRect(ctx, mouseX + getRandomInt(-maxSize * 3, maxSize * 3), mouseY + getRandomInt(-maxSize * 3, maxSize * 3));
		}
	},

	drawRectangle(ctx, x, y, width, height, fillStyle="black", lineWidth=0, strokeStyle="black") {
		ctx.save();
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.rect(x, y, width, height);
		ctx.closePath();
		ctx.fill();
		if(lineWidth > 0) {
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}
		ctx.restore();
	},
	drawCircle(ctx, x, y, radius, fillStyle="black", lineWidth=0, strokeStyle="black") {
		
		ctx.save();
		ctx.fillStyle = fillStyle;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
		if(lineWidth > 0) {
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}
		ctx.restore();
	},
	drawLine(ctx, startX, startY, endX, endY, lineWidth=1, strokeStyle="black") {
		ctx.save();
		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	},
	
	
	
	generatePetals(ctx, flowerX, flowerY, flowerHeight, petalRadius, petalCount, customDivergence, petalDotSize, hue, saturation, lightness, hMax, sMax, lMax) {		
		//center of the actual flower
		let centerX = flowerX;
		let centerY = flowerY - flowerHeight;
				
		//if there is no custom divergence given, convert the number of petals into a divergence angle
		if (customDivergence == -1) customDivergence = 360/petalCount;
		
		let hDifference = hMax - hue;
		let sDifference = sMax - saturation;
		let lDifference = lMax - lightness;
		
		for(let n = 0, r = 0; Math.min(petalDotSize, 10) * Math.sqrt(n) < petalRadius; n++) {
			let a = n * customDivergence * Math.PI/180;
			r = Math.min(petalDotSize, 10) * Math.sqrt(n);
			
			let x = r * Math.cos(a) + flowerX;
			let y = r * Math.sin(a) + flowerY - flowerHeight;
			
			let currentH = r/petalRadius * hDifference + hue;
			let currentS = r/petalRadius * sDifference + saturation;
			let currentL = r/petalRadius * lDifference + lightness;
			
			
			lepLIB.drawCircle(ctx, x, y, petalDotSize - petalDotSize * r/petalRadius, `hsl(${currentH},${currentS}%,${currentL}%)`);//lepLIB.getRandomHSLRange(hue, saturation, lightness, hMax, sMax, lMax));
		}
		
		//sine wave stuff i decided against
		/*for(let t = 0; t < 2 * Math.PI; t+= Math.PI/60) {

			let r = petalRadius * (Math.sin(petalCount * t) + centerRadius);
			lepLIB.drawLine(ctx,
							centerRadius * Math.cos(t) + centerX, centerRadius * Math.sin(t) + centerY,
							r * Math.cos(t) + centerX, r * Math.sin(t) + centerY, 
							1, lepLIB.getRandomHSLRange(hue,saturation,lightness, hMax, sMax, lMax));
							//lepLIB.getRandomColorRange(red, green, blue, redVariation, greenVariation, blueVariation));
		}*/
	},
	
	generateCenter(ctx, flowerX, flowerY, flowerHeight, centerRadius, seedSize, hue, saturation, lightness, hMax, sMax, lMax) {
		
		let hDifference = hMax - hue;
		let sDifference = sMax - saturation;
		let lDifference = lMax - lightness;
		
		for(let n = 0, r = 0; r <= centerRadius; n++) {
			let a = n * divergence * Math.PI/180;
			r = seedSize * Math.sqrt(n);

			let x = r * Math.cos(a) + flowerX;
			let y = r * Math.sin(a) + flowerY - flowerHeight;

			let currentH = r/centerRadius * hDifference + hue;
			let currentS = r/centerRadius * sDifference + saturation;
			let currentL = r/centerRadius * lDifference + lightness;
			
			lepLIB.drawCircle(ctx, x, y, seedSize, `hsl(${currentH}, ${currentS + lepLIB.getRandomInt(-5, 5)}%, ${currentL + lepLIB.getRandomInt(-5, 5)}%)`);//lepLIB.getRandomHSLRange(hue, saturation, lightness, hMax, sMax, lMax));
		}
	},
	
	generateStem(ctx, flowerX, flowerY, height, width, wiggle, hue, saturation, lightness, hMax, sMax, lMax) {
		
		for(let y = flowerY; y > flowerY - height; y -= width/2) {
						
			let x = Math.sin(y * (2 * Math.PI)/height) * wiggle;
			
			lepLIB.drawCircle(ctx, x + flowerX, y, width, lepLIB.getRandomHSLRange(hue, saturation, lightness, hMax, sMax, lMax));
		}
	},
	
	generateFruit(ctx, fruitRadius, fruitCount, treeX, treeY, treeRadius, treeHeight, leafJitter, hue, saturation, lightness, hMax, sMax, lMax) {
		
		//lepLIB.drawCircle(ctx, treeX, treeY + treeHeight, treeRadius);
		for(let f = 0; f < fruitCount; f++) {
			let n = 0;
			let fruitX = lepLIB.getRandomInt(treeRadius/3, treeRadius + leafJitter) * Math.cos(lepLIB.getRandomInt(0, 360) * Math.PI/180) + treeX;
			let fruitY = lepLIB.getRandomInt(treeRadius/3, treeRadius + leafJitter) * Math.sin(lepLIB.getRandomInt(0, 360) * Math.PI/180) + treeY - treeHeight;
			
			console.log("fruit x: " + fruitX);
			console.log("fruit Y: " + fruitY);
			
			while(n <= fruitRadius) {
				let a = n * divergence * Math.PI/180;
				let r = c * Math.sqrt(n);
				
				let x = r * Math.cos(a) + fruitX;
				let y = r * Math.sin(a) + fruitY;
				
				lepLIB.drawCircle(ctx, x, y, fruitRadius/10, lepLIB.getRandomHSLRange(hue, saturation, lightness, hMax, sMax, lMax));
				n++;
			}
		}
	},
	
	generateTreeTop(ctx, treeX, treeY, treeHeight, treeRadius, leafJitter, hue, saturation, lightness, hMax, sMax, lMax) {
		for(let n = 0, r = 0; r <= treeRadius; n++) {
			let a = n * divergence * Math.PI/180;
			r = treeC * Math.sqrt(n);

			let x = r * Math.cos(a) + treeX + lepLIB.getRandomInt(-1, 1) * leafJitter;
			let y = r * Math.sin(a) + treeY - treeHeight + lepLIB.getRandomInt(-1,1) * leafJitter;

			lepLIB.drawCircle(ctx, x, y, lepLIB.getRandomInt(leafSize, leafJitter!=0?leafJitter:leafSize), lepLIB.getRandomHSLRange(hue, saturation, lightness, hMax, sMax, lMax));
		}
	}
	
};
	
if(window) {
	window["lepLIB"] = lepLIB;	
}
else {
	throw "'window' is not defined";
}
})();
