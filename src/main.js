const sci = (num)=>{
	return (num >= 1000)? sci_notation(num, 2) : Math.ceil(num*10)/10;
}
const val_cost = (obj, str)=>{
	return str.replace("$0", obj.next_val()).replace("$1", sci(obj.cost));
}

let mana_deci = 0;
bind.mana = [ false, 1000,
	(v,b)=>{
		mana_deci += v-Math.floor(v);
		v = Math.floor(v);
		v += Math.floor(mana_deci);
		mana_deci -= Math.floor(mana_deci);
		doc.qry("#mana-txt").innerText = `Mana: ${sci(v)}`;
		return v;
	}
];
doc.qry("#cl-mana").onclick = ()=> mana += calc_per_click();

//#region | Mana per
const calc_per_click = ()=>{
	return mana_per_click.val * mana_bonus.perc();
}

bind.mana_per_click = [ false,
	{ 
		val: 1, 
		cost: 25, 
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = this.next_cost();
			this.val = this.next_val();
			return this;
		},
		next_cost() { return Math.ceil(this.cost * 1.15) },
		next_val() { return this.val + 1 },
	}, 
	(v,b)=>{
		if (typeof mana_bonus == "undefined") return;
		doc.qry("#mana-per-click").innerHTML = `<b>${sci(v.next_val()*mana_bonus.perc())}</b> Mana/Click <b>${sci(v.cost)} Mana</b>`;
		doc.qry("#cl-mana h3").innerText = ` +${sci(v.val*mana_bonus.perc())}`;
	}
];
doc.qry("#mana-per-click").onclick = ()=> mana_per_click = mana_per_click.buy();


bind.mana_per_sec = [ false, 
	{ 
		val: 0, 
		cost: 100, 
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = this.next_cost();
			this.val = this.next_val();
			return this;
		},
		next_cost() { return Math.ceil(this.cost * 1.15) },
		next_val() { return this.val + 1 },
	},
	(v,b)=>{
		if (typeof mana_bonus == "undefined") return;
		doc.qry("#mana-per-sec").innerHTML = `<b>${sci(v.next_val()*mana_bonus.perc())}</b> Mana/Click <b>${sci(v.cost)} Mana</b>`;
	}
];
doc.qry("#mana-per-sec").onclick = ()=> mana_per_sec = mana_per_sec.buy();


bind.mana_bonus = [ false, 
	{ 
		val: 0, 
		cost: 1000,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = this.next_cost();
			this.val = this.next_val();
			return this;
		},
		next_cost() { return Math.ceil(this.cost * 1.15) },
		next_val() { return this.val + 10 },
		perc() { return 1 + this.val/100 },
	},
	(v,b)=>{
		doc.qry("#mana-bonus").innerHTML = `<b>+${sci(v.next_val())}%</b> Mana Bonus <b>${sci(v.cost)} Mana</b>`;
		mana_per_click = mana_per_click;
		mana_per_sec = mana_per_sec;
	}
];
doc.qry("#mana-bonus").onclick = ()=> mana_bonus = mana_bonus.buy();

const idle_mana_loop = ()=>{
	if (mana_per_sec.val <= 0) return;
	mana += (mana_per_sec.val * mana_bonus.perc())/5;
}

bind.manifest_mana_click = [ true,
	{
		cost: 1000, val: 0,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = Math.ceil(this.cost * 1.25);
			this.val = this.next_val();
		},
		next_val() {
			return this.val + 1;
		}
	},
	(v,b)=>{
		doc.qry("#mana-click-manifest").innerHTML = `<b>+${sci(v.next_val())}</b> Auto Manifest (Mana/Click) <b>${sci(v.cost)} Mana</b>`;
	}
];
doc.qry("#mana-click-manifest").onclick = ()=> manifest_mana_click = manifest_mana_click.buy();
//#endregion

//#region | Power Right
bind.power_wrapper_shown = [ false, false, 
	(v,b)=>{
		doc.qry("#power-wrapper").style.display = (v)? "block" : "none";
		doc.qry("#lock-power").style.display = (v)? "none" : "block";
	}
];

//#endregion

let tick = 0;
const mana_loop = setInterval(() => {
	idle_mana_loop();

	(tick >= 4)
	? (tick = 0) 
	: ++tick;
}, 1000/5);