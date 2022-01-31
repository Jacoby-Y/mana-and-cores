// #region [> Helper Functions <]
const is_int = (num)=>{
	return num == Math.floor(num);
}

const floor_round = (num, place)=>{
const pow = (Math.pow(10, place));
return Math.floor(num * pow) / pow;
}

const num_shorts = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'D', 'UD', 'DD', 'TD', 'QuD', 'QiD', 'SxD', 'SpD', 'OD', 'ND', 'V', 'UV', 'DV', 'TV', 'QaV', 'QiV', 'SxV', 'SpV', 'OV', 'NV', 'T', 'UT', 'DT', 'TT', 'QaT', 'QiT', 'SxT', 'SpT', 'OT', 'NT'];
const format_num = (num, round_to=1, i=0, past_thresh=false)=>{
	const div = num / 1000;
	const thresh = (i >= num_shorts.length);
	if (div < 1 || thresh) { 
		if (thresh) return (floor_round(num, round_to) + num_shorts[num_shorts.length-1]);
		else return (i == 0) ? (floor_round(num, round_to)) : (floor_round(num, round_to) + num_shorts[i]);
	}
	return format_num(div, round_to, i+1, thresh);
}

const f_str = (format, ...args)=>{
	args = [].concat.apply([], args);
	let new_f = format;
	for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			if (!format.includes(`[${i}]`)) continue;

			while (new_f.includes(`[${i}]`)) {
					new_f = new_f.replace(`[${i}]`, arg);
			}
	}
	return new_f;
};

const sci_notation = (num, dec)=>{
  return Number.parseFloat(num).toExponential(dec);
}
//#endregion

//#region | Watcher 2
const doc = {
	/** @returns {HTMLElement} */
	qry(query="*") {
		if (this.select[query] == undefined) 
			this.select[query] = document.querySelector(query);
		return this.select[query];
	},
	/** @returns {HTMLCollection} */
	qryAll(query="*") {
		if (this.selectAll[query] == undefined) 
			this.selectAll[query] = document.querySelectorAll(query);
		return this.selectAll[query];
	},
	click(query="*", func) {
		if (this.select[query] == undefined) 
			this.select[query] = document.querySelector(query);
		this.select[query].onclick = func;
	},
	text(query="*", text) {
		if (this.select[query] == undefined) 
			this.select[query] = document.querySelector(query);
		this.select[query].innerText = text;
	},
	select: {},
	selectAll: {},
}

const storage = {
	save_keys: [],
	load(key, val, store=false) {
		const res = localStorage[key];
		if (this.save_keys.includes(key) == false && store) this.save_keys.push(key);
		if (res === undefined || res === "undefined") {
			localStorage[key] = JSON.stringify(val);
			return val;
		}; 
		let ret = null;
		try {
			ret = JSON.parse(res);
		} catch (err) {
			console.log(err);
			console.log(`Tryed to parse: ${res}.\nKey: ${key}`);
		};
		return ret;
	},
	save() {
		this.save_keys.forEach( key => {
			localStorage[key] = JSON.stringify(window[key]);
		});
	},
	clear() {
		localStorage.clear();
		window.onunload = null;
		window.location.reload();
	}
};

window.onunload = ()=>{
	storage.save();
}

class Bind {
	constructor(key, val, func) {
		this.key = key;
		this.func = func;
		this.val = val;
		this.first_load = true;
	}
}

/** @param { [Boolean, any, Function] } v */
const setter = (obj, k, v, proxy)=>{
	const [ store, init, on_set ] = v;
	const val = store ? storage.load(k, init, store) : init;

	const bindie = { val: val };

	for (const k in init) {
		if (!Object.hasOwnProperty.call(init, k)) continue;
		const v = init[k];
		if (typeof v != "function") continue;
		if (k in val) continue;
		val[k] = v;
	}

	on_set(val, null);

	Object.defineProperty(window, k, {
		set: function(val) { 
			if (val === undefined) return;
			bindie.val = on_set(val, bindie.val) ?? val;
		},
		get: function() { return bindie.val; }
	});
}
const bind = new Proxy({}, { set: setter });
//#endregion

//#region [> Identi <]
/** @returns {HTMLCollection} */
const $all = (selector="*", index=-1, arrayify=true)=>{
	const query = document.querySelectorAll(selector);
	if (index >= 0) return query[0];
	if (arrayify === true) return [].slice.call(query);
}
/** @returns {HTMLElement} */
const $ = selector => document.querySelector(selector);
//#endregion

// #region [> Claide <]
// document.body.onload = 
const str_to_elem = (str) => {
	const div = document.createElement('div');
	div.innerHTML = str.trim();
	return div.firstChild;
}

const cliade = (txt)=>{
	const elem = str_to_elem(txt);
	parse_attrs(elem);
	return elem;
}

/** @param {HTMLElement} e */
const parse_attrs = (e)=>{
	const attrs = [].slice.call(e.attributes);
			
	for (let i = 0; i < attrs.length; i++) {
			const name = attrs[i].name;
			const value = attrs[i].value;
			if (name[0] == "#") {
					e.id = name.slice(1);
					e.removeAttribute(name);
			}
			if (name[0] == ".") {
					const classes = name.slice(1).split('|');
					for (let i = 0; i < classes.length; i++) {
						/** @type String */
						const str = classes[i];
						if (str.split("-")[0] == "hex") {
							e.style.color = "#" + str.split("-")[1];
						} 
						else e.classList.add(str);
					}
					e.removeAttribute(name);
			}
			if (name == "onhover") {
					if (value[0] == "!") {
							const split = value.slice(1).split('|');
							e.onmouseenter = function() { eval(split[0]) };
							e.onmouseleave = function() { eval(split[1]) };
					} else {
							const split = value.split('|');
							e.onmouseenter = eval(split[0]);
							e.onmouseleave = eval(split[1]);
					}
					
					e.removeAttribute(name);
			}
	}
}; parse_attrs(document.body);

(()=> {
	const elems = document.body.querySelectorAll("*");
	elems.forEach((e, num, p)=>{
		parse_attrs(e);
	});
})();
//#endregion


class Tuple {
	constructor(...args) {
		const proto = Object.create(null);

		proto.toString = function() {
			const res = args.reduce((p, c, i, a)=>{
				return ( p.push( `_${i}: ${(typeof c == "string")? `"${c}"` : c }` ), p );
			}, []);
			return `{ ${res.join(", ")} }`;
		};

		proto.length = args.length;

		proto.loopItems = function( callback = ( key="", val, index=0, self={} )=>{} ) {
			for (let i = 0; i < args.length; i++) {
				const val = args[i];
				callback(`_${i}`, val, i, this);
			}
		}

		const obj = Object.create(proto);
		for (let i = 0; i < args.length; i++) {
			const value = args[i];
			obj[`_${i}`] = value;
		}
		return Object.seal(obj);
	}
}

class Link {
	constructor(val, next) {
		this.val = val;
		this.next = next;
	}
}

// class BigNumber {
// 	constructor(init) {
// 		if (typeof init == "number") init = `${init}`;
		
// 		{
// 			const chars = (`${init}`).split("");
// 			this.root = new Link(parseInt(chars[chars.length-1]), null);
// 			let current = this.root;
// 			// for (let i = 1; i < chars.length; i++) {
// 			for (let i = chars.length-2; i >= 0; i--) {
// 				let v = chars[i];
// 				let n = parseInt(v);
// 				n = (isNaN(n) ? 0 : n);
// 				current.next = new Link(n, null);
// 				current = current.next;
// 			}
// 			// console.log(this.root);
// 		}
// 	}
// 	toString() {
// 		let res = [];
// 		let link = this.root;
// 		while (true) {
// 			res = [ link.val ].concat(res);
// 			link = link.next;
// 			if (link == null) break;
// 		}
// 		return res.join("");
// 	}
// 	add(num) {
// 		let link = this.root;
// 		while (true) {
// 			link.val += num % 10;
// 			num = Math.floor(num / 10);
// 			if (num <= 0) break;
// 			if (link.next == null) link.next = new Link(0, null);
// 			link = link.next;
// 		}
// 	}
// }

// Anything higher is Infinity
// const max = Number.MAX_VALUE;

// const nummy = new BigNumber(max);
// nummy.add(max);

// console.log("Value is: " + nummy);

//#region | Struct
// const Struct = (obj)=>{
// 	const proto = Object.create(null);
// 	/** @param {Function} func */
// 	proto.impl = function(func) {
// 		this[func.name] = func;
// 	}
// 	proto._new = function( ...args ) {
// 		const keys = Object.keys(obj);
// 		const values = Object.values(obj);
// 		const res = {};
// 		for (let i = 0; i < args.length; i++) {
// 			const arg = args[i];
// 			const key = keys[i];
// 			const value = values[i];
			
// 			if (typeof arg != value.name.toLowerCase()) continue;
// 			res[key] = arg;
// 		}
// 	}

// 	return Object.create(proto);
// }

// const Player = Struct({
// 	name: String,
// 	age: Number,
// 	is_epic: Boolean,
// }); 

// // Player._new( "Jacoby", 18, true );
//#endregion 

const get_html_file = (url)=>{
	return new Promise((ok, err)=>{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function() {
			if (this.readyState!==4) return;
			if (this.status!==200) err(`this.status !== 200. status: ${this.status}`);
			ok(str_to_elem(this.responseText));
		}
		xhr.send();
	})
}

// get_html_file("/x.html").then((v)=>{
// 	console.log(v.content.children[0]);
// }).catch((err)=>{
// 	console.error(err);
// });


// const closure = ()=>{
// 	let value = 1;
// 	return {
// 		get value() {
// 			return value;
// 		},
// 		set value(v) {
// 			value = v;
// 		}
// 	}
// }
// const joey = closure();
// joey.value = 2;
// console.log(joey.value);


// new queueMicrotask
// new resizeTo
// new importScripts
// new indexedDB
// new atob
// new scroll
// new encodeURI
// new decodeURI
// new focus
// new getComputedStyle
// new history
// new location
// new XMLDocument
// new cancelAnimationFrame
// new VBArray
// new btoa
// new Node
// new matchMedia
