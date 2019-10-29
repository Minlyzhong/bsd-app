define(["handlebars"], function(Handlebars) {
	Handlebars = Handlebars || this.Handlebars;
	var templateExtension = ".hbs";

	Handlebars.registerHelper('examRank_rank', function(state) {
		var ret = '<span class="rankNoAward">' + state + '</span>';
		switch(state) {
			case -1:
				ret = '<span class="rankNoAward">未上榜</span>';
				break;
			case 0:
				ret = '<span class="rankNoAward"></span>';
				break;
			case 1:
				ret = '<span class="rankGold">1</span>';
				break;
			case 2:
				ret = '<span class="rankSliver">2</span>';
				break;
			case 3:
				ret = '<span class="rankCopper">3</span>';
				break;
			default:
				break;
		}
		return ret;
	});

	Handlebars.registerHelper('examList_bgColor', function(index) {
		var ret = 'rgba(255, 0, 0, 0.7)';
		var state = index % 7;
		switch(state) {
			case 0:
				ret = 'rgba(255, 0, 0, 0.7)';
				break;
			case 1:
				ret = 'rgba(255, 128, 0, 0.7)';
				break;
			case 2:
				ret = 'rgba(255, 255, 0, 0.7)';
				break;
			case 3:
				ret = 'rgba(0, 255, 0, 0.7)';
				break;
			case 4:
				ret = 'rgba(0, 255, 255, 0.7)';
				break;
			case 5:
				ret = 'rgba(0, 0, 255, 0.7)';
				break;
			case 6:
				ret = 'rgba(128, 0, 255, 0.7)';
				break;
			default:
				break;
		}
		return ret;
	});

	Handlebars.registerHelper('services_state', function(state) {
		var ret = '<div class="qs-state state_enter"><span>审核中</span></div>';
		switch(state) {
			case -2:
				ret = '<div class="qs-state state_end"><span>审核未通过</span></div>';
				break;
			case 1:
				ret = '<div class="qs-state state_bein"><span>审核中</span></div>';
				break;
			case 2:
				ret = '<div class="qs-state state_enter"><span>报名中</span></div>';
				break;
			case 4:
				ret = '<div class="qs-state state_end"><span>报名截至</span></div>';
				break;
		}
		return ret;
	});

	return {
		pluginBuilder: "./hbs-builder",

		// http://requirejs.org/docs/plugins.html#apiload
		load: function(name, parentRequire, onload, config) {
			// Get the template extension.
			var ext = (config.hbs && config.hbs.templateExtension ? config.hbs.templateExtension : templateExtension);

			// In browsers use the text-plugin to the load template. This way we
			// don't have to deal with ajax stuff
			parentRequire(["text!" + name + ext], function(raw) {
				// Just return the compiled template
				onload(Handlebars.compile(raw));
			});

		}

	};
});