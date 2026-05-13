<script lang="ts">
	const CLASSES = [
		"Warlock",
		"Paladin",
		"Barbarian",
		"Rogue",
		"Necromancer",
		"Druid",
		"Sorcerer",
		"Spiritborn"
	] as const;

	let selectedClass = $state<(typeof CLASSES)[number]>("Warlock");

	let uniqes = $derived(
		await fetch("https://pub-a56f2c3be2ab4ae799e1b987729e82d7.r2.dev/diablo4/uniques.json").then(
			(res) => res.json()
		)
	);
	let codex = $derived(
		await fetch("https://pub-a56f2c3be2ab4ae799e1b987729e82d7.r2.dev/diablo4/codexes.json").then(
			(res) => res.json()
		)
	);

	let classUniques = $derived(
		uniqes.filter((unique: any) => unique.class === selectedClass || !unique.class)
	);
	let classAspects = $derived(
		codex.filter((codex: any) => codex.class === selectedClass || !codex.class)
	);

	function sortByMax(list: any[]) {
		return list.sort((a, b) => (b.max ?? 0) - (a.max ?? 0));
	}

	let allowedAspects = $derived.by(() => {
		const offensive = classAspects.filter((codex) => codex.type === "Offensive");
		const defensive = classAspects.filter((codex) => codex.type === "Defensive");
		const utility = classAspects.filter((codex) => codex.type === "Utility");
		const mobility = classAspects.filter((codex) => codex.type === "Mobility");
		const resource = classAspects.filter((codex) => codex.type === "Resource");

		return {
			head: sortByMax([...defensive, ...utility]),
			chest: sortByMax([...defensive, ...utility]),
			gloves: sortByMax([...offensive, ...defensive, ...utility]),
			pants: sortByMax([...defensive, ...utility]),
			boots: sortByMax([...defensive, ...mobility]),
			mainHand1: sortByMax([...offensive]),
			mainHand2: sortByMax([...offensive]),
			offHand1: sortByMax([...offensive]),
			offHand2: sortByMax([...offensive]),
			amulet: sortByMax([...offensive, ...resource, ...utility, ...defensive, ...mobility]),
			ring1: sortByMax([...offensive, ...resource]),
			ring2: sortByMax([...offensive, ...resource])
		};
	});

	let gear = $state({
		head: null,
		chest: null,
		gloves: null,
		pants: null,
		boots: null,
		mainHand1: null,
		mainHand2: null, // barb only
		offHand1: null,
		offHand2: null, // barb & rogue only
		amulet: null,
		ring1: null,
		ring2: null
	});

	let equippedAspects = $derived(
		Object.values(gear).reduce((acc, curr) => {
			if (curr) acc[curr.name] = true;
			return acc;
		}, {})
	);

	let cumulativeAspectMultiplier = $derived.by(() => {
		let multiplier = 1;
		for (const item of Object.values(gear)) {
			if (item && item.max) {
				multiplier += item.max;
			}
		}
		return multiplier;
	});

	$inspect(equippedAspects);
	$inspect(cumulativeAspectMultiplier);

	function resetGear() {
		gear.head = null;
		gear.chest = null;
		gear.gloves = null;
		gear.pants = null;
		gear.boots = null;
		gear.mainHand1 = null;
		gear.mainHand2 = null;
		gear.offHand1 = null;
		gear.offHand2 = null;
		gear.amulet = null;
		gear.ring1 = null;
		gear.ring2 = null;
	}

	let stats = $derived.by(() => {
		const baseStats = {
			strength: 100,
			dexterity: 100,
			intelligence: 100,
			willpower: 100,

			critChance: 0.05,
			critDamage: 1.5,

			additive: {
				close: 0,
				vulnerable: 0
			},

			multiplicative: {
				all: 0,
				crit: 0,
				dot: 0,
				fire: 0,
				shadow: 0,
				cold: 0,
				lightning: 0,
				poison: 0,
				physical: 0,
				holy: 0
			}
		} as const;

		for (const item of gear) {
			if (item) {
				baseStats.strength += item.strength;
				baseStats.dexterity += item.dexterity;
				baseStats.intelligence += item.intelligence;
				baseStats.willpower += item.willpower;
			}
		}

		return {
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			willpower: 0,

			critChance: 0.05,
			critDamage: 1.5,

			additive: {
				close: 0,
				vulnerable: 0
			},

			multiplicative: {
				all: 0,
				crit: 0,
				dot: 0,
				fire: 0,
				shadow: 0,
				cold: 0,
				lightning: 0,
				poison: 0,
				physical: 0,
				holy: 0
			}
		};
	});

	function calculateDamage() {
		let damage = 0;

		const wepDamage = 0;

		return damage;
	}
</script>

<div>
	<h1>Damage Calculator for {selectedClass}</h1>
	<div class="classes">
		{#each CLASSES as characterClass (characterClass)}
			<button
				onclick={() => {
					selectedClass = characterClass;
					resetGear();
				}}
			>
				{characterClass}
			</button>
		{/each}
	</div>
	<hr />
	<div class="gear">
		<div class="head slot">
			<label for="head">Helm</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.head = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.head as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.head}
				<p>{gear.class}</p>
				<p>{gear.head.description}</p>
			{/if}
		</div>
		<div class="chest slot">
			<label for="chest">Chest</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.chest = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.chest as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.chest}
				<p>{gear.chest.description}</p>
			{/if}
		</div>
		<div class="gloves slot">
			<label for="gloves">Gloves</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.gloves = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.gloves as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.gloves}
				<p>{gear.gloves.description}</p>
			{/if}
		</div>
		<div class="pants slot">
			<label for="pants">Pants</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.pants = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.pants as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.pants}
				<p>{gear.pants.description}</p>
			{/if}
		</div>
		<div class="boots slot">
			<label for="boots">Boots</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.boots = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.boots as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.boots}
				<p>{gear.boots.description}</p>
			{/if}
		</div>
		<div class="mainHand1 slot">
			<label for="mainHand1">Main Hand 1</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.mainHand1 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.mainHand1 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.mainHand1}
				<p>{gear.mainHand1.description}</p>
			{/if}
		</div>
		<div class="mainHand2 slot">
			<label for="mainHand2">Main Hand 2</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.mainHand2 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.mainHand2 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.mainHand2}
				<p>{gear.mainHand2.description}</p>
			{/if}
		</div>
		<div class="amulet slot">
			<label for="amulet">Amulet</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.amulet = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.amulet as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.amulet}
				<p>{gear.amulet.description}</p>
			{/if}
		</div>
		<div class="ring1 slot">
			<label for="ring1">Ring 1</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.ring1 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.ring1 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.ring1}
				<p>{gear.ring1.description}</p>
			{/if}
		</div>
		<div class="ring2 slot">
			<label for="ring2">Ring 2</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.ring2 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.ring2 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.ring2}
				<p>{gear.ring2.description}</p>
			{/if}
		</div>

		<div class="offHand1 slot">
			<label for="offHand1">Off Hand 1</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.offHand1 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.offHand1 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.offHand1}
				<p>{gear.offHand1.description}</p>
			{/if}
		</div>
		<div class="offHand2 slot">
			<label for="offHand2">Off Hand 2</label>
			<select
				onchange={(e) => {
					const aspect = classAspects.find((aspect) => aspect.name === e.target.value);
					if (aspect) gear.offHand2 = aspect;
				}}
			>
				<option value="none">None</option>
				{#each allowedAspects.offHand2 as aspect}
					<option value={aspect.name}>{aspect.name} ({aspect.max ?? 0})</option>
				{/each}
			</select>
			{#if gear.offHand2}
				<p>{gear.offHand2.description}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	:global {
		body {
			background: black;
			color: white;
		}

		p {
			margin: 0;
		}
	}

	label {
		display: block;
	}

	.gear {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(7, auto);
		grid-auto-flow: column;
		/* grid-template:
			"head amulet"
			"chest ring1"
			"gloves ring2"
			"pants empty"
			"boots empty"
			"mainHand1 offHand1"
			"mainHand2 offHand2"; */
		row-gap: 0.5rem;
		column-gap: 3rem;
		width: 60rem;

		/* .head {
			grid-area: head;
		}
		.amulet {
			grid-area: amulet;
		}
		.chest {
			grid-area: chest;
		}
		.ring1 {
			grid-area: ring1;
		}
		.ring2 {
			grid-area: ring2;
		}
		.gloves {
			grid-area: gloves;
		}
		.pants {
			grid-area: pants;
		}
		.boots {
			grid-area: boots;
		}
		.mainHand1 {
			grid-area: mainhand1;
		}
		.offHand1 {
			grid-area: offhand1;
		}
		.mainHand2 {
			grid-area: mainhand2;
		}
		.offHand2 {
			grid-area: offhand2;
		} */
	}
	.slot {
		padding: 1rem;
		border: 1px solid #333;
	}
</style>
