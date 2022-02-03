
bind.power_wrapper_shown = [ true, false, 
	(v,b)=>{
		doc.qry("#power-wrapper").style.display = (v)? "block" : "none";
		doc.qry("#power-locked-wrapper").style.display = (v)? "none" : "block";
	}
];

bind.power = [ true, 0, (v)=>{ doc.qry("#power-txt").innerText = `Power: ${sci(v)}` }];
bind.power_cost = [ true, 1e+3, (v)=>{ doc.qry("#power-info").innerText = `${sci(v)} Mana -> 1 Power` }];

bind.power_progress = [ true, 
	{
		val: 0,
		max: 1e+6,
		planets: 0,
	},
	(v)=>{
		let { val, max } = v;
		if (val > max) { 
			const over = floor(val / max, 0);
			v.val -= over*max;
			v.planets += over;
		}
		v.val = floor(v.val, 0);
		doc.qry("#bar-wrapper h3").innerText = `Planets: ${sci(v.planets)}`;
		doc.qry("#power-wrapper #bar-wrapper div").style.width = `${Math.min(100, round(val/max*100, 1))}%`;
	}
];

const calc_power_per_click = (amount)=>{
	if (amount === get_powers._3) {
		let total = floor(mana / power_cost, 0);
		mana -= total * power_cost;
		return total;
	} else if (typeof amount == "number") {
		if (mana < power_cost * amount) return 0;
		mana -= power_cost * amount;
		return amount;
	} return 0;
}

const get_power = (amount)=>{
	power += calc_power_per_click(amount);
}

const power_loop = ()=>{
	power_progress.val += power/5;
	$react.power_progress;
}

time( power_loop );

const get_powers = new Tuple(1, 10, 100, "MAX");
doc.qry("#cl-power").onclick = ()=> void get_power(get_powers._0);

doc.qry("#power-x10").onclick =  ()=> void get_power(get_powers._1);
doc.qry("#power-x100").onclick = ()=> void get_power(get_powers._2);
doc.qry("#power-max").onclick =  ()=> void get_power(get_powers._3);