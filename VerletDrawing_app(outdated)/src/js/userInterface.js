// Verlet-Drawing UI
"use strict";
initUI();
function initUI() {
	function toggle(elm, prop, first, last, only) {
		if (!only) {
			if (elm.style[prop] == last || !elm.style[prop]) {
				elm.style[prop] = first;
			} else {
				elm.style[prop] = last;
			}
		} else {
			elm.style[prop] = first;
		}
	}

	/*
	 * 	Drop Down Menu
	 */
	let isDown = false;
	function dropdown() {
        const toolbar = document.getElementsByClassName('toolbar')[0];
        const ddButton = document.getElementsByClassName('icon');
		const ddContent = document.getElementsByClassName('dropdown-content');
		const inputs = document.querySelectorAll('input[type="number"],input[type="text"]');
		let index = null;
		let isFocus = false;
		let isMouseInside = false;
		let timer = null;
        toolbar.addEventListener('mousedown',function(e) {
			isDown = true;
            if(e.target.className.indexOf('icon') == 0) {
                let target = e.target;
                if (target.nextElementSibling) {
                    target.onclick = function () {
						let nxt = this.nextElementSibling;
						index = this;
                        onlyShowOne();
                        toggle(nxt, 'pointerEvents', 'all', 'none', false);
						toggle(nxt, 'opacity', '1', '0', false);
                    };
                    target.nextElementSibling.onmouseover = function () {
                        resetTimer();
						isMouseInside = true;
						isDown = true;
                    };
                    target.nextElementSibling.onmouseout = function () {
						initTimer(this);
						isDown = true;
                        isMouseInside = false;
                    };
                }
			}
		});
		for (let k = 0; k < inputs.length; k++) {
			inputs[k].onfocus = function () {
				isFocus = true;
			};
			inputs[k].onblur = function () {
				isFocus = false;
				if (!isMouseInside) {
					initTimer(index.nextElementSibling);
				}
			}
		}
		function initTimer(e) {
			let _self = e;
			if (!isFocus) {
				timer = window.setTimeout(function () {
					hideDropdown(_self);
					isDown = false;
				}, 400);
			}
		}
		function resetTimer() {
			window.clearTimeout(timer);
		}
		function hideDropdown(e) {
			e.style.opacity = '0';
			e.style.pointerEvents = 'none';
		}
		function onlyShowOne() {
			for (let j = 0; j < ddContent.length; j++) {
				ddContent[j].style.opacity = '0';
				ddContent[j].style.pointerEvents = 'none';
			}
		}
	}

	dropdown();

	/*
	 * 	File Info Viwer
	 */
	let fileinfo = document.getElementById('fileinfo');
	let file = document.getElementById('loadPoints');
	file.onchange = function () {
		fileinfo.innerHTML = "<p>File Name : " + this.files[0].name + "</p>" +
			"<p>File Size : " + Math.ceil(this.files[0].size / 1024) + "kb</p>"
	}

	/*
	 * Debug Panel
	 */
	function debug(dots, cons, fps, verlet) {
		const debugEnb = document.getElementById('debug-enable'),
			debugPanel = document.getElementById('debugpanel'),
			debugOut = document.getElementById('debug-out'),
			consOut = document.getElementById('debug-out-cons');
		debugOut.innerText = ' Points : ' + dots.length
			+ ' | Constrains : ' + cons.length
			+ ' | Handle Index : ' + verlet.handleIndex
			+ ' | FPS : ' + fps;
	}

	function fullSrc() {
		const doc = document.getElementById('fs');
		if (doc.webkitRequestFullScreen) {
			doc.webkitRequestFullScreen();
		}
		if (doc.mozRequestFullScreen) {
			doc.mozRequestFullScreen();
		}
	}

	/*
	 * 	Woo Slider
	 */
	function initWoo() {
		const child = document.getElementsByClassName('dd-button');
		for (let i = 0; i < child.length; i++) {
			child[i].addEventListener('mouseover', wooSlider);
		}
	}
	initWoo();
	function wooSlider() {
		const slider = document.getElementById('woo');
		const x = this.getBoundingClientRect().right;
		const w = this.getBoundingClientRect().width;
		slider.style.left = (x-w) - 1 + 'px';
	}

	/*
	 * 	Pick Pop
	 */
	function popTheName() {
		let drop = document.getElementsByClassName('titleinfo-hover');
		let toolName = document.getElementById('toolName');
		for (let i = 0; i < drop.length; i++) {
			drop[i].addEventListener('mouseover',showget)
			drop[i].addEventListener('mouseleave',hideget)
		}
		function hideget() {
			let t = this.querySelector('.firstmenu');
			hide(t.children[0]);
			t.children[0].style.height = '23px';
		}
		function showget(e) {
			if(!isDown) {
				let t = this.querySelector('.firstmenu');
				let i = e.target;
				let j = t.children[0];
				if(i.className === 'icon') {
					let data = i.parentElement.getAttribute('data-tooltip');
					if(data) {
						toolName.innerHTML = '<br>'+data;
						j.style.height = '45px';
					} else {
						toolName.innerHTML = '';
						j.style.height = '23px';
					}
				}
				show(t.children[0]);
			}
		}
		function show(id) {
			id.style.top = '40px';
		}
		function hide(id) {
			id.style.top = '0px';
		}
	}
	popTheName();

	/*
	 * 	Status bar info 
	 */
	function getName() {
		let toolbar = document.getElementsByClassName('toolbar')[0];
		toolbar.addEventListener('mouseover',function(e) {
			let target = e.target;
			if(target.className === 'icon') {
				let parent = target.parentElement;
				let data = parent.getAttribute('data-name') || parent.getAttribute('data-tooltip');
				let statusText = document.getElementById('statusbar');
				statusText.innerText = data;
			}
		})	
	}
	getName();


	/*
		Return To Global namespace 
	*/
	initUI.debug = debug;
	initUI.fullSrc = fullSrc;
	initUI.toggleStyle = toggle;
} /*Init UI*/
