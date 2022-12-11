// GET MODULE FUNCTIONS
import { MODULE } from './_module.mjs';

// IMPORT SETTINGS -> Settings Register on Hooks.Setup
import './_settings.mjs';

// GET CORE MODULE
import { default as DunGenTesting } from './module.mjs';
import { libWrapper } from './libraries/lib-wrapper.shim.js';

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// socketlib HOOKS -> socketlib.ready
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('socketlib.ready', () => {
	MODULE.debug('SOCKETLIB Ready - SOCKET'); // WONT REGISTER CAUSE CALL HAPPENS WAY TO EARLY
	CORE.registerSocketLib();
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// 🧙 DEVELOPER MODE HOOKS -> devModeReady
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE.ID, 'level', {
		choiceLabelOverrides: {
			0: 'NONE',
			1: 'ERROR',
			2: 'WARN',
			3: 'DEBUG',
			4: 'INFO',
			5: 'ALL'
		}
	});
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// FOUNDRY HOOKS -> READY
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
Hooks.once('ready', async () => {
	// User is not a Game Master and can not create Scenes
	if (!game.user.isGM) return;

	// We have libWrapper... Override Scene.createDialog
	libWrapper.register(MODULE.ID, 'Scene.createDialog', async function (data={}, {parent=null, pack=null, ...options}={}) {
		// Collect data
		const documentName = this.metadata.name;
		const types = game.documentTypes[documentName];
		const folders = parent ? [] : game.folders.filter(f => (f.type === documentName) && f.displayed);
		const label = game.i18n.localize(this.metadata.label);
		const title = game.i18n.format("DOCUMENT.Create", {type: label});

		// Render the document creation form
		const html = await renderTemplate("templates/sidebar/document-create.html", {
			folders,
			name: data.name || game.i18n.format("DOCUMENT.New", {type: label}),
			folder: data.folder,
			hasFolders: folders.length >= 1,
			type: data.type || CONFIG[documentName]?.defaultType || types[0],
			types: types.reduce((obj, t) => {
				const label = CONFIG[documentName]?.typeLabels?.[t] ?? t;
				obj[t] = game.i18n.has(label) ? game.i18n.localize(label) : t;
				return obj;
			}, {}),
			hasTypes: types.length > 1
		});

		// Render the confirmation dialog window
		return Dialog.confirm({
			title: title,
			content: html,
			render: (html) => { 
				// Update Confirm Buttons Text and Icons
				html[2].querySelector('button[data-button="yes"]').innerHTML = `<i class="fas fa-check"></i> ${title}`;
				html[2].querySelector('button[data-button="no"]').innerHTML = `<i class="fa-light fa-dungeon"></i> ${MODULE.TITLE}`;
			},
			yes: html => {
				// Bind Yes Button to Default Create Scene Logic
				const form = html[0].querySelector("form");
				const fd = new FormDataExtended(form);
				foundry.utils.mergeObject(data, fd.object, {inplace: true});
				if ( !data.folder ) delete data.folder;
				if ( types.length === 1 ) data.type = types[0];
				if ( !data.name?.trim() ) data.name = this.defaultName();
				return this.create(data, {parent, pack, renderSheet: true});
			},
			no: html => {
				// Bind No Button to Opening a New DunGen Dialog
				new DunGenTesting({
					name: html[0].querySelector('input[name="name"]').value ?? '',
					folder: html[0].querySelector('select[name="folder"]')?.value ?? ''
				}).render(true)
			},
			rejectClose: false,
			options
		});
	}, 'OVERRIDE');
});

Hooks.once('ready', async () => {
	// User is not a Game Master and can not create Scenes
	if (!game.user.isGM) return;

	DunGenTesting.init();
});

/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */
// FOUNDRY HOOKS -> MODULE FUNCTIONS
/* ─────────────── ⋆⋅☆⋅⋆ ─────────────── */