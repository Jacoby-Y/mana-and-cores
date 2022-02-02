
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
		max: 1000,
		planets: 0,
	},
	(v)=>{
		let { val, max } = v;
		if (val > max) { 
			val = max;
			v.val = 0;
			v.planets++;
		}
		doc.qry("#bar-wrapper h3").innerText = `Planets: ${v.planets}`;
		doc.qry("#power-wrapper #bar-wrapper div").style.width = `${round(val/max, 1)}%`;
	}
];

const calc_power_per_click = ()=>{
	if (mana < power_cost) return 0;
	mana -= power_cost;
	return 1;
}

const get_power = ()=>{
	power += calc_power_per_click();
}

const power_loop = ()=>{
	power_progress.val += power/5;
	$react.power_progress;
}

time( power_loop );

doc.qry("#cl-power").onclick = ()=> void get_power();