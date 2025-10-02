<header>
	<h1>{{localize(`${store.moduleId}.title`)}} - {{localize(`${store.moduleId}.subtitle`)}}</h1>
</header>

<main data-theme="none">
	<img @vue:mounted="store.onMountImage($el)" :src="`${store.previewImage}`" :alt="`${store.moduleId}`" />
</main>
<aside>
	<div class="form-group floating-labels">
		<input type="text" @blur="$el.classList.add('userInteracted');" :id="`${store.moduleId}-name`" name="name" v-model="store.inputValues.name" :value="store.inputValues.name" :placeholder="localize(`${store.moduleId}.dialog.scene.name`)" :disabled="store.isDisabled">
		<label>{{localize(`${store.moduleId}.dialog.scene.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.scene.hint`)}}</small></p>
	</div>
	
	<div class="form-group floating-labels">
		<select :id="`${store.moduleId}-folder`" name="folder" :disabled="store.isDisabled">
			<option value :selected="store.inputValues.folder == ''">{{localize(`${store.moduleId}.dialog.folder.choices.none`)}}</option>
			<option v-for="folder of store.sceneFolders" :value="folder.id" :selected="store.inputValues.folder == folder.id">{{folder.name}}</option>
		</select>
		<label>{{localize(`${store.moduleId}.dialog.folder.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.folder.hint`)}}</small></p>
	</div>

	<div class="form-group">
		<label>{{localize(`${store.moduleId}.dialog.gen_type.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.gen_type.hint`)}}</small></p>
		<div class="input-group">
			<input type="radio" :id="`${store.moduleId}-gen-type-dungeon`" name="gen_type" value="dungeon" :checked="store.genType == 'dungeon'" @change="store.onchangeGenType" :disabled="store.isDisabled">
			<label :for="`${store.moduleId}-gen-type-dungeon`">{{localize(`${store.moduleId}.dialog.gen_type.dungeon`)}}</label>
					
			<input type="radio" :id="`${store.moduleId}-gen-type-cave`" name="gen_type" value="cave" :checked="store.genType == 'cave'" @change="store.onchangeGenType" :disabled="store.isDisabled">
			<label :for="`${store.moduleId}-gen-type-cave`">{{localize(`${store.moduleId}.dialog.gen_type.cave`)}}</label>
		</div>
	</div>

	<div class="form-group floating-labels">
		<input type="text" :id="`${store.moduleId}-seed`" name="seed" @change="store.setRequiresRegeneration" :placeholder="localize(`${store.moduleId}.dialog.seed.name`)" maxlength="12" :disabled="store.isDisabled">
		<label>{{localize(`${store.moduleId}.dialog.seed.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.seed.hint`)}}</small></p>
	</div>

	<div class="form-group floating-labels">
		<select :id="`${store.moduleId}-theme`" name="theme" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			<option v-for="(theme, index) in store.themes" :value="theme">{{localize(`${store.moduleId}.dialog.theme.choices.${theme}`)}}</option>
		</select>
		<label>{{localize(`${store.moduleId}.dialog.theme.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.theme.hint`)}}</small></p>
	</div>

	<div class="form-group floating-labels">
		<select :id="`${store.moduleId}-max-size`" name="max_size" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			<option v-for="(maxSize, index) in store.maxSizes" :value="maxSize" :selected="maxSize === '16'">{{localize(`${store.moduleId}.dialog.max_size.choices.${maxSize}`)}}</option>
		</select>
		<label>{{localize(`${store.moduleId}.dialog.max_size.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.max_size.hint`)}}</small></p>
	</div>

	<div class="form-group floating-labels" v-if="store.genType == 'cave'">
		<select :id="`${store.moduleId}-map-style`" name="map_style" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			<option v-for="(mapStyle, index) in store.mapStyles" :value="mapStyle" :selected="mapStyle === 'l_rooms'">{{localize(`${store.moduleId}.dialog.map_style.choices.${mapStyle}`)}}</option>
		</select>
		<label>{{localize(`${store.moduleId}.dialog.map_style.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.map_style.hint`)}}</small></p>
	</div>

	<div class="form-group floating-labels">
		<select :id="`${store.moduleId}-tile-size`" name="tile_size" :disabled="store.isDisabled">
			<optgroup v-for="(tileSizeGroups, index) in store.tileSizes" :label="tileSizeGroups.title" :disabled="tileSizeGroups.isPatreonLocked && !store.isPatreon">
				<option v-for="(tileSize, index) in tileSizeGroups.options" :value="tileSize" :selected="tileSize === '70'">{{localize(`${store.moduleId}.dialog.tile_size.choices.${tileSize}`)}}</option>
			</optgroup>
		</select>
		<label>{{localize(`${store.moduleId}.dialog.tile_size.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.tile_size.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'cave'">
		<label>{{localize(`${store.moduleId}.dialog.corridor_density.name`)}}</label>
		<div class="form-fields number-input">
			<input type="range" :id="`${store.moduleId}-corridor-density-range`" name="corridor_density" v-model="store.inputValues.corridor_density" @change="store.onInputRangeWheel" :value="store.inputValues.corridor_density" min="0" max="1" step="0.1" :disabled="store.isDisabled">
			<input type="number" :id="`${store.moduleId}-corridor-density-number`" name="corridor_density" v-model="store.inputValues.corridor_density" @change="store.setRequiresRegeneration" :value="store.inputValues.corridor_density" min="0" max="1" step="0.1" :disabled="store.isDisabled">
		</div>
		<p><small>{{localize(`${store.moduleId}.dialog.corridor_density.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'cave'">
		<label>{{localize(`${store.moduleId}.dialog.egress.name`)}}</label>
		<div class="form-fields number-input">
			<input type="range" :id="`${store.moduleId}-egress-range`" name="egress" v-model="store.inputValues.egress" @change="store.onInputRangeWheel" :value="store.inputValues.egress" min="0" max="9" step="1" :disabled="store.isDisabled">
			<input type="number" :id="`${store.moduleId}-egress-number`" name="egress" v-model="store.inputValues.egress" @change="store.setRequiresRegeneration" :value="store.inputValues.egress" min="0" max="9" step="1" :disabled="store.isDisabled">
		</div>
		<p><small>{{localize(`${store.moduleId}.dialog.egress.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'cave'">
		<label>{{localize(`${store.moduleId}.dialog.secret_rooms.name`)}}
			<div class="form-fields">
				<input type="checkbox" name="secret_rooms" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			</div>
		</label>
		<p><small>{{localize(`${store.moduleId}.dialog.secret_rooms.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'dungeon'">
		<label>{{localize(`${store.moduleId}.dialog.multi_level.name`)}}
			<div class="form-fields">
				<input type="checkbox" name="multi_level" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			</div>
		</label>
		<p><small>{{localize(`${store.moduleId}.dialog.multi_level.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'dungeon'">
		<label>{{localize(`${store.moduleId}.dialog.trap.name`)}}
			<div class="form-fields">
				<input type="checkbox" name="trap" @change="store.setRequiresRegeneration" :disabled="store.isDisabled">
			</div>
		</label>
		<p><small>{{localize(`${store.moduleId}.dialog.trap.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'dungeon'">
		<label>{{localize(`${store.moduleId}.dialog.furnishing.name`)}}
			<div class="form-fields">
				<input type="checkbox" name="enable_furnishing" @change="store.onchangeFurnishing" :checked="store.enableFurnishing" :disabled="store.isDisabled">
			</div>
		</label>
		<p><small>{{localize(`${store.moduleId}.dialog.furnishing.hint`)}}</small></p>
	</div>

	<div class="form-group" v-if="store.genType == 'dungeon' && store.enableFurnishing">
		<label>{{localize(`${store.moduleId}.dialog.theme_selection.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.theme_selection.hint`)}}</small></p>
		<div class="input-group">
			<input type="radio" :id="`${store.moduleId}-theme-selection-random`" name="theme_selection_mode" value="random" @change="store.onchangeThemeSelection" :checked="!store.customThemeSelection" :disabled="store.isDisabled">
			<label :for="`${store.moduleId}-theme-selection-random`">{{localize(`${store.moduleId}.dialog.theme_selection.random`)}}</label>

			<input type="radio" :id="`${store.moduleId}-theme-selection-custom`" name="theme_selection_mode" value="custom" @change="store.onchangeThemeSelection" :checked="store.customThemeSelection" :disabled="store.isDisabled">
			<label :for="`${store.moduleId}-theme-selection-custom`">{{localize(`${store.moduleId}.dialog.theme_selection.custom`)}}</label>
		</div>
	</div>

	<div class="form-group" v-if="store.genType == 'dungeon' && store.enableFurnishing && store.customThemeSelection">
		<label>{{localize(`${store.moduleId}.dialog.setting_themes.name`)}}</label>
		<p><small>{{localize(`${store.moduleId}.dialog.setting_themes.hint`)}}</small></p>
		<div class="checkbox-group" style="max-height: 150px; overflow-y: auto; border: 1px solid var(--color-border-light); padding: 0.5rem; border-radius: 4px;">
			<div v-for="theme in store.settingThemes" class="checkbox-item" style="display: flex; align-items: center; margin-bottom: 0.25rem;">
				<input type="checkbox" :id="`${store.moduleId}-setting-theme-${theme.id}`" :name="`setting_theme_${theme.id}`" :value="theme.id" @change="store.setRequiresRegeneration" :disabled="store.isDisabled" style="margin-right: 0.5rem;">
				<label :for="`${store.moduleId}-setting-theme-${theme.id}`" style="margin: 0; cursor: pointer;">{{theme.name}}</label>
			</div>
		</div>
	</div>

	<div :class="{'form-group': true, 'disabled': !store.hasWallsPermission}">
		<label><i class="fa-brands fa-patreon"></i> {{localize(`${store.moduleId}.dialog.green_path.name`)}}
			<div class="form-fields">
				<input type="checkbox" name="green_path" value="fvtt" :disabled="!store.hasWallsPermission || store.isDisabled" :checked="store.hasWallsPermission">
			</div>
		</label>
		<p><small>{{localize(`${store.moduleId}.dialog.green_path.hint`)}}</small></p>
	</div>

	<div class="form-group notification warning" v-if="store.requiresRegeneration" style="box-shadow: none; text-shadow: none;">
		{{localize(`${store.moduleId}.notifications.requiresRegeneration`)}}
	</div>

<div class="form-group notification" v-model="store.mapDetails" v-if="store.mapDetails != false" style="box-shadow: none; text-shadow: none; display: flex; flex-direction: column; cursor: pointer;" @click="navigator.clipboard.writeText(store.mapDetails.seed_string)">
  <div style="width: 100%; margin-bottom: 0.25rem;">
    <strong>{{localize(`${store.moduleId}.dialog.map_details.seed_string`)}}:</strong>
    <span style="user-select: all;">{{store.mapDetails.seed_string}}</span>
  </div>
  <div style="width: 100%; margin-bottom: 0.25rem;">
    <strong>{{localize(`${store.moduleId}.dialog.map_details.max_tile_size`)}}:</strong>
    {{store.mapDetails.max_tile_size?.[0] ?? ''}} x {{store.mapDetails.max_tile_size?.[1] ?? ''}}
  </div>
  <div style="width: 100%;">
    <strong>{{localize(`${store.moduleId}.dialog.map_details.pixel_size`)}}:</strong>
    {{store.mapDetails.pixel_size?.width ?? ''}} x {{store.mapDetails.pixel_size?.height ?? ''}}px
  </div>
</div>

	<div class="form-group notification warning" v-if="!store.maxTextureSize(store.mapDetails?.pixel_size ?? {}) && store.checkSize((store.mapDetails.pixel_size?.width ?? 0), (store.mapDetails.pixel_size?.height ?? 0))['8k'] && !store.disable_8k_warning" style="box-shadow: none; text-shadow: none;">
		{{localize(`${store.moduleId}.notifications.8k_warning`)}}
		<button :id="`${store.moduleId}-btn-regenerate`" @click="store.regenerateDungeon($el)"><i class="fa-solid fa-down-left-and-up-right-to-center"></i> {{localize(`${store.moduleId}.dialog.buttons.decrease_tile_size`)}}</button>
	</div>

	<div class="form-group notification error" v-if="!store.maxTextureSize(store.mapDetails?.pixel_size ?? {}) && store.checkSize((store.mapDetails.pixel_size?.width ?? 0), (store.mapDetails.pixel_size?.height ?? 0))['16k']" style="box-shadow: none; text-shadow: none;">
		{{localize(`${store.moduleId}.notifications.16k_warning`)}}
		<button :id="`${store.moduleId}-btn-regenerate`" @click="store.regenerateDungeon($el)"><i class="fa-solid fa-down-left-and-up-right-to-center"></i> {{localize(`${store.moduleId}.dialog.buttons.decrease_tile_size`)}}</button>
	</div>

	<div class="form-group notification error" v-if="store.maxTextureSize(store.mapDetails?.pixel_size ?? {})" style="box-shadow: none; text-shadow: none;">
		{{localize(`${store.moduleId}.notifications.max_texture_size_error`)}}
		<button :id="`${store.moduleId}-btn-regenerate`" @click="store.regenerateDungeon($el)"><i class="fa-solid fa-down-left-and-up-right-to-center"></i> {{localize(`${store.moduleId}.dialog.buttons.decrease_tile_size`)}}</button>
	</div>

	<div class="button-group">
		<button :id="`${store.moduleId}-btn-generate`" @click="store.generateDungeon" :disabled="store.isDisabled"><i class="fa-light fa-dungeon"></i> {{localize(`${store.moduleId}.dialog.buttons.generate`)}}</button>
		<button :id="`${store.moduleId}-btn-create`" @click="store.createScene" :disabled="store.isDisabled || store.requiresRegeneration || store.maxTextureSize(store.mapDetails?.pixel_size ?? {})"><i class="fa-regular fa-map-location-dot"></i> {{localize(`${store.moduleId}.dialog.buttons.create`)}}</button>
	</div>
</aside>