// Verlet Drawing
"use strict";
window.onload = function() {
	console.clear();
	verletDrawing()
};
function verletDrawing() {
	const verlet = new Verlet();
	verlet.init(1000,500,'#c',0.0,0.99,1);
	const canvas = verlet.canvas,
		  ctx = canvas.getContext('2d'),
		  container = document.getElementsByClassName('container')[0];

	function resizeCanvas() {
		let containerHeight = container.getBoundingClientRect().height,
			containerWidth = container.getBoundingClientRect().width;
		canvas.height = containerHeight - 41;
		canvas.width = containerWidth - 2;
		verlet.osCanvas.width = canvas.width;
		verlet.osCanvas.height = canvas.height;
	}
	resizeCanvas();
	window.onresize = () => {
		resizeCanvas();
	}
	
	/* ======== The Real Code ======== */
	/*
	 * ========= All Arrays ========= 
	 * Arrays Are Awesome
	 */
	let points = [],
		constrains = [],
		forms = [],
		trig = [],
		tmpCir = [],
		formsArray = [],
		handleArray = [],
		tmpHandleArray = [];
	
	/*
	 * ========= Redo And Undo System =========
	 */
	let undoArray = [];	
	/* ==== Set Undo Redo Steps ==== */
	const MAX_UNDO_REDO_STEPS = Infinity;
	const UNDO_REDO_JUMP = 1;    
	let zCount = null;
	let yCount = null;
	let jump = 0;
	function updateUndoRedo() {
		jump++;
		let newPoints = [];
		let newCons = [];
		let newForms = [];
		
		if(jump === UNDO_REDO_JUMP) {
			for (let p = 0; p < points.length; p++) {
				let po = points[p];
				newPoints.push([po.x,po.y,po.oldx,po.oldy,po.pinned,po.color]);
			}
			for (let c = 0; c < constrains.length; c++) {
				newCons.push(constrains[c].id);
			}
			for (let f = 0; f < forms.length; f++) {
				newForms.push(forms[f]);
			}
			undoArray.push([newPoints,newCons,newForms]);
			if(undoArray.length > MAX_UNDO_REDO_STEPS) {
				undoArray.shift();
				zCount = undoArray.length;
				yCount = 0;
			}
			zCount = undoArray.length;
			yCount = 0;
			jump = 0;
		}
	}
	function initUndoRedo() {
		document.body.addEventListener('keydown',function(e) {
			if(e.which === 17) {
				document.body.addEventListener('keydown',function(e) {
					doUndo(e)
					doRedo(e);
				});
			}
		})
	};

	function doUndo(e) {
		if(e.which === 90) { //Z
			zCount--;
			if(zCount < 0) {
				zCount = 0;
			}
			points = [];
			constrains = [];
			forms = [];
			try {
				verlet.create(undoArray[zCount][0],points); 
				verlet.clamp(undoArray[zCount][1],constrains,points);
				forms = undoArray[zCount][2];
			} catch (ex) {
				console.log('Undo Error :' + ex);
			}
		}
		verlet.Interact.move(points,'white');
	}
	function doRedo(e) {
		if(e.which === 89) { //Y
			yCount = zCount++;
			if(yCount > undoArray.length) {
				zCount = undoArray.length - 2;
			}
			points = [];
			constrains = [];
			forms = [];
			try {
				verlet.create(undoArray[yCount][0],points); 
				verlet.clamp(undoArray[yCount][1],constrains,points);
				forms = undoArray[yCount][2];
			} catch (ex) {
				console.log('Redo Error :' + ex);
				zCount = undoArray.length-1;
			}
		}
		verlet.Interact.move(points,'white');
	}
	initUndoRedo();


	/* ======== UI Variables ======== */
	const PhysicsAccuracy = _('Iterrations'),
		  stiffness = _('stiffness'),
		  bounce = _('bounce'),
		  friction = _('friction'),
		  dotOpt = _('dots'),
		  LineOpt = _('lines'),
		  LineHiddenOpt = _('hiddenlines'),
		  IndexOpt = _('pointIndex'),
		  shapeOpt = _('shapes'),
		  gridOpt = _('gridguid'),
		  gridGap = _('gridgap'),
		  grav = _('gravity'),
		  exportbtn = _('export'),
		  loadModelpoint = _('loadmodelpoint'),
		  shapecolor = _('shapecolor');

	/*Create Variables*/
	const box = {
		X 		: _('boxX'),
		Y 		: _('boxY'),
		W 		: _('boxW'),
		H 		: _('boxH'),
		create 	: _('createBox'),
		draw 	: _('drawBox'),
		select 	: _('selectcreate')
	}
	const rope = {
		X 		: _('ropeX'),
		Y 		: _('ropeY'),
		GAP 	: _('ropeGap'),
		SEGS 	: _('ropeSegs'),
		draw 	: _('drawRope'),
		create 	: _('createrope')
	}
	const cloth = {
		X 		: _('clothX'),
		Y 		: _('clothY'),
		GAP 	: _('clothGap'),
		SEGS 	: _('clothSegs'),
		RATIO 	: _('clothPinRatio'),
		create 	: _('createcloth')
	}
	const hexa = {
		X 		: _('hexaX'),
		Y 		: _('hexaY'),
		RADIUS 	: _('hexaRadius'),
		SIDES 	: _('hexaSides'),
		SLICE1 	: _('hexaSlice1'),
		SLICE2 	: _('hexaSlice2'),
		CENTER  : _('hexaCenter'), 
		create 	: _('createhexa')
	}
	const map = {
		X 		: _('mapX'),
		Y 		: _('mapY'),
		SIZEX 	: _('mapSizeX'),
		SIZEY 	: _('mapSizeY'),
		DATA 	: _('mapData'),
		create 	: _('createmap')
	}
	const beam = {
		X 		: _('beamX'),
		Y 		: _('beamY'),
		W 		: _('beamW'),
		H 		: _('beamH'),
		SEGS 	: _('beamSegs'),
		create 	: _('createbeam')
	}
	
	/* ======== UI Events ======== */
	box.create.onclick = () => {
		(box.select.value === 'box') ? createBox() : createTri();
	};
	rope.create.onclick = () => {
		createRope();
	};
	cloth.create.onclick = () => {
		createCloth();
	}
	hexa.create.onclick = () => {
		createHexagon();
	};
	map.create.onclick = () => {
		createMap();
	};
	beam.create.onclick = () => {
		createBeam();
	};
	/*Load And Export*/
	exportbtn.onclick = () => {
		exportModel(points,constrains,forms);
	};
	loadModelpoint.onclick = () => {
		forms = [];
		loadFile(points,constrains,forms,verlet);
	};
	/* ======= Objects ======= */
	// verlet.Poly.bind(points,constrains);
	// verlet.Poly.beam({
	// 	x : 20, y :100,
	// 	width : 50, height : 50,
	// 	segs : 10,
	// });

	// console.log(verlet.tearArray);
	// verlet.Poly.box({
	// 	x : 50, y : 50,
	// 	width : 100, height : 100,
	// });
	function createBox() {
			verlet.Poly.box({
				x : parseInt(box.X.value),
				y : parseInt(box.Y.value),
				width : parseInt(box.W.value),
				height : parseInt(box.H.value)
			},points,constrains);
		updateUndoRedo();
	}
	function drawBox(posx,posy,w,h,p,c) {
		if(box.draw.checked === true) {
			if (box.select.value !== 'box') {
				verlet.Poly.triangle({
					x : posx,
					y : posy,
					width : w,
					height : h
				},p,c);
			} else {
				verlet.Poly.box({
					x : posx,
					y : posy,
					width : w,
					height : h
				},p,c);	
			}
		}
		updateUndoRedo();
	}
	function createTri() {
		verlet.Poly.triangle({
			x : parseInt(box.X.value),
			y : parseInt(box.Y.value),
			width : parseInt(box.W.value),
			height : parseInt(box.H.value)
		},points,constrains);
		updateUndoRedo();
	}
	function createRope() {
		verlet.Poly.rope({
			x : parseInt(rope.X.value),
			y : parseInt(rope.Y.value),
			gap : parseInt(rope.GAP.value),
			parts :  parseInt(rope.SEGS.value),
		},points,constrains);
		updateUndoRedo();
	}
	function drawRope(posx,posy,w,h,p,c) {
		verlet.Poly.rope({
			x : (posx+w),
			y : (posy+h),
			gap : h,
			parts :  w/12,
		},p,c);
		updateUndoRedo();
	}
	function createCloth() {
		verlet.Poly.cloth({
			x : parseInt(cloth.X.value),
			y : parseInt(cloth.Y.value),
			gap : parseInt(cloth.GAP.value),
			segs :  parseInt(cloth.SEGS.value),
			pinRatio : parseInt(cloth.RATIO.value),
			tearable : false
		},points,constrains);
		updateUndoRedo();
	}
	function createHexagon() {
		verlet.Poly.hexagon({
			x : parseInt(hexa.X.value),
			y : parseInt(hexa.Y.value),
			radius : parseInt(hexa.RADIUS.value),
			sides : parseInt(hexa.SIDES.value),
			slice1 :  parseInt(hexa.SLICE1.value),
			slice2 :  parseInt(hexa.SLICE2.value),
			center : hexa.CENTER.checked
		},points,constrains);
		updateUndoRedo();
	}
	function createBeam() {
		verlet.Poly.beam({
			x : parseInt(beam.X.value),
			y : parseInt(beam.Y.value),
			width : parseInt(beam.W.value),
			height : parseInt(beam.H.value),
			segs : parseInt(beam.SEGS.value),
		},points,constrains);
		updateUndoRedo();
	}
	function createMap() {
		let raw = map.DATA.value;
		let splitRaw = map.DATA.value.split(",");
		let parsedRaw = '';
		for(let i = 0; i < splitRaw.length; i++) {
			parsedRaw += "\"" + splitRaw[i] + "\",";
		}
		let toBeParsed = "[" + parsedRaw.replace(/,$/,'').replace(/\n/img,'') + "]";
		
		let val = JSON.parse(toBeParsed);
		verlet.Poly.map({
			x : parseInt(map.X.value),
			y : parseInt(map.Y.value),
			sizeX : parseInt(map.SIZEX.value),
			sizeY : parseInt(map.SIZEY.value),
			data : val
		},points,constrains);
		updateUndoRedo();
	}

	/*
	 * ========= Miscellaneous =========
	 */	
	function _(id) {
		return document.getElementById(id);
	}
	/*Right Click Prevent*/
	document.body.oncontextmenu = (e) => { e.preventDefault() };
	const mouse = {
		x : 0, y : 0
	}
	canvas.addEventListener('mousemove',function(e) {
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	});
	function showTooltip(e,id){
		let ttid = document.getElementById(id);
		ttid.style.opacity = '1';
		ttid.style.left = e.x + 17 + 'px';
		ttid.style.top = e.y - 30 + 'px';
		ttid.style.backgroundColor = shapecolor.value;
	}
	function hideTooltip(id) {
		let ttid = document.getElementById(id);
		ttid.style.opacity = '0';
	}
	function colDetect(x,y,circle) {
		let dx = x - circle.x;
		let dy = y - circle.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	function drawGrid() {
		/*Grid*/
		if(gridOpt.checked === true) {
			let gap = parseInt(gridGap.value);
			let gridX = 0;
			let gridY = 0;
			ctx.beginPath();
			ctx.strokeStyle = 'limegreen';
			for(let i = 0; i < canvas.width; i++) {
				gridX += gap;
				ctx.moveTo(gridX,canvas.width);
				ctx.lineTo(gridX,0);
			}
			for(let i = 0; i < canvas.height; i++) {
				gridY += gap;
				ctx.moveTo(canvas.width,gridY);
				ctx.lineTo(0,gridY);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
	/*
	 * FPS AND INTERACT
	 */
	let lastframe;
	let fps;
	let getFps;
	let frameTime;
	function getFrameRate() {
		if(!lastframe) {
			lastframe = performance.now();
			fps = 0;
			return;
		}
		let delta = (performance.now() - lastframe) / 1000;
		frameTime = (performance.now() - lastframe);
		lastframe = performance.now();
		fps = 1/delta;
		return Math.round(fps);
	}
	/* Get Range Slider Values And Display It */
	function getVal(el) {
		el.onchange = function() {
			this.nextElementSibling.innerText = this.value;
		}
	}
	getVal(grav); 
	getVal(bounce); 
	getVal(stiffness); 
	getVal(friction);
	getVal(PhysicsAccuracy);
	getVal(gridGap);


	/*
	 * ========== Core Event Listeners And Logic ==========
	 * 
	 */
	
	/* Pinning Constrains And Line Visisbility */
	const pinPoint = _('pin-point'),
		  lineHidden = _('line-hidden'),
		  autoJoin = _('auto-join'),
		  autoCreate = _('enableautocreate');

	let isRedActive = false;
	let isLineHidden = false;
	let isAutoJoin = false;
	let isAutoCreate = false;

	redAlert(pinPoint,'onclick', () => isRedActive = (isRedActive === false) ? true : false);
	redAlert(lineHidden,'onclick', () => isLineHidden = (isLineHidden === false) ? true : false);
	redAlert(autoJoin,'onclick', () => isAutoJoin = (isAutoJoin === false) ? true : false);
	redAlert(autoCreate,'onchange', () => {
		let ico = autoCreate.parentElement.parentElement.parentElement.parentElement;
		ico.classList.toggle('button-active');
	})
	function redAlert(elm,evt,fun) {
		elm[evt] = function() {
			elm.classList.toggle('button-active');
			if(fun) {
				fun()
			}
		};
	}
	
	/*
	 *	 CORE LOGIC
	 */
	initCore();
	function initCore() {
		/* Key Handling */
		document.body.addEventListener('keydown', keyhandling);
		document.body.addEventListener('keyup', removekeyhandling);
		function keyhandling(e) {
			console.log(e.which);
			switch (e.which) {
				case 16://Shift
					canvas.addEventListener('mousedown', getPoint);
					canvas.style.cursor = 'pointer';
					break;
				case 67://C
					canvas.addEventListener('mousedown', createPoint);
					canvas.style.cursor = 'crosshair';
					break;
				case 35://End
					//Delete The Point
					points.splice(verlet.handleIndex, 1);
					for (let i = 0; i < forms.length; i++) {
						if (forms[i].id.indexOf(verlet.handleIndex) !== -1) {
							forms[i].id.splice(0, 1);
						}
						forms[i].paths.splice(0, 1);
					}
					updateUndoRedo();
					break;
				case 81://Q
					if (handleArray.length > 0) {
						let hidden = false;
						if (isLineHidden == true) {
							hidden = true;
						}
						if (isAutoJoin === false) {
							for (let k = 0; k < handleArray.length; k++) {
								handleArray[k][2] = hidden;
								verlet.clamp([handleArray[k]], constrains, points);
							}
						} else { //Auto Join By Index 
							//Increment And Joint i++
							let tmpAuto = [];
							while (handleArray.length > 1) {
								handleArray.shift();
							}
							let start = handleArray[0][0], end = handleArray[0][1];
							let min = Math.min(start, end), max = Math.max(start, end) + 1;
							for (let i = min; i < max; i++) {
								tmpAuto.push([
									i, (i + 1) % max,
									hidden
								]);
							}
							tmpAuto.pop();
							verlet.clamp(tmpAuto, constrains, points);
							tmpAuto.splice(0, tmpAuto.length);
						}
						tmpHandleArray = [];
						handleArray = [];
						first = 0;
						for (let i = 0; i < points.length; i++) {
							if (points[i].color !== 'crimson') {
								points[i].color = null;
							}
						}
					}
					break;
				case 70://F
					canvas.addEventListener('mousedown', addToForms);
					showTooltip(mouse, 'colorIndicator');
					canvas.style.cursor = 'alias';
					break;
				case 46://Del
					updateUndoRedo();
					for (let i = 0; i < constrains.length; i++) {
						while (constrains[i].id.indexOf(verlet.handleIndex) !== -1) {
							constrains.splice(i, 1);
							// break;
						}
					}
					break;
				case 17: //CTRL 
					document.addEventListener('keydown',ctrlSave);
					break;
			}
		}
		function removekeyhandling(e) {
			switch (e.which) {
				case 16://Shift
					canvas.removeEventListener('mousedown', getPoint);
					canvas.style.cursor = 'default';
					tmpHandleArray = [];
					handleArray = [];
					first = 0;
					for (let i = 0; i < points.length; i++) {
						if (points[i].color !== 'crimson') {
							points[i].color = null;
						}
					}
					break;
				case 67://C
					canvas.removeEventListener('mousedown', createPoint);
					canvas.style.cursor = 'default';
					break;
				case 70://F	
					if (formsArray.length > 2) {
						createForms();
					}
					canvas.removeEventListener('mousedown', addToForms);
					hideTooltip('colorIndicator');
					canvas.style.cursor = 'default';
					for (let i = 0; i < points.length; i++) {
						points[i].color = null;
					}
					updateUndoRedo();
				case 17: //CTRL 
					document.removeEventListener('keydown',ctrlSave);
					break;

			}
		}
		
		/*
		 * ======= Core Functionalities =======
		 */
		
		function ctrlSave(e) {
			if(e.which === 83) {
				e.preventDefault();
				exportModel(points,constrains,forms,true);
			}
		}
			
		/* Create Points */
		let autoCreateVal = _('autocreatevalue');
		// TODO:
		//AUTO CREATE FIX
		function createPoint(e) {
			let pinned;
			let color;
			pinned = (isRedActive) ? true : false;
			color = (isRedActive) ? 'crimson' : null;
			let mx = e.offsetX;
			let my = e.offsetY;
			if (e.which === 1) {
				trig.push([mx, my, mx, my, pinned, color]);
				tmpCir.push({ x: mx, y: my });
			}
			if (e.which === 3) {
				if (!isAutoCreate) {
					tmpCir = [];
					verlet.create(trig, points);
					trig = [];
				} else {
					// let tmpTrig = [];
					// let dx = tmpCir[1].x - tmpCir[0].x;
					// let dy = tmpCir[1].y - tmpCir[0].y;
					// let diff = Math.sqrt(dx*dx + dy*dy);
					// let tmpX = tmpCir[0].x;
					// let tmpY = tmpCir[0].y;
					// for(let i = 0; i < parseInt(autoCreateVal.value); i++) {
					// 	if(dx > 0) {
					// 		tmpX += 5;
					// 	} else {
					// 		tmpX -= 5;
					// 	}
					// 	if(dy > 0) {
					// 		tmpY += 5;
					// 	} else {
					// 		tmpY -= 5;
					// 	}
					// 	tmpTrig.push([tmpX,tmpY,tmpX,tmpY,pinned,color]);
					// }
					// verlet.create(tmpTrig,points);
					// trig = [];
				}
			}
			updateUndoRedo();
		}
		/*Get Offsets For Creating Constrains*/
		let first = 0;
		function getPoint(me) {
			for (let i = 0; i < points.length; i++) {
				if (colDetect(me.offsetX, me.offsetY, points[i]) < 10) {
					first++;
					tmpHandleArray.push(i);
					if (first !== 1) {
						tmpHandleArray.push(i);
					}
					if (points[i].color !== 'crimson') {
						points[i].color = 'greenyellow';
					}
				}
			}
			let modTwo = 0;
			handleArray = [];
			for (let j = 0; j < tmpHandleArray.length; j++) {
				modTwo++;
				modTwo = modTwo % 2;
				if (modTwo !== 0) {
					handleArray.push([tmpHandleArray[j], tmpHandleArray[(j + 1) % tmpHandleArray.length]]);
				}
			}
			handleArray.pop();
			updateUndoRedo();
		}
		/* Get Points For Making Shapes */
		function addToForms(me) {
			for (let i = 0; i < points.length; i++) {
				if (colDetect(me.offsetX, me.offsetY, points[i]) < 10) {
					formsArray.push(i);
					points[i].color = shapecolor.value;
				}
			}
		}
		/*Create Shapes*/
		function createForms() {
			verlet.shape(formsArray, forms, points, shapecolor.value);
			formsArray.splice(0, formsArray.length);
			updateUndoRedo();
		}
	}

	/*
	* **** ANIMATE LOOP ****
	* 
	*/
    let drag_DrawBox = new drag(verlet,points,constrains);
		drag_DrawBox.initDrag(drawBox);
    let drag_drawRope = new drag(verlet,points,constrains);
		drag_drawRope.initDrag(drawRope);
		
	/* Toggle Render Engines*/
	let isRenderShapes;
	let isRenderDots;
	let isRenderLines;
	let isRenderHiddenLines;
	let isRenderPointIndex;

	verlet.Interact.move(points,'white');

	/* ====== ANIMATE ====== */
	function animate() {
		verlet.clear();

		drag_DrawBox.drawTmpBox(box.draw.checked);
		drag_drawRope.drawTmpBox(rope.draw.checked);
		
		verlet.gravity = parseFloat(grav.value) || 0;
		verlet.bounce = parseFloat(bounce.value) || 0;
		verlet.friction = parseFloat(friction.value) || 1;
		verlet.stiffness = parseFloat(stiffness.value) || 1;
		
		/* Physics Update */
		verlet.superUpdate(points,constrains,PhysicsAccuracy.value,{hoverColor : 'white'});
	
		(shapeOpt.checked === true) ? verlet.renderShapes(forms) : false;
		isRenderLines = LineOpt.checked;
		isRenderHiddenLines = LineHiddenOpt.checked;
		isRenderPointIndex = IndexOpt.checked;
		isRenderDots = dotOpt.checked;
		
		verlet.superRender(points,constrains,{
			renderDots : isRenderDots,
			renderLines : isRenderLines,
			renderHiddenLines : isRenderHiddenLines,
			renderPointIndex : isRenderPointIndex,
			preset : 'shadowBlue'
		})

		drawGrid();
		/* Temp Circles */
		if(tmpCir.length > 0) {
			for (let i = 0; i < tmpCir.length; i++) {
				verlet.Draw.arc(tmpCir[i].x,tmpCir[i].y,5,'gray',1,true);
			}
		}
		
		getFps = getFrameRate();
		initUI.debug(points,constrains,getFps,verlet);
		requestAnimationFrame(animate);
	}
	animate();
	/*END ANIMATE*/

	initLivePreviews();
	function initLivePreviews() {
		/*
		* **** LIVE PREVIEW FOR HEXAGON****
		* 
		*/
		const isLiveEnabled = _('hexagon-live');
		const isTrue = isLiveEnabled.parentElement.parentElement;
		isTrue.parentElement.onclick = function(){
			liveHexagon();
		}
		function liveHexagon() {
			let livePreview = new Verlet();
			livePreview.init(200,200,'#hexagon-live',0,0);
			let hexaLivePoints = [],
				hexaLiveCons = [];
			livePreview.Poly.hexagon({
				x : 100,
				y : 100,
				radius : 90,
				sides : parseInt(hexa.SIDES.value),
				slice1 :  parseInt(hexa.SLICE1.value),
				slice2 :  parseInt(hexa.SLICE2.value),
				center  : hexa.CENTER.checked, 
			},hexaLivePoints,hexaLiveCons);

			function live() {
				livePreview.clear();

				livePreview.renderDots(hexaLivePoints,5,'white');
				livePreview.renderLines(hexaLiveCons,0.5,'deepskyblue');
				livePreview.superUpdate(hexaLivePoints,hexaLiveCons,10);

				if(isTrue.style.opacity == '1') {
					requestAnimationFrame(live);
				} else {
					return;
				}
			}
			live();
		}

		/*
		* **** LIVE PREVIEW FOR MAP ****
		* 
		*/
		const isMapLiveEnabled = _('map-live');
		const isMapTrue = isMapLiveEnabled.parentElement.parentElement;
		isMapTrue.parentElement.onkeyup = function() {
			liveData();
		}
		isMapTrue.parentElement.onclick = function() {
			liveData();
		}
		function liveData() {
			let livePreview = new Verlet();
			livePreview.init(235,200,'#map-live',0,0);
			let MapPoints = [],
				MapCons = [];
			let raw = map.DATA.value;
			let splitRaw = map.DATA.value.split(",");
			let parsedRaw = '';
			for(let i = 0; i < splitRaw.length; i++) {
				parsedRaw += "\"" + splitRaw[i] + "\",";
			}
			let toBeParsed = "[" + parsedRaw.replace(/,$/,'').replace(/\n/img,'') + "]";
			
			let val = JSON.parse(toBeParsed);
			livePreview.Poly.map({
				x : 55,
				y : 50,
				sizeX : 15,
				sizeY : 10,
				data : val
			},MapPoints,MapCons);

			function liveMap() {
				livePreview.clear();
				livePreview.renderDots(MapPoints,5,'white');
				livePreview.renderLines(MapCons,0.5,'deepskyblue');
				livePreview.superUpdate(MapPoints,MapCons,10);

				if(isMapTrue.style.opacity == '1') {
					requestAnimationFrame(liveMap);
				} else {
					return;
				}
			}
			liveMap();
		}
	} //InitLivePreviews
}//verletDrawing;
