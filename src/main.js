//#region | Functions
const sci = (num, place=1)=>{
	return (num >= 1000)? sci_notation(num, 1) : round(num, place);
}
const val_cost = (obj, str)=>{
	return str.replace("$0", obj.next_val()).replace("$1", sci(obj.cost));
}
const round = (num, place)=>{
	const pow = 10 ** place;
	return Math.round(num * pow)/pow;
}
const floor = (num, place)=>{
	const pow = 10 ** place;
	return Math.floor(num * pow)/pow;
}
const ceil = (num, place)=>{
	const pow = 10 ** place;
	return Math.ceil(num * pow)/pow;
}
const arrayify = (iter)=>{ 
	return [].slice.call(iter);
}
const do_upgrade = (str)=>{
	if (!holding_shift) {
		window[str] = window[str].buy();
		return;
	}
	while (true) {
		const res = window[str].buy();
		window[str] = res;
		if (res == undefined) break;
	}
}
//#endregion

//#region | Key Events
let holding_shift = false;
document.body.onkeydown = (e)=> (e.key == "Shift")? (holding_shift = true) : undefined;
document.body.onkeydup = (e)=> (e.key == "Shift")? (holding_shift = false) : undefined;
//#endregion

//#region | Timer
/** @type Function[] */
const timers = [];
const time = (func=(t=0)=>{})=> timers.push(func);
let tick = 0;
const clock = setInterval(() => {
	for (let i = 0; i < timers.length; i++) {
		const t = timers[i];
		t(tick);
	}

	if (tick >= 4) tick = 0;
	else tick++;
}, 1000/5);
//#endregion

//#region | Power Wrapper
bind.power_wrapper_shown = [ false, false, 
	(v,b)=>{
		doc.qry("#power-wrapper").style.display = (v)? "block" : "none";
		doc.qry("#lock-power").style.display = (v)? "none" : "block";
	}
];
//#endregion 

doc.qry("#mana-wrapper #modal").onclick = function(e) {
	if (e.target != this) return;
	this.style.display = "none";
}; 
doc.qry("#mana-wrapper #prestige").onclick = ()=>{
	doc.qry("#mana-wrapper #modal").style.display = "grid";
	doc.qry("#mana-wrapper #modal #cost").innerText = `Cost: ${sci(mana_prestige.cost)}`;
	check_mana_ok();
}

doc.qry("#mana-wrapper #modal #ok").onclick = ()=> void do_mana_prestige();
doc.qry("#mana-wrapper #modal #nope").onclick = ()=> doc.qry("#mana-wrapper #modal").style.display = "none";

const check_mana_ok = (v)=>{
	if (typeof mana == "undefined" || typeof mana_prestige == "undefined") return;
	const ok = doc.qry("#mana-wrapper #modal #ok");
	const afford = (v ?? mana) >= mana_prestige.cost;
	ok.toggleAttribute("disabled", !afford);
}

// let nummy = new BigNumber(1);

// setInterval(() => {
// 	nummy = nummy.times(1000);
// 	console.log(nummy.toNumber() >= 1000);
// 	doc.qry("#bignum").innerText = ((nummy.toNumber() >= 1000) ? nummy.toExponential(1) : nummy.toNumber());
// }, 10);