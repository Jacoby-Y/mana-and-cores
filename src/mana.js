//#region | Just Mana
let mana_deci = 0;
bind.mana = [ false, 0,
	(v,b)=>{
		if (v == b) return;
		mana_deci += v-Math.floor(v);
		v = Math.floor(v);
		v += Math.floor(mana_deci);
		mana_deci -= Math.floor(mana_deci);
		if (doc.qry("#mana-txt").innerText == `Mana: ${sci(v)}`) return;
		doc.qry("#mana-txt").innerText = `Mana: ${sci(v)}`;
		if (v >= 1e+5) check_mana_ok(v);
		return v;
	}
];
doc.qry("#cl-mana").onclick = ()=> mana += calc_per_click();
const set_mana_info = ()=>{
	doc.qry("#mana-info").innerText = 
		`${ (mana_prestige.times > 0) ? `(x${round(1 + mana_prestige.times*0.05, 2)} prestige bonus)\n` : "" }${sci(calc_per_click())} Mana/Click
		${sci(calc_idle_mana())} Mana/Sec`;
}
//#endregion
//#region | Prestige Things, Such, Etc.
bind.mana_prestige = [ false, 
	{
		// bonus: 0,
		times: 0,
		cost: 1.0e+6
	},
	(v,b)=>{
		const { times } = v;
		if (times == 1 && typeof better_mana_open != "undefined") {
			better_mana_open.unlocked = true;
			better_mana_open = better_mana_open;
		}
		else if (times == 5) {
			power_wrapper_shown = true;
		}
		doc.qry("#mana-wrapper #prestige-amount").innerText = `${times} Prestige${times != 1 ? "s" : ""}`;
	}
];
//#endregion
//#region | Per Click [ mana_per_click ]
const calc_per_click = ()=>{
	if (typeof upgrade_mana_click == "undefined") return 0;
	return (mana_per_click.val * mana_bonus.perc() + upgrade_mana_click.total)*(1+mana_prestige.times*0.05);
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
		reset() {
			this.val = 1;
			this.cost = 25;
			return this;
		},
	}, 
	(v,b)=>{
		if (typeof mana_bonus == "undefined") return;
		const val = v.val, next = v.next_val();
		doc.qry("#mana-per-click").innerHTML = `<b>${sci(val)} -> ${sci(next)}</b> Base Mana/Click <b>${sci(v.cost)} Mana</b>`;
		set_mana_info();
	}
];
doc.qry("#mana-per-click").onclick = ()=> void do_upgrade("mana_per_click");
//#endregion
//#region | Per Second [ mana_per_sec ]
const calc_idle_mana = ()=>{
	if (typeof upgrade_mana_idle == "undefined") return 0;
	return ((mana_per_sec.val * mana_bonus.perc()) + upgrade_mana_idle.total)*(1+mana_prestige.times*0.05);
}
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
		next_cost() { return Math.ceil(this.cost * 1.01) },
		next_val() { return this.val + 5 },
		reset() {
			this.val = 0;
			this.cost = 100;
			return this;
		}
	},
	(v,b)=>{
		if (typeof mana_bonus == "undefined") return;
		const val = v.val, next = v.next_val();
		doc.qry("#mana-per-sec").innerHTML = `<b>${sci(val)} -> ${sci(next)}</b> Base Mana/Sec <b>${sci(v.cost)} Mana</b>`;
		set_mana_info();
	}
];
doc.qry("#mana-per-sec").onclick = ()=> void do_upgrade("mana_per_sec");
const idle_mana_loop = ()=>{
	mana += calc_idle_mana()/5;
}
//#endregion
//#region | Mana Bonus [ mana_bonus ]
bind.mana_bonus = [ false, 
	{ 
		val: 0, 
		cost: 500,
		times: 0,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = this.next_cost();
			this.val = this.next_val();
			this.times++;
			return this;
		},
		next_cost() { return Math.ceil(this.cost * 1.05) },
		next_val() { return this.val + (((this.times+1) % 10 == 0 && this.times > 0) ? 110 : 10) },
		perc() { return 1 + this.val/100 },
		reset() {
			this.val = 0;
			this.cost = 500;
			this.times = 0;
			return this;
		}
	},
	(v,b)=>{
		doc.qry("#mana-bonus").innerHTML = `<b>${sci(v.val)}% -> ${sci(v.next_val())}%</b> Base Mana Bonus <b>${sci(v.cost)} Mana</b>`;
		mana_per_click = mana_per_click;
		mana_per_sec = mana_per_sec;
	}
];
doc.qry("#mana-bonus").onclick = ()=> void do_upgrade("mana_bonus");
//#endregion
//#region | Upgrade Mana Clicks [ upgrade_mana_click ]
bind.upgrade_mana_click = [ false,
	{
		cost: 10000, val: 0, total: 0,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = Math.ceil(this.cost * 1.15);
			this.val = this.next_val();
			return this;
		},
		next_val() {
			return round(this.val + 1, 1);
		},
		reset() {
			this.cost = 10000;
			this.val = 0;
			this.total = 0;
			return this;
		}
	},
	(v,b)=>{
		if (typeof better_mana_upgrade == "undefined") return;
		doc.qry("#mana-click-upgrade").innerHTML = `<b>${sci(v.val * better_mana_upgrade.val)} -> ${sci(v.next_val() * better_mana_upgrade.val)}</b> Auto Upgrade (Mana/Click) <b>${sci(v.cost)} Mana</b>`;
	}
];
doc.qry("#mana-click-upgrade").onclick = ()=> void do_upgrade("upgrade_mana_click");
//#endregion
//#region | Upgrade Mana Idle [ upgrade_mana_idle ]
bind.upgrade_mana_idle = [ false,
	{
		cost: 10000, val: 0, total: 0,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = Math.ceil(this.cost * 1.15);
			this.val = this.next_val();
			return this;
		},
		next_val() {
			return round(this.val + 1, 1);
		},
		reset() {
			this.cost = 10000;
			this.val = 0;
			this.total = 0;
			return this;
		}
	},
	(v,b)=>{
		if (typeof better_mana_upgrade == "undefined") return;
		doc.qry("#mana-idle-upgrade").innerHTML = `<b>${sci(v.val * better_mana_upgrade.val)} -> ${sci(v.next_val() * better_mana_upgrade.val)}</b> Auto Upgrade (Mana/Sec) <b>${sci(v.cost)} Mana</b>`;
	}
];
doc.qry("#mana-idle-upgrade").onclick = ()=> void do_upgrade("upgrade_mana_idle");
//#endregion
//#region | Better Upgrading [ better_mana_upgrade ]
bind.better_mana_upgrade = [ false, 
	{
		cost: 2e+4, val: 1,
		buy() {
			if (mana < this.cost) return;
			mana -= this.cost;
			this.cost = ceil(this.cost * 1.25, 0);
			this.val = this.next_val();
			return this;
		},
		next_val() {
			return round(this.val + 0.1*mana_prestige.times, 1);
		},
		reset() {
			this.cost = 2e+4;
			this.val = 1;
			return this;
		}
	}, 
	(v,b)=>{
		const { val, cost } = v, next = v.next_val();
		doc.qry("#mana-better-upgrade").innerHTML = `<b>+${sci(val*100 -100)}% -> +${sci(next*100 -100)}%</b> Upgrading Bonus <b>${sci(cost)} Mana</b>`;

		upgrade_mana_click = upgrade_mana_click;
		upgrade_mana_idle = upgrade_mana_idle;
	}
];
doc.qry("#mana-better-upgrade").onclick = ()=> void do_upgrade("better_mana_upgrade");
//#endregion
//#region | Upgrade Loop
const upgrade_mana_loop = (t)=>{
	if (t != 0) return;
	upgrade_mana_click.total = upgrade_mana_click.total + upgrade_mana_click.val * better_mana_upgrade.val;
	mana_per_click = mana_per_click;

	upgrade_mana_idle.total = upgrade_mana_idle.total + upgrade_mana_idle.val * better_mana_upgrade.val;
	mana_per_sec = mana_per_sec;
}
//#endregion

//#region | Automation Menu
bind.better_mana_open = [ false, { out: false, unlocked: false }, 
	(v)=>{
		if (v.unlocked == false) return;
		else doc.qry("#bottom-btns").style.display = "block";
		doc.qry("#bottom-btns").style.transform = (v.out)? "none" : "translate(0, 100%)";
	}
];
doc.qry("#bottom-btns #toggle").onclick = ()=> { better_mana_open.out = !better_mana_open.out; better_mana_open = better_mana_open };
//#endregion

mana_per_click = mana_per_click;
mana_per_sec = mana_per_sec;
upgrade_mana_click = upgrade_mana_click;
upgrade_mana_idle = upgrade_mana_idle;
mana_prestige = mana_prestige;

time( idle_mana_loop );
time( upgrade_mana_loop );

const do_mana_prestige = ()=>{
	mana = 0; // Start with more?
	mana_per_click = mana_per_click.reset();
	mana_per_sec = mana_per_sec.reset();
	mana_bonus = mana_bonus.reset();

	upgrade_mana_click = upgrade_mana_click.reset();
	upgrade_mana_idle = upgrade_mana_idle.reset();
	better_mana_upgrade = better_mana_upgrade.reset();

	mana_prestige.times++;
	mana_prestige = mana_prestige;

	better_mana_upgrade = better_mana_upgrade;
	
	set_mana_info();
	doc.qry("#mana-wrapper #modal").style.display = "none";
};
