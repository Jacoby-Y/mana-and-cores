
bind.power_wrapper_shown = [ false, true, 
	(v,b)=>{
		doc.qry("#power-wrapper").style.display = (v)? "block" : "none";
		doc.qry("#power-locked-wrapper").style.display = (v)? "none" : "block";
	}
];

bind.power = [ false, 0, (v)=>{ doc.qry("#power-txt").innerText = `Power: ${sci(v)}` }];
bind.power_cost = [ false, 1e+3, (v)=>{ doc.qry("#power-info").innerText = `${sci(v)} Mana -> 1 Power` }];

bind.power_progress = [ false, 
	{
		val: 0,
		max: 1000,
	},
	(v)=>{
		const { val, max } = v;
		doc.qry("#power-wrapper #bar-wrapper div").style.width = `${round(val/max, 0)}%`;
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
	power_progress
}

time( power_loop );

doc.qry("#cl-power").onclick = ()=> void get_power();