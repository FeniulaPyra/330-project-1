'use strict'

let canvas = document.querySelector("canvas#flower");
let ctx = canvas.getContext("2d");

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let maxSpeed = 1;
let minSize = 10;

//lepLIB.generateStem(ctx, 160, 160, 160, 15, 5, 30, 80, 30, 40, 90, 40);
//lepLIB.generateTreeTop(ctx, 160,160, 0,50, 0, 100,75,50, 150,100,50);

class HSLColor {
	constructor(hue = 0, saturation = 0, lightness = 0) {
		this.hue = hue;
		this.saturation = saturation;
		this.lightness = lightness;
	}
}

class Stem {
	constructor(height = 0, width = 0, wiggle = 0, minColor = new HSLColor(), maxColor = new HSLColor()) {
		this.height = 0;
		this.width = 0;
		this.wiggle = 0;
		this.minColor = new HSLColor();
		this.maxColor = new HSLColor();
	}
	generate(ctx, x, y) {
		if(this.width <= 0) return;
		lepLIB.generateStem(
			ctx, x, y,
			this.height, this.width,
			this.wiggle,
			this.minColor.hue,
			this.minColor.saturation,
			this.minColor.lightness, 
			this.maxColor.hue,
			this.maxColor.saturation,
			this.maxColor.lightness
		);
	}
}

class Tree {
	constructor(stem, x = 160, y = 320,) {
		this.x = x;
		this.y = y;
		
		this.stem = stem;// new Stem();
		this.leaves = {
			radius: 0,
			jitter: 0,
			minColor: new HSLColor(),
			maxColor: new HSLColor()
		};
		this.fruit = {
			radius: 0,
			amount: 0,
			minColor: new HSLColor(),
			maxColor: new HSLColor()
		};
	}
	
	generate(ctx) {
		//cls(ctx);
		this.stem.generate(ctx, this.x, this.y);
		lepLIB.generateTreeTop(
			ctx, this.x, this.y,
			this.stem.height,
			this.leaves.radius,
			this.leaves.jitter,
			
			this.leaves.minColor.hue,
			this.leaves.minColor.saturation,
			this.leaves.minColor.lightness,
			
			this.leaves.maxColor.hue,
			this.leaves.maxColor.saturation,
			this.leaves.maxColor.lightness
		);
		lepLIB.generateFruit(
			ctx, this.fruit.radius, this.fruit.amount, 
			this.x, this.y, 
			this.leaves.radius, this.stem.height, this.leaves.jitter,
			
			this.fruit.minColor.hue,
			this.fruit.minColor.saturation,
			this.fruit.minColor.lightness,
			
			this.fruit.maxColor.hue,
			this.fruit.maxColor.saturation,
			this.fruit.maxColor.lightness
		);
	}
}
class Flower {
	constructor(stem, x = 160, y = 320) {
		this.x = x;
		this.y = y;
		
		this.stem = stem;
				
		this.petals = {
			radius: 0,
			amount: 0,
			width: 0,
			divergenceAngle: 0,
			maxColor: new HSLColor(),
			minColor: new HSLColor()
		};
		this.seeds = {
			radius: 0,
			seedSize: 0,
			maxColor: new HSLColor(),
			minColor: new HSLColor()
		};
		
	}
	generate(ctx) {
		//ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		//cls(ctx);
		
		this.stem.generate(ctx, this.x, this.y);
				
		lepLIB.generatePetals(
			ctx, this.x, this.y,
			this.stem.height,
			this.petals.radius, this.petals.amount,
			this.petals.divergenceAngle, this.petals.width,
			
			this.petals.minColor.hue,
			this.petals.minColor.saturation,
			this.petals.minColor.lightness,
			
			this.petals.maxColor.hue,
			this.petals.maxColor.saturation,
			this.petals.maxColor.lightness
		);
		lepLIB.generateCenter(
			ctx, this.x, this.y,
			this.stem.height,
			this.seeds.radius, this.seeds.seedSize,
			
			this.seeds.minColor.hue,
			this.seeds.minColor.saturation,
			this.seeds.minColor.lightness,
			
			this.seeds.maxColor.hue,
			this.seeds.maxColor.saturation,
			this.seeds.maxColor.lightness
		);
	}
}


function reGenerate(ctx) {
	//clearFloraEditor(ctx);
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	
	if(isTree)
		tree.generate(ctx);
	else
		flower.generate(ctx);
}
function clearFloraEditor(ctx) {
	
	ctx.save();
	
	//sky
	let sky = ctx.createLinearGradient(0, 0, 0, canvasHeight/2);
	sky.addColorStop(0, "#aaf");
	sky.addColorStop(1, "#bbf");
	
	ctx.fillStyle = sky;
	ctx.beginPath()
	ctx.rect(0, 0, canvasWidth, canvasHeight);
	ctx.closePath();
	ctx.fill();
	
	let land = ctx.createLinearGradient(0,canvasHeight/2,0,canvasHeight);
	land.addColorStop(0, "#beb");
	land.addColorStop(1, "#afa");
	
	ctx.fillStyle = land;
	ctx.beginPath();
	ctx.rect(0, canvasHeight/2, canvasWidth, canvasHeight);
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();
}

let stem = new Stem();
stem.height = 160;
stem.width = 10;
stem.wiggle = 10;
stem.maxColor = new HSLColor(180, 50, 50);
let tree = new Tree(stem);

let flower = new Flower(stem);

//tree or flower stuff
let isTreeCheckbox = document.querySelector("input#isTree");
let isTree = isTreeCheckbox.checked;

isTreeCheckbox.addEventListener("change", function(e){
	isTree = e.target.checked;
	document.querySelector("#petalControls").style.display = !isTree?"block":"none";
	document.querySelector("#seedControls").style.display = !isTree?"block":"none";
	document.querySelector("#leavesControls").style.display = isTree?"block":"none";
	document.querySelector("#fruitControls").style.display = isTree?"block":"none";

	reGenerate(ctx);
});

//stem controls
(function() {
let stemControls = {
	height: document.querySelector("input#stemHeight"),
	width: document.querySelector("input#stemWidth"),
	wiggle: document.querySelector("input#stemWiggle"),
	
	minHue: document.querySelector("input#stemHue"),
	minSat: document.querySelector("input#stemSaturation"),
	minLig: document.querySelector("input#stemLightness"),
	
	maxHue: document.querySelector("input#stemHueVar"),
	maxSat: document.querySelector("input#stemSaturationVar"),
	maxLig: document.querySelector("input#stemLightnessVar"),
	
	varCol: document.querySelector("input#includeMaxStemColor")
}

stem.height = parseInt(stemControls.height.value);
stem.width = parseInt(stemControls.width.value);
stem.wiggle = parseInt(stemControls.wiggle.value);
	
stem.minColor = new HSLColor(
	parseInt(stemControls.minHue.value),
	parseInt(stemControls.minSat.value),
	parseInt(stemControls.minLig.value)
);
	
stem.maxColor = new HSLColor(
	parseInt(stemControls.maxHue.value),
	parseInt(stemControls.maxSat.value),
	parseInt(stemControls.maxLig.value)
);

//tree.generate(ctx);

stemControls.height.addEventListener("change", function(e) {
	stem.height = parseInt(e.target.value);
	reGenerate(ctx);
});
stemControls.width.addEventListener("change", function(e) {
	stem.width = parseInt(e.target.value);
	reGenerate(ctx);
});
stemControls.wiggle.addEventListener("change", function(e) {
	stem.wiggle = parseInt(e.target.value);
	reGenerate(ctx);
});

stemControls.minHue.addEventListener("change", function(e) {
	stem.minColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
stemControls.minSat.addEventListener("change", function(e) {
	stem.minColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
stemControls.minLig.addEventListener("change", function(e) {
	stem.minColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

stemControls.maxHue.addEventListener("change", function(e) {
	stem.maxColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
stemControls.maxSat.addEventListener("change", function(e) {
	stem.maxColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
stemControls.maxLig.addEventListener("change", function(e) {
	stem.maxColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

stemControls.varCol.addEventListener("change", function(e) {
	if(e.target.checked) {
		stemControls.maxHue.disabled = false;
		stemControls.maxSat.disabled = false;
		stemControls.maxLig.disabled = false;
		
		stem.maxColor.hue = parseInt(stemControls.maxHue.value);
		stem.maxColor.saturation = parseInt(stemControls.maxSat.value);
		stem.maxColor.lightness = parseInt(stemControls.maxLig.value);
	}
	else {
		stemControls.maxHue.disabled = true;
		stemControls.maxSat.disabled = true;
		stemControls.maxLig.disabled = true;
		
		stem.maxColor.hue = parseInt(stemControls.minHue.value);
		stem.maxColor.saturation = parseInt(stemControls.minSat.value);
		stem.maxColor.lightness = parseInt(stemControls.minLig.value);
	}
	reGenerate(ctx);
})
})();

//tree stuff🌳
//leaf controls
(function(){
let leafControls = {
	radius:document.querySelector("input#leafRadius"),
	jitter:document.querySelector("input#leafJitter"),
	
	minHue:document.querySelector("input#leafHue"),
	minSat:document.querySelector("input#leafSaturation"),
	minLig:document.querySelector("input#leafLightness"),
	
	maxHue:document.querySelector("input#leafHueVar"),
	maxSat:document.querySelector("input#leafSaturationVar"),
	maxLig:document.querySelector("input#leafLightnessVar"),
	
	varCol:document.querySelector("input#includeMaxLeafColor")
};
tree.leaves.radius = parseInt(leafControls.radius.value);
tree.leaves.jitter = parseInt(leafControls.jitter.value);

tree.leaves.minColor = new HSLColor(
	parseInt(leafControls.minHue.value),
	parseInt(leafControls.minSat.value),
	parseInt(leafControls.minLig.value)
);
tree.leaves.maxColor = new HSLColor(
	parseInt(leafControls.maxHue.value),
	parseInt(leafControls.maxSat.value),
	parseInt(leafControls.maxLig.value)
);

leafControls.radius.addEventListener("change", function(e){
	tree.leaves.radius = parseInt(e.target.value);
	reGenerate(ctx);
});
leafControls.jitter.addEventListener("change", function(e){
	tree.leaves.jitter = parseInt(e.target.value);
	reGenerate(ctx);
});

leafControls.minHue.addEventListener("change", function(e){
	tree.leaves.minColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
leafControls.minSat.addEventListener("change", function(e){
	tree.leaves.minColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
leafControls.minLig.addEventListener("change", function(e){
	tree.leaves.minColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

leafControls.maxHue.addEventListener("change", function(e){
	tree.leaves.maxColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
leafControls.maxSat.addEventListener("change", function(e){
	tree.leaves.maxColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
leafControls.maxLig.addEventListener("change", function(e){
	tree.leaves.maxColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

leafControls.varCol.addEventListener("change", function(e){
	if(e.target.checked) {
		leafControls.maxHue.disabled = false;
		leafControls.maxSat.disabled = false;
		leafControls.maxLig.disabled = false;
		
		tree.leaves.maxColor.hue = parseInt(leafControls.maxHue.value);
		tree.leaves.maxColor.saturation = parseInt(leafControls.maxSat.value);
		tree.leaves.maxColor.lightness = parseInt(leafControls.maxLig.value);
	}
	else {
		leafControls.maxHue.disabled = true;
		leafControls.maxSat.disabled = true;
		leafControls.maxLig.disabled = true;
		
		tree.leaves.maxColor.hue = parseInt(leafControls.minHue.value);
		tree.leaves.maxColor.saturation = parseInt(leafControls.minSat.value);
		tree.leaves.maxColor.lightness = parseInt(leafControls.minLig.value);
	}
	reGenerate(ctx);
});
})();
//fruit controls
(function(){
let fruitControls = {
	radius:document.querySelector("input#fruitRadius"),
	amount:document.querySelector("input#fruitCount"),
	
	minHue:document.querySelector("input#fruitHue"),
	minSat:document.querySelector("input#fruitSaturation"),
	minLig:document.querySelector("input#fruitLightness"),
	
	maxHue:document.querySelector("input#fruitHueVar"),
	maxSat:document.querySelector("input#fruitSaturationVar"),
	maxLig:document.querySelector("input#fruitLightnessVar"),
	
	varCol:document.querySelector("input#includeMaxFruitColor")
}

tree.fruit.radius = parseInt(fruitControls.radius.value);
tree.fruit.amount = parseInt(fruitControls.amount.value);
tree.fruit.minColor = new HSLColor(
	parseInt(fruitControls.minHue.value),
	parseInt(fruitControls.minSat.value),
	parseInt(fruitControls.minLig.value)
);
tree.fruit.maxColor = new HSLColor(
	parseInt(fruitControls.maxHue.value),
	parseInt(fruitControls.maxSat.value),
	parseInt(fruitControls.maxLig.value)
);


fruitControls.radius.addEventListener("change", function(e){
	tree.fruit.radius = parseInt(e.target.value);
	reGenerate(ctx);
});
fruitControls.amount.addEventListener("change", function(e){
	tree.fruit.amount = parseInt(e.target.value);
	reGenerate(ctx);
});

fruitControls.minHue.addEventListener("change", function(e){
	tree.fruit.minColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
fruitControls.minSat.addEventListener("change", function(e){
	tree.fruit.minColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
fruitControls.minLig.addEventListener("change", function(e){
	tree.fruit.minColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

fruitControls.maxHue.addEventListener("change", function(e){
	tree.fruit.maxColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
fruitControls.maxSat.addEventListener("change", function(e){
	tree.fruit.maxColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
fruitControls.maxLig.addEventListener("change", function(e){
	tree.fruit.maxColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

fruitControls.varCol.addEventListener("change", function(e){
	if(e.target.checked) {
		fruitControls.maxHue.disabled = false;
		fruitControls.maxSat.disabled = false;
		fruitControls.maxLig.disabled = false;
		
		tree.fruit.maxColor.hue = parseInt(fruitControls.maxHue.value);
		tree.fruit.maxColor.saturation = parseInt(fruitControls.maxSat.value);
		tree.fruit.maxColor.lightness = parseInt(fruitControls.maxLig.value);
	}
	else {
		fruitControls.maxHue.disabled = true;
		fruitControls.maxSat.disabled = true;
		fruitControls.maxLig.disabled = true;
		
		tree.fruit.maxColor.hue = parseInt(fruitControls.minHue.value);
		tree.fruit.maxColor.saturation = parseInt(fruitControls.minSat.value);
		tree.fruit.maxColor.lightness = parseInt(fruitControls.minLig.value);
	}
	reGenerate(ctx);
});
})();

//flower stuff🌷
//petalControls
(function(){
let petalControls = {
	amount: document.querySelector("input#petalCount"),
	includeCustDiv: document.querySelector("input#includeCustomDivergence"),
	custDiv: document.querySelector("input#customDivergence"),
	radius: document.querySelector("input#petalRadius"),
	width: document.querySelector("input#petalWidth"),
	
	minHue: document.querySelector("input#petalHue"),
	minSat: document.querySelector("input#petalSaturation"),
	minLig: document.querySelector("input#petalLightness"),
	
	maxHue: document.querySelector("input#petalHueVar"),
	maxSat: document.querySelector("input#petalSaturationVar"),
	maxLig: document.querySelector("input#petalLightnessVar"),
	
	varCol: document.querySelector("input#includeMaxPetalColor")
}
flower.petals.amount = parseInt(petalControls.amount.value);
flower.petals.divergenceAngle = (petalControls.includeCustDiv.checked?parseFloat(petalControls.custDiv.value):-1);
flower.petals.radius = parseInt(petalControls.radius.value);
flower.petals.width = parseInt(petalControls.width.value);
flower.petals.minColor = new HSLColor(
	parseInt(petalControls.minHue.value),
	parseInt(petalControls.minSat.value),
	parseInt(petalControls.minLig.value)
);

flower.petals.maxColor = new HSLColor(
	parseInt(petalControls.maxHue.value),
	parseInt(petalControls.maxSat.value),
	parseInt(petalControls.maxLig.value)
);

petalControls.amount.addEventListener("change", function(e) {
	flower.petals.amount = parseInt(e.target.value);
	reGenerate(ctx);
});
petalControls.includeCustDiv.addEventListener("change", function(e) {
	//flower.petals.amount = parseInt(petalcontrols.amount.value);
	if(e.target.checked){
		flower.petals.divergenceAngle = parseFloat(petalControls.custDiv.value);
		petalControls.custDiv.disabled = false;
		petalControls.amount.disabled = true;
	}
	else {
		flower.petals.divergenceAngle = -1;
		petalControls.custDiv.disabled = true;
		petalControls.amount.disabled = false;
	}
	reGenerate(ctx);
});
petalControls.custDiv.addEventListener("change", function(e) {
	flower.petals.divergenceAngle = parseFloat(e.target.value);
	reGenerate(ctx);
});
petalControls.radius.addEventListener("change", function(e) {
	flower.petals.radius = parseInt(e.target.value);
	reGenerate(ctx);
});
petalControls.width.addEventListener("change", function(e) {
	flower.petals.width = parseInt(e.target.value);
	reGenerate(ctx);
});

petalControls.minHue.addEventListener("change", function(e) {
	flower.petals.minColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
petalControls.minSat.addEventListener("change", function(e) {
	flower.petals.minColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
petalControls.minLig.addEventListener("change", function(e) {
	flower.petals.minColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

petalControls.maxHue.addEventListener("change", function(e) {
	flower.petals.maxColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
petalControls.maxSat.addEventListener("change", function(e) {
	flower.petals.maxColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
petalControls.maxLig.addEventListener("change", function(e) {
	flower.petals.maxColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

petalControls.varCol.addEventListener("change", function(e) {
	if(e.target.checked) {
		petalControls.maxHue.disabled = false;
		petalControls.maxSat.disabled = false;
		petalControls.maxLig.disabled = false;
		
		flower.petals.maxColor.hue = parseInt(petalControls.maxHue.value);
		flower.petals.maxColor.saturation = parseInt(petalControls.maxSat.value);
		flower.petals.maxColor.lightness = parseInt(petalControls.maxLig.value);
	}
	else {
		petalControls.maxHue.disabled = true;
		petalControls.maxSat.disabled = true;
		petalControls.maxLig.disabled = true;
		
		flower.petals.maxColor.hue = parseInt(petalControls.minHue.value);
		flower.petals.maxColor.saturation = parseInt(petalControls.minSat.value);
		flower.petals.maxColor.lightness = parseInt(petalControls.minLig.value);
	}
	reGenerate(ctx);
});
})();

//seedControls
(function(){
let seedControls = {
	radius:document.querySelector("input#seedRadius"),
	seedSize:document.querySelector("input#seedSize"),
	
	minHue:document.querySelector("input#seedHue"),
	minSat:document.querySelector("input#seedSaturation"),
	minLig:document.querySelector("input#seedLightness"),
	
	maxHue:document.querySelector("input#seedHueVar"),
	maxSat:document.querySelector("input#seedSaturationVar"),
	maxLig:document.querySelector("input#seedLightnessVar"),
	
	varCol:document.querySelector("input#includeMaxSeedColor")
}

flower.seeds.radius = parseInt(seedControls.radius.value);
flower.seeds.seedSize = parseInt(seedControls.seedSize.value);
flower.seeds.minColor = new HSLColor(
	parseInt(seedControls.minHue.value),
	parseInt(seedControls.minSat.value),
	parseInt(seedControls.minLig.value)
);
flower.seeds.maxColor = new HSLColor(
	parseInt(seedControls.maxHue.value),
	parseInt(seedControls.maxSat.value),
	parseInt(seedControls.maxLig.value)
);

seedControls.radius.addEventListener("change", function(e){
	flower.seeds.radius = parseInt(e.target.value);
	reGenerate(ctx);
});
seedControls.seedSize.addEventListener("change", function(e){
	flower.seeds.seedSize = parseInt(e.target.value);
	reGenerate(ctx);
});

seedControls.minHue.addEventListener("change", function(e){
	flower.seeds.minColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
seedControls.minSat.addEventListener("change", function(e){
	flower.seeds.minColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
seedControls.minLig.addEventListener("change", function(e){
	flower.seeds.minColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

seedControls.maxHue.addEventListener("change", function(e){
	flower.seeds.maxColor.hue = parseInt(e.target.value);
	e.target.style.backgroundColor = `hsl(${parseInt(e.target.value)}, 50%, 70%)`;
	reGenerate(ctx);
});
seedControls.maxSat.addEventListener("change", function(e){
	flower.seeds.maxColor.saturation = parseInt(e.target.value);
	reGenerate(ctx);
});
seedControls.maxLig.addEventListener("change", function(e){
	flower.seeds.maxColor.lightness = parseInt(e.target.value);
	reGenerate(ctx);
});

seedControls.varCol.addEventListener("change", function(e){
	if(e.target.checked) {
		seedControls.maxHue.disabled = false;
		seedControls.maxSat.disabled = false;
		seedControls.maxLig.disabled = false;
		
		flower.seeds.maxColor.hue = parseInt(seedControls.maxHue.value);
		flower.seeds.maxColor.saturation = parseInt(seedControls.maxSat.value);
		flower.seeds.maxColor.lightness = parseInt(seedControls.maxLig.value);
	}
	else {
		seedControls.maxHue.disabled = true;
		seedControls.maxSat.disabled = true;
		seedControls.maxLig.disabled = true;
		
		flower.seeds.maxColor.hue = parseInt(seedControls.minHue.value);
		flower.seeds.maxColor.saturation = parseInt(seedControls.minSat.value);
		flower.seeds.maxColor.lightness = parseInt(seedControls.minLig.value);
	}
	reGenerate(ctx);
});
})();

reGenerate(ctx);

//world generation stuff 🌎
let worldCanvas = document.querySelector("canvas#world");
worldCanvas.width = window.innerWidth;//outerWidth;
worldCanvas.height = window.innerHeight;

let worldWidth = worldCanvas.width;
let worldHeight = worldCanvas.height;
let worldHorizon = worldCanvas.height/3;

let worldCtx = worldCanvas.getContext("2d");

let floraList = [];

let disabledFloraList = document.querySelector("#disabledFloraList");
let enabledFloraList = document.querySelector("#enabledFloraList");

let disabledFlora = Array.from(disabledFloraList.querySelectorAll("option"));
let enabledFlora = Array.from(enabledFloraList.querySelectorAll("option"));

let generatingFlora = [];
let generatingFloraPos = [];

let saveButton = document.querySelector("#saveFlora");
saveButton.addEventListener("click", function(e) {

	//floraList.push(canvas.toDataURL("image/png"));
	//let floraOption = `<option value=${canvas.toDataURL("image/png")}>Flora</option>`;
	//enabledFloraList.innerHtml += floraOption;
	let floraOption = document.createElement("option");
	floraOption.value = canvas.toDataURL("image/png");
	//makes a random id, idk what else to do rn.
	floraOption.innerHTML = "Flora" + lepLIB.getRandomInt(0, 9999);
	enabledFloraList.appendChild(floraOption);
	updateFloraLists();
});

//updates lists of enabled and disabled flora
/*disabledFloraList.addEventListener("change", function (e) {
	disabledFlora = Array.from(disabledFloraList.querySelectorAll("option"));
});
enabledFloraList.addEventListener("change", function (e) {
	enabledFlora = Array.from(enabledFloraList.querySelectorAll("option"));
});*/

let disableFloraButton = document.querySelector("#disableFlora");
let enableFloraButton = document.querySelector("#enableFlora");
//let selectedFlora = htmlFloraList.querySelector("[selected]");
disableFloraButton.addEventListener("click", function(e) {
	
	let floraToDisable = enabledFlora[document.querySelector("#enabledFloraList").selectedIndex];
	disabledFloraList.appendChild(floraToDisable);
	//enabledFloraList.removeChild(floraToDisable);
	updateFloraLists();
	
});
enableFloraButton.addEventListener("click", function(e) {
	let floraToEnable = disabledFlora[document.querySelector("#disabledFloraList").selectedIndex];
	enabledFloraList.appendChild(floraToEnable);
	//disabledFloraList.removeChild(floraToEnable);
	updateFloraLists();
});

function updateFloraLists() {
	enabledFlora = Array.from(enabledFloraList.querySelectorAll("option"));
	disabledFlora = Array.from(disabledFloraList.querySelectorAll("option"));
}

function clearWorld() {
	worldCtx.clearRect(0,0, worldWidth, worldHeight);
	worldCtx.save();
	
	//sky
	let sky = worldCtx.createLinearGradient(0, 0, 0, worldHorizon);
	sky.addColorStop(0, "#aaf");
	sky.addColorStop(1, "#bbf");
	
	worldCtx.fillStyle = sky;
	worldCtx.beginPath()
	worldCtx.rect(0, 0, worldWidth, worldHeight);
	worldCtx.closePath();
	worldCtx.fill();
	
	let land = ctx.createLinearGradient(0, worldHorizon, 0, worldHeight);
	land.addColorStop(0, "#beb");
	land.addColorStop(1, "#afa");
	
	worldCtx.fillStyle = land;
	worldCtx.beginPath();
	worldCtx.rect(0, worldHorizon, worldWidth, worldHeight);
	worldCtx.closePath();
	worldCtx.fill();
	
	worldCtx.restore();
}

function animateWorld() {
	requestAnimationFrame(animateWorld);

	//possibly adds new flora;
	let pickedFloraID = lepLIB.getRandomInt(0, enabledFlora.length + 50);	
	if(pickedFloraID < enabledFlora.length) {
		
		console.log("adding flora instance");
		
		//creates image tag to hold flora img data
		let pickedFlora = new Image;
		
		//gets a random y position for the new flower to generate
		let pickedFloraY = lepLIB.getRandomInt(worldHorizon, worldHeight);
		
		//sets the source image of the img tag
		pickedFlora.src = enabledFlora[pickedFloraID].value//floraList[pickedFloraID];

		//the flora and its x and y positions
		let floraInfo = {img: pickedFlora, x: 0, y: pickedFloraY};
		
		//console.log({img: pickedFlora, x: 0, y: pickedFloraY});
		generatingFlora.push({img: pickedFlora, x: 0, y: pickedFloraY});

		//adds the newly selected flora img tag to the generating flowers list
		//generatingFlora.push(pickedFlora);
		//adds the corresponding points of the flora to the list of positions
		//generatingFloraPos.push([0, pickedFloraY]);
	}

	generatingFlora.sort(function(a,b){return a.y - b.y;});
	clearWorld();
	//moves the flora relative to their y position
	for(let i = 0; i < generatingFlora.length; i++) {
		let currentFlora = generatingFlora[i];
		
		//adjusts the size of the flora depending on how close it is to the viewer
		let floraSize = (currentFlora.y-worldHorizon)/(worldHeight-worldHorizon) * (currentFlora.img.width - minSize) + minSize;
		
		//moves the flora across the x axis according to its position on the y axis
		currentFlora.x += maxSpeed * ((currentFlora.y)/(worldHeight - worldHorizon));
		
		//draws the image
		worldCtx.drawImage(currentFlora.img, 
						   currentFlora.x - floraSize, 
						   currentFlora.y - floraSize, 
						   floraSize, floraSize);
		
		//deletes offscreen floras
		if(currentFlora.x > worldWidth + floraSize) {
			generatingFlora.splice(i, 1);
			//generatingFloraPos.splice(i, 1);
		}
		
	}
}

document.querySelector("#hideUI").addEventListener("change", function(e) {
	let checked = e.target.checked;
	let ui = document.querySelector("#flowerGeneration");
	ui.style.display = checked?"none":"block";
});

animateWorld();