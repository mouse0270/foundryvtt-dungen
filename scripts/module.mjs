// GET REQUIRED LIBRARIES
import { VueApplication } from './libraries/fvtt-petite-vue.mjs';
import Panzoom from './libraries/panzoom.es.js';

// GET MODULE CORE
import { MODULE } from './_module.mjs';

export default class DunGenTesting extends VueApplication {
    constructor(data) {
		super(data);

		this.data = data;

		// Store Image PanZoom Status
		this.imagePanZoom = null;
		this.PanZoomOptions = {
			maxScale: 10
		}

		// Store Hook IDs
		this._hookIds = [];

		// Store Scene Information
		this.sceneOptions = null;

		// Track Generated Options
		this.generationOptions = null;

		// Set Attempt Call Count for Generating Map
		this.maxCallCount = 4;
    }

	static installAPI = () => { }

	static init = () => { this.installAPI(); }

	static get defaultOptions() {
      	return mergeObject(
			super.defaultOptions, {
			title: MODULE.TITLE,
			id: `${MODULE.ID}-dialog`,
			classes: [],
			template: `modules/${MODULE.ID}/templates/dungen.vue`,
			width: window.innerWidth > 960 ? 960 : window.innerWidth - 300,
			height: window.innerHeight > 800 ? 800 : window.innerHeight - 100
		});
    }

	getThemes(genType) {
		let themes = ['original']

		if (genType == 'dungeon') themes = themes.concat([
			"ice_temple",
			"stylized_gray",
			"black_white",
			"stylized_white",
			"classic_blue",
			"virtual_world",
			"mask"
		]);

		return themes;
	}

	getMapSizes(genType) {
		return genType == 'dungeon' 
			? [ "120", "80", "40", "16", "6", "4" ]
			: [ "50", "40", "30", "20", "12" ]
	}

	getTileSizes(genType) {
		const tileSizes = [{
			"title": "Default Options",
			"isPatreonLocked": false,
			"options": [ "50", "70" ] 
		},{
			"title": "Patreon Exclusive",
			"isPatreonLocked": (MODULE.setting('patreon_values')?.token_expired || !(MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Double Resolution (140px grid)')),
			"options": [ "140" ] 
		}];

		return tileSizes
	}

	getGenerationProps(elem, seed=randomID(12)) {
		const genType = elem.querySelector('aside input[type="radio"][name="gen_type"]:checked').value;

		let data = {
			patreon_token: MODULE.setting('patreon_token'),
			seed: elem.querySelector('aside input[type="text"][name="seed"]').value?.length > 0 ? elem.querySelector('aside input[type="text"][name="seed"]').value : seed,
			theme: elem.querySelector('aside select[name="theme"]').value ?? 'original',
			max_size:  elem.querySelector('aside select[name="max_size"]').value ?? 16,
			tile_size: 30, //elem.querySelector('aside select[name="tile_size"]').value ?? 70,
			image_encoded: true
		}

		if (genType == 'dungeon') mergeObject(data, {
				multi_level: elem.querySelector('aside input[type="checkbox"][name="multi_level"]')?.checked ?? false,
				trap: elem.querySelector('aside input[type="checkbox"][name="trap"]')?.checked ?? false
			});
		else if (genType == 'cave') mergeObject(data, {
				map_style: elem.querySelector('aside select[name="map_style"]').value ?? 'l_rooms',
				corridor_density: elem.querySelector('aside input[type="range"][name="corridor_density"]').value ?? 0,
				egress: elem.querySelector('aside input[type="range"][name="egress"]').value ?? 1,
				secret_rooms: elem.querySelector('aside input[type="checkbox"][name="secret_rooms"]')?.checked ?? false
			});
		
		return data;
	}

	getData(options={}) {
		const genType = 'dungeon';
		return {
			genType: genType,
			moduleId: MODULE.ID,
			previewImage: `/modules/${MODULE.ID}/images/logo.webp`,
			requiresRegeneration: false,
			hasWallsPermission: !MODULE.setting('patreon_values')?.token_expired && (MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Automatic Walls'),
			sceneFolders: game.folders.filter(folder => folder.type === 'Scene').map(folder => { return { id: folder.id, name: folder.name } }),
			isDisabled: false,
			themes: this.getThemes(genType),
			maxSizes: this.getMapSizes(genType),
			mapStyles: [ "l_area", "l_rooms", "s_rooms"],
			tileSizes: this.getTileSizes(genType),
			inputValues: {
				name: options.name,
				folder: options.folder,
				corridor_density: 0,
				egress: 1
			},
			mapDetails: false,
			setRequiresRegeneration: this._setRequiresRegeneration,
			onInputRangeWheel: this._onInputRangeWheel,
			onchangeGenType: this._onchangeGenType,
			onMountImage: this._onMountImage,
			generateDungeon: this._generateDungeon,
			regenerateDungeon: (elem) => {
				const dialog = elem.closest(`#${MODULE.ID}-dialog`);
				let tileSize = dialog.querySelector('aside select[name="tile_size"]').value;
				
				if (tileSize == 140) tileSize = 70
				else if (tileSize == 70) tileSize = 50;

				dialog.querySelector('aside select[name="tile_size"]').value = tileSize;
				this.generationOptions.tile_size = tileSize;				

				this._generateDungeon({
					target: elem
				}, this.generationOptions.seed);
			},
			createScene: this._createScene,
			checkSize: (width, height) => {
				const gl = document.createElement('canvas').getContext('webgl');
				const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? 8192;

				return {
					'8k': (width < 16384 && height < 16384) && (width > 8192 || height > 8192),
					'16k': width > 16384 || height > 16384
 				}
			},
			maxTextureSize: (pixel_size) => {
				const gl = document.createElement('canvas').getContext('webgl');
				const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) ?? 8192;
				return maxTextureSize < (pixel_size?.width ?? 0) || maxTextureSize < (pixel_size?.height ?? 0);
			}
		}
	}

	_setRequiresRegeneration = (event) => {
		// If no scene data, ignore
		if (this.sceneOptions == null) return;
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);
		const seed = elem.querySelector('aside input[type="text"][name="seed"]').value?.length > 0 ? elem.querySelector('aside input[type="text"][name="seed"]').value : this.sceneOptions.flags[MODULE.ID].seed_string;
		const checkGenerationData = this.getGenerationProps(elem, seed)

		this._vue.store.requiresRegeneration = !(JSON.stringify(this.generationOptions) == JSON.stringify(checkGenerationData));

		// Handle Generation Button State
		const generateBtn = elem.querySelector(`aside .button-group button[id="${MODULE.ID}-btn-generate"]`);
		if (this._vue.store.requiresRegeneration) {
			generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i> ${MODULE.localize(`dialog.buttons.generate`)}`;
			generateBtn.removeAttribute('data-tooltip');
		}else{
			generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i>`;
			generateBtn.setAttribute('data-tooltip', MODULE.localize('dialog.buttons.generate'))
		}
		// Remove Tooltip
		game.tooltip.deactivate();
	}
	
	_onInputRangeWheel = (event) => {
		if (event.target.getAttribute('name') == 'corridor-density') {
			this._vue.store.inputValues.corridor_density = event.target.value;
		}else if (event.target.getAttribute('name') == 'egress') {
			this._vue.store.inputValues.egress = event.target.value;
		}

		// Check if Scene Needs to be Regenerated
		this._setRequiresRegeneration(event);
	}

	_onchangeGenType = (event) => {
		const genType = event.target.value;
		// Update Gen Type
		this._vue.store.genType = genType;

		// Get New Options
		this._vue.store.themes = this.getThemes(genType);
		this._vue.store.maxSizes = this.getMapSizes(genType);
		this._vue.store.tileSizes = this.getTileSizes(genType);

		// Check if Scene Needs to be Regenerated
		if (this.sceneOptions == null) return;
		this._vue.store.requiresRegeneration = true;
		setTimeout(() => this._setRequiresRegeneration(event), 100);
	}

	_onMountImage = (elem) => {
		this.imagePanZoom = Panzoom(elem, this.PanZoomOptions ?? {});
		elem.closest('main').addEventListener('wheel', this.imagePanZoom.zoomWithWheel);
	}

	async getMapFromAPI(options, callCount=0) {
		return await fetch(`${MODULE.API}/fvtt_${this._vue.store.genType}/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(options)
		})
		.then(response => response.json())
		.then(response => response)
		.catch(async error => {
			// increase Call Count
			callCount = callCount + 1;
			if (callCount >= this.maxCallCount) {
				ui.notifications.error('DunGen failed to generate this map, please try generating a new map.');
				return undefined
			} 
			else{
				ui.notifications.warn('DunGen is still building this map, please wait.');
				return await this.getMapFromAPI(options, callCount);
			} 
		})
	} 

	_generateDungeon = async (event, seed=randomID(12)) => {
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);
		const generateBtn = elem.querySelector(`aside .button-group button[id="${MODULE.ID}-btn-generate"]`);

		// Set Theme
		elem.querySelector('main').setAttribute('data-theme', 'none');

		// Remove Tooltip
		generateBtn.removeAttribute('data-tooltip');
		game.tooltip.deactivate();

		// Disable Button
		generateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i> ${MODULE.localize('dialog.buttons.building')}`;
		
		// Disable Inputs
		this._vue.store.isDisabled = true;

		const defaultURL = `/modules/${MODULE.ID}/images/logo.webp`;
		elem.querySelector('main img').setAttribute('src', defaultURL);
			
		// Reset Zoom and Pan
		this.imagePanZoom.zoom(1);
		this.imagePanZoom.pan(0, 0);

		// Get Generation Options
		this.generationOptions = this.getGenerationProps(elem, seed);

		// Hide Notifications
		this._vue.store.requiresRegeneration = false;
		this._vue.store.mapDetails = false;

		/////--------------------------------------
		const response = await this.getMapFromAPI(this.generationOptions);
		if (typeof response === 'undefined') {
			// Enable Inputs
			this._vue.store.isDisabled = false;

			return false;
		}

		// Update Image
		if (!(response?.image_url ?? false)) return;
		elem.querySelector('main img').setAttribute('src', `data:image/jpeg;charset=utf-8;base64,${response?.image_encoded}`);

		// Set Theme
		elem.querySelector('main').setAttribute('data-theme', this.generationOptions.theme);

		// Fill Seed with Response
		//elem.querySelector('aside input[type="text"][name="seed"]').value = response.seed_string;
		response.max_tile_size = response.max_tile_size.split(' x ');

		this._vue.store.mapDetails = {
			max_tile_size: response.max_tile_size,
			pixel_size: {
				height: response.max_tile_size[1] * parseInt(elem.querySelector('aside select[name="tile_size"]').value),
				width: response.max_tile_size[0] * parseInt(elem.querySelector('aside select[name="tile_size"]').value)
			},
			seed_string: response.seed_string
		};

		this.sceneOptions = {
			background: {
				src: `data:image/jpeg;charset=utf-8;base64,${response?.image_encoded}`
			},
			flags: {
				[`${MODULE.ID}`]: mergeObject( {
					generationDetails: this.generationOptions,
					image_url: `${MODULE.API.replace('/api', '')}/${response.image_url.replace('../', '')}`,
				}, this._vue.store.mapDetails, { inplace: false })
			},
			grid: {
				type: 1, // 0: Gridless, 1: Square, 2: Hexagonal Rows - Odd, 3: Hexagonal Rows - Even, 4: Hexagonal Columns - Odd, 5: Hexagonal Columns - Even
				size: parseInt(elem.querySelector('aside select[name="tile_size"]').value),
			},
			height: this._vue.store.mapDetails.pixel_size.height,
			name: elem.querySelector('input[type="text"][name="name"').value,
			width: this._vue.store.mapDetails.pixel_size.height,
		};

		if (elem.querySelector('aside select[name="folder"]').value.length > 0) {
			this.sceneOptions.folder = game.folders.find(folder => folder.type === 'Scene' && folder.id == elem.querySelector('aside select[name="folder"]').value);
		}

		// Set Requires Regeneration to False
		this._vue.store.requiresRegeneration = false;

		// Enable Button
		generateBtn.innerHTML = `<i class="fa-light fa-dungeon"></i>`;
		generateBtn.setAttribute('data-tooltip', MODULE.localize('dialog.buttons.generate'))

		// Enable Inputs
		this._vue.store.isDisabled = false;
	}

	_createScene = async (event) => {
		event.preventDefault();
		const elem = event.target.closest(`#${MODULE.ID}-dialog`);

		// Disable Inputs
		this._vue.store.isDisabled = true;

		// Update Scene Name
		this.sceneOptions.name = elem.querySelector('input[type="text"][name="name"').value;

		// If Scene Name is Blank, Use Default Name
		if (this.sceneOptions.name.length == 0) {
			this.sceneOptions.name = game.i18n.format("DOCUMENT.New", {type: game.i18n.translations.DOCUMENT.Scene});
			if (game.scenes?.size ?? 0 > 0) this.sceneOptions.name += ` (${game.scenes?.size + 1})`;
		}

		// Handle for Scene Folder
		if (elem.querySelector('aside select[name="folder"]').value.length > 0) {
			this.sceneOptions.folder = game.folders.find(folder => folder.type === 'Scene' && folder.id == elem.querySelector('aside select[name="folder"]').value);
		}

		// Get Cave Texture
		if (this._vue.store.genType == 'cave') {
			this.sceneOptions.flags[MODULE.ID] = await this.getCaveTexture(this.generationOptions);
			this.sceneOptions.background.src = `data:image/jpeg;charset=utf-8;base64,${this.sceneOptions.flags[MODULE.ID]?.image_encoded}`
		}

		// Save Image to Server
		const fileDetails = await this.createImage(this.sceneOptions.background.src, this.sceneOptions.flags[MODULE.ID].image_url);

		// Update Background Image Source
		this.sceneOptions.background.src = fileDetails?.path ?? '';

		// Get Map Walls
		if (elem.querySelector('input[type="checkbox"][name="green_path"').checked) {
			this.sceneOptions.walls = await this.getWallData(this.generationOptions);
		}

		// Create Scene
		const scene = await Scene.create(mergeObject({ type: 'base' }, this.sceneOptions));

		// Open Scene Config Window
		await scene.sheet.render(true);

		return await super.close();
	}

	async getWallData(generationOptions) {
		return await fetch(`${MODULE.API}/fvtt_${this._vue.store.genType}/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mergeObject(generationOptions, { 
				theme_selected: this._vue.store.genType == 'dungeon' ? 'mask' : 'original',
				green_path: 'fvtt'
			 }))
		})
		.then(response => response.json())
		.then(response => response?.walls ?? []);
	}

	async getCaveTexture(generationOptions) {
		return await fetch(`${MODULE.API}/cave/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mergeObject(generationOptions, { layout: false, }))
		})
		.then(response => response.json())
		.then(response => {
			return response;
		});
	}

	async createSceneFolder(folderPath) {
		// Clean up Path Structure
		//folderPath = folderPath.replace(/[^a-z0-9 -]/gi, '');
		const pathExists = await FilePicker.browse('user', `${MODULE.setting('scene_storage')}`, {}).then(response => {
			return response.files;
		}).then(file => file).catch((error) => {
			return false;
		});

		if (!pathExists) await FilePicker.createDirectory('user', `${MODULE.setting('scene_storage')}`, {});

		return `${MODULE.setting('scene_storage')}`;
	}

	async createImage(fileURL, fileName) {
		fileName = fileName.split('/').pop();
		const target = await this.createSceneFolder();
		const file = await fetch(fileURL)
            .then(response => response.arrayBuffer())
            .then(buffer => new File([buffer], fileName, { type: 'image/jpeg' }));

		return await FilePicker.upload('data', target, file);
	}

	activateListeners(html) {
		// Watch for changes in Patreon Values Settings
		this._hookIds.push(['updateSetting', Hooks.on('updateSetting', async (setting, value, options, user) => {
			if (setting.key != `${MODULE.ID}.patreon_values`) return;

			this._vue.store.tileSizes = this.getTileSizes(this._vue.store.genType);
			this._vue.store.hasWallsPermission = !MODULE.setting('patreon_values')?.token_expired && (MODULE.setting('patreon_values')?.patreon_features ?? []).includes('Automatic Walls')
		})]);

		// Watch For New Scene Folders
		['create', 'update', 'delete'].forEach(method => {
			this._hookIds.push([`${method}Folder`, Hooks.on(`${method}Folder`, async (folder, options, userId) => {
				if (folder.type != 'Scene') return;

				this._vue.store.sceneFolders = game.folders.filter(folder => folder.type === 'Scene').map(folder => { return { id: folder.id, name: folder.name } });
			})]);
		});

		// Focus on Best Input
		if (!this.data.name) html[0].querySelector('aside input[name="name"]').focus();
		else if (!this.data.folder) html[0].querySelector('aside select[name="folder"]').focus();
		else html[0].querySelector('aside input[type="radio"][name="gen_type"][value="dungeon"]').focus();
	}

	async close(options={}) {
		// Remove Hooks
		this._hookIds.forEach(hookId => Hooks.off(...hookId));

		return await super.close();
	}
}