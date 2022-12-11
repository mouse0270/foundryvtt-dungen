// GET MODULE CORE
import { MODULE } from './_module.mjs';

// GET CORE MODULE
import { default as DunGenTesting } from './module.mjs';

// FOUNDRY HOOKS -> SETUP
Hooks.once('setup', async () => {
	const getTokenData = async (patreon_token) => {
		return await fetch(`${MODULE.API}/fvtt_token/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ patreon_token: patreon_token })
		})
		.then(response => response.json());
	}

	MODULE.setting('register', 'scene_storage', {
		type: String,
		default: "DunGen Scenes",
		scope: 'world',
		filePicker: "folder"
	});

	MODULE.setting('register', 'show_in_sidebar', {
		type: Boolean,
		default: true,
		scope: 'world',
		config: true,
		onChange: async (value) => {
			const sceneElem = document.querySelector('#sidebar section.tab[data-tab="scenes"]');
			if (value) {
				// Handle for DDB Importer adding click event to header-actions instead of header-actions > button
				Array.from(sceneElem.querySelectorAll('.header-actions')).pop().insertAdjacentHTML('beforeend', `<button class="create-dungen" data-button="dungen">
					<i class="fa-light fa-dungeon"></i> ${MODULE.TITLE}
				</button>`);
				sceneElem.querySelector('.header-actions.action-buttons button[data-button="dungen"]').addEventListener('click', (event) => {
					new DunGenTesting({ name: '', folder: '' }).render(true)
				});
			}else{
				sceneElem.querySelector('.header-actions.action-buttons button[data-button="dungen"]')?.remove();
			}
		}
	});

	MODULE.setting('register', 'patreon_token', {
		type: String,
		default: '',
		scope: 'world',
		onChange: async (value) => {
			if (value == '') return MODULE.setting('patreon_values', {});

			// Update Patreon Values
			MODULE.setting('patreon_values', await getTokenData(value));
		},
	});

	MODULE.setting('register', 'patreon_values', {
		type: Object,
		default: {},
		scope: 'world',
		config: false
	});

	// Check Patreon Status on Ready
	Hooks.once('ready', async () => {
		// No Key, Don't need to do anything
		if (MODULE.setting('patreon_token') == '') return;

		// If there is no token data, grab it
		if (isEmpty(MODULE.setting('patreon_values'))) {
			await MODULE.setting('patreon_values', await getTokenData(MODULE.setting('patreon_token')));
		}

		// We don't need to worry about anything, because the token is expired already
		if (MODULE.setting('patreon_values')?.token_expired ?? false) return;

		// Check if the token is still valid
		if (new Date(MODULE.setting('patreon_values').expiry) < (new Date()).setHours(0, 0, 0, 0)) {
			ui.notifications.warn(`<strong>${MODULE.TITLE}</strong> ${MODULE.localize('notifications.token_expired')}`);
			
			MODULE.setting('patreon_values', mergeObject(MODULE.setting('patreon_values') ,{
				"token_expired": true,
			}));
		}		
	});
	
	// Handle Settings Config Window
	Hooks.on('renderSettingsConfig', async (app, elem, options) => {
		// User is not a Game Master and can not create Scenes
		if (!game.user.isGM) return;

		// Don't do Anything if no values exists
		if (isEmpty(MODULE.setting('patreon_values'))) return;

		// Check out if Pledge is Unknown
		// Check out if Pledge Features is Unknown
		// Check out if Pledge Features is Unknown
		if ((!MODULE.setting('patreon_values')?.patreon_pledge ?? false)
			&&(!MODULE.setting('patreon_values')?.patreon_features ?? false)
			&& (new Date(MODULE.setting('patreon_values')?.expiry ?? '') == 'Invalid Date')) {

			elem[0].querySelector(`section[data-tab="${MODULE.ID}"] .form-group:last-of-type`).insertAdjacentHTML('afterend', `<div class="form-group notification error">
				<div><strong>${MODULE.TITLE}</strong> ${MODULE.localize('notifications.invalid_token_data')}</div>
			</div>`);
		}else{
			elem[0].querySelector(`section[data-tab="${MODULE.ID}"] .form-group:last-of-type`).insertAdjacentHTML('afterend', `<div class="form-group patreon-status">
				${new Date(MODULE.setting('patreon_values').expiry) < (new Date()).setHours(0, 0, 0, 0) ? `<div class="form-group notification warning"><div>${MODULE.localize('notifications.expired_token_data')}</div></div>`: ''}
				<div><strong>${MODULE.localize('settings.patreon.tier')}:</strong> ${MODULE.setting('patreon_values')?.patreon_pledge ?? ''}</div>
				<div><strong>${MODULE.localize('settings.patreon.features')}:</strong> ${(MODULE.setting('patreon_values')?.patreon_features ?? []).join(', ')}</div>
				<div><strong>${MODULE.localize('settings.patreon.expires')}:</strong> ${(new Date(MODULE.setting('patreon_values')?.expiry ?? '')).toLocaleDateString()}</div>
			</div>`);
		}
	});

	// Handle Adding Button to Sidebar Tab
	Hooks.on('renderSidebarTab', async (app, elem, options) => {
		if (app.id !== 'scenes' || !MODULE.setting('show_in_sidebar') || !game.user.isGM) return;
		
		// Handle for DDB Importer adding click event to header-actions instead of header-actions > button
		Array.from(elem[0].querySelectorAll('.header-actions')).pop().insertAdjacentHTML('beforeend', `<button class="dialog-button" data-button="dungen">
			<i class="fa-light fa-dungeon"></i> DunGen
		</button>`);
		elem[0].querySelector('.header-actions.action-buttons button[data-button="dungen"]').addEventListener('click', (event) => {
			new DunGenTesting({ name: '', folder: '' }).render(true);
		});
	})
});