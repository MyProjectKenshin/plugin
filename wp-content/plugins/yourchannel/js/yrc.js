var YRC = YRC || {};
jQuery(document).ready(function($){
	window.YD && window.YD.version();
	YRC.EM = YRC.EM || $({});
	YRC.template = YRC.template || {};
	YRC.counter = 0;
	
	function yrcStyle( sel, data ){
		var colors = data.style.colors;
		var css = 
			sel+' li.yrc-active{\
				border-bottom: 3px solid '+ colors.button.background +';\
			}\
			'+ sel +' .yrc-menu li{\
				color:'+ colors.color.link +';\
			}\
			'+ sel +' .yrc-item{\
				margin-bottom:'+ (parseInt(data.style.thumb_margin)||8) +'px;\
			}\
			'+ sel +' .yrc-video, '+ sel +' .yrc-brand, .yrc-placeholder-item, '+ sel +' .yrc-playlist-item{\
				background: '+ colors.item.background +';\
			}\
			'+ sel +' .yrc-section-action, '+ sel +' .yrc-section-action, '+ sel +' .yrc-load-more-button, .yrc-search button, .yrc-player-bar, .yrc-player-bar span, .yrc-search-form-top button{\
				background: '+ colors.button.background +';\
				color: '+ colors.button.color +';\
				border:none;\
			}\
			'+ sel +' .yrc-section-action a{\
				color: '+ colors.button.color +';\
			}\
			.yrc-player-bar .yrc-close span{\
				color: '+ colors.button.background +';\
				background: '+ colors.button.color +';\
			}\
			'+ sel +' .yrc-brand{\
				color: '+ colors.color.text +';\
			}\
			'+ sel +' .yrc-search-form-top svg path{\
				fill: '+ colors.button.color +';\
			}\
			.yrc-loading-overlay:after{ content: "'+ YRC.lang.form.Loading +'..."; }\
			'+ sel +' .yrc-stats svg .yrc-stat-icon{\
				fill: '+ colors.color.text +'\
			}\
			'+ sel +' a, '+ sel +' .yrc-playlist-item { color: '+ colors.color.link +'; }\
			'+ sel +' .yrc-item-title { height: '+ (data.style.truncate ? '1.5em' : 'auto') +'; }';
			
			if(data.style.play_icon === 'all') css += '.yrc-item .yrc-thumb:before{ content:""; }';
			if(data.style.play_icon === 'hover') css += '.yrc-item:hover .yrc-thumb:before{ content:""; }';
			
		$('head').append('<style class="yrc-stylesheet">'+ css + '</style>');
		YRC.EM.trigger('yrc.style', [[sel, data]]);
	}

	function miti(stamp){
		stamp = +new Date - stamp;
		var days = Math.round( Math.floor( ( stamp/60000 )/60 )/24 );
		if(days < 7)
			stamp = days + ' ' + (days > 1 ? YRC.lang.fui.days : YRC.lang.fui.day);
		else if( Math.round(days/7) < 9)
			stamp = Math.round(days/7) + ' ' + (Math.round(days/7) > 1 ? YRC.lang.fui.weeks : YRC.lang.fui.week);
		else if( Math.round(days/30) < 12)
			stamp = Math.round(days/30) + ' ' + (Math.round(days/30) > 1 ? YRC.lang.fui.months : YRC.lang.fui.month);
		else stamp = Math.round( days/365 ) + ' ' + (Math.round(days/365) > 1 ? YRC.lang.fui.years : YRC.lang.fui.year);	
		stamp = (stamp === ('0 '+YRC.lang.fui.day)) ? YRC.lang.fui.today : stamp;
		if(stamp === YRC.lang.fui.today) return stamp;
		return (YRC.lang.fui.wplocale === 'de_DE') ? (YRC.lang.fui.ago + ' ' + stamp) : (stamp + ' ' + YRC.lang.fui.ago);
	}	
	
	window.onYouTubeIframeAPIReady = function() {console.log('YRC_API_LOADED');YRC.EM.trigger('yrc.api_loaded');};
	function loadYouTubeAPI(){
		var tag = document.createElement('script');
			tag.innerHTML = "if (!window['YT']) {var YT = {loading: 0,loaded: 0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';a.src = 'https:' + '//s.ytimg.com/yts/jsbin/www-widgetapi-vflYlgBFi/www-widgetapi.js';a.async = true;var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();}";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}	
	loadYouTubeAPI();
		
	var watch_video = 'https://www.youtube.com/watch?v=';
	
	YRC.auth = {
		//'apikey': 'AIzaSyBHM34vx2jpa91sv4fk8VzaEHJbeL5UuZk',
		'baseUrl': function ( rl ){ return 'https://www.googleapis.com/youtube/v3/' + rl +'&key=' + this.apikey; },
		
		'url': function uuu(type, page, res, search, limit, vst){
			var url = '';
			switch(type){
				case 'Playlist':
					url = this.baseUrl('playlistItems?part=snippet%2C+contentDetails&maxResults='+limit+'&pageToken='+page+'&playlistId='+res);
				break;
				case 'Uploads':
					url = this.baseUrl('search?order='+ ((search || 'viewCount')) +'&q='+(vst.t)+'&part=snippet'+( vst.own ? ('&channelId='+ res) : '') +'&type=video&pageToken='+page+'&maxResults='+limit);
				break;
				case 'channel':
					url = this.baseUrl('channels?part=contentDetails,snippet,statistics,brandingSettings&id='+ res);
				break;
				case 'Playlists':
					url = this.baseUrl('playlists?part=snippet,status,contentDetails&channelId='+ res +'&pageToken='+page+'&maxResults='+limit);
				break;
				case 'Search':
					url = this.baseUrl( YRC.searchUrl( page, res, search, limit ) );
				break;
				case 'Custom':
					url = this.baseUrl('videos?part=contentDetails,statistics,snippet&id=' + res);
				break;	
			}
			return url;
		}
	};
									
	YRC.extras = {
		'playlists': {'sel': ' .yrc-playlists', 'label': 'Playlists'},
		'uploads': {'sel': ' .yrc-uploads', 'label': 'Uploads'},
		'playlist': {'sel': ' .yrc-playlist-videos', 'label': 'Playlist'}
	};
	
	YRC.EM.trigger('yrc.extras');
	
	YRC.Base = function(){};
	
	YRC.Base.prototype = {		
		'more': function( nextpage , more){
			this.request.page = nextpage;
			$(this.coresel).append( YRC.template.loadMoreButton( more, this.request.pagetokens.prev, this.multi_page) );
		},
		
		'moreEvent': function(){
			var yc = this;
			$('body').off('click', this.coresel+' .yrc-load-more-button').on('click', this.coresel+' .yrc-load-more-button', function(e){
				//$(this).text(YRC.lang.form.more +'...');
				$(this).text('...');
				yc.request.dir = $(this).is('.yrc-nextpage') ? 1 :-1;
				yc.request.page = yc.request.dir > 0 ? yc.request.pagetokens.next : yc.request.pagetokens.prev;
				yc.fetch();
			});
		},
		
		'channelOrId': function(){
			if(this.temp_label === 'Custom') return this.custom_vids.splice(0, this.per_page).join(',');
			return ((this.label === 'Playlist' || this.temp_label === 'Playlist') ? this.request.id : (this.label === 'Search' ? (this.restrict_to_channel ? this.ref.channel : '') : this.ref.channel));
		},
		
		'fetch': function(){
			var url = YRC.auth.url( this.temp_label || this.label, this.request.page, this.channelOrId(), this.criteria, this.per_page, this.vst ), yc = this;
			$(this.coresel).addClass('yrc-loading-overlay');
			$.get(url, function(re){
				$(yc.coresel).removeClass('yrc-loading-overlay');
				yc.onResponse( re );
			});
		},
		
		'onResponse': function( re ){
			$(this.coresel+' .yrc-pagination').remove();
			if(!re.items.length) return this.nothingFound();
			this.request.times += this.request.dir;
			
			if(this.temp_label === 'Custom'){
				re.nextPageToken = ((this.request.times*this.per_page) < this.custom_vids_length);
				re.pageInfo.totalResults = this.custom_vids_length;
				re.items.forEach(function(item){
					item.snippet.resourceId = {'videoId' : item.id};
				});	
			}
			
			if((re.nextPageToken && ((this.request.times*this.per_page) < this.max)) || re.prevPageToken){
				this.request.pagetokens = {'prev': re.prevPageToken, 'next': re.nextPageToken};
				this.more( re.nextPageToken, Math.min(this.max, re.pageInfo.totalResults) - (this.request.times*this.per_page) );
			}
			this.list( re.items );
		},
		
		'init': function(s, label){
			this.page = 0;
			this.ref = s;
			this.label = YRC.extras[label].label;
			this.secsel = this.ref.sel + YRC.extras[label].sel;
			this.max = window.parseInt(this.ref.data.meta.maxv) || 10000;
			this.coresel = this.secsel;
			this.multi_page = this.ref.data.style.pagination;
			this.ref.blacklist = this.ref.data.meta.blacklist ? this.ref.data.meta.blacklist.split(',').map(function(v){ return v.trim(); }) : [];
			this.request = {'id':'', 'page':'', 'times':0, 'pagetokens': [], 'dir' : 1};
			this.criteria = this.ref.data.meta.default_sorting || '';
			this.per_page = window.parseInt(this.ref.data.meta.per_page) || 25;
			this.fetchAtSetup();
			this.moreEvent();
			this.events();
			return this;
		},
		
		'events': function(){},
		'fetchAtSetup': function(){ this.fetch(); },
		
		'list': function( items ){
			var bl= this.ref.blacklist;
			this.page++;
			items.forEach(function(item, i){
				if(item.snippet.title === 'Private video') items.splice(i, 1);
				if( typeof item.id === 'object' ){ if( bl.indexOf(item.id.videoId) > -1) items.splice(i, 1); }
				else { if( bl.indexOf(item.snippet.resourceId.videoId) > -1) items.splice(i, 1); }
			});
			this.ref.calcThumbSize( );
			this.ref.listVideos( items, $(this.coresel), (this.label === 'Playlist' || this.temp_label === 'Playlist' || this.temp_label === 'Custom'));
		},
		
		'nothingFound': function(){
			if(this.label !== 'Uploads' && !this.ref.data.style.preload)
				$(this.coresel + ' ul').html(YRC.lang.form.Nothing_found);
			return false;
		}
	};
	
	Object.keys( YRC.extras ).forEach(function(section){
		section = YRC.extras[section].label;
		YRC[ section ] = function(){};
		YRC[ section ].prototype = new YRC.Base();
		YRC[ section ].prototype.constructor = YRC[ section ];
	});
							
	YRC.Uploads.prototype.fetchAtSetup = function(){
		this.ref.data.meta.search_own = (this.ref.data.meta.search_own  === undefined) ? 1 : this.ref.data.meta.search_own;
		this.vst = {'t':(this.ref.data.meta.search_term || ''), 'own': parseInt(this.ref.data.meta.search_own)};
		if(this.ref.data.meta.playlist){
			this.temp_label =  'Playlist';
			this.request.id = this.ref.data.meta.playlist;
		}
		
		this.proSetup && this.proSetup();
		this.fetch();
	};
							
	YRC.Playlist.prototype.fetchAtSetup = function(){};
			
	YRC.Playlists.prototype.list = function (lists){
		this.ref.calcThumbSize( true );
		var cont = $(this.coresel), core = cont.children('.yrc-core'), yc = this.ref;
		lists.forEach(function(list){
			core.append( YRC.template.playlistItem( list, yc.gridstyle.img ) );
		});
		this.ref.adjust(core, '.yrc-playlist-item', this.ref.section, true);
	};
						
	YRC.Playlists.prototype.events = function(){
		var yc = this, pl = this.ref.playlist;
		
		$('body').on('click', yc.secsel+' .yrc-playlist-item', function(e){ 
			pl.request.id = $(this).data('playlist');
			pl.request.page = '';
			pl.request.times = 0;
			$(yc.secsel).css('margin-top', function(){return -$(this).height(); }).find('.yrc-section-action').remove();
			$(yc.secsel).append( YRC.template.subSectionBar( $(this).find('.yrc-item-meta div').text() ));
			pl.fetch();
		});
	};		
	
	YRC.EM.trigger('yrc.classes_defined');
	
	YRC.merge = function(o, n, ox, ke){
		for(var k in n){
			if(typeof n[k] !== 'object'){
				if(o === undefined) ox[ke] = n;
				else {
					if(o[k] === undefined) o[k] = n[k];
				}
			} else {
				YRC.merge(o[k], n[k], o, k);
			}	
		}
	};
	
	YRC.backwardCompatible = function(channel){
		var bc = {
			'style': {
				'video_style': ['large', 'open'],
				'thumb_image_size': 'medium',
				'player_top': 'title',
				'default_tab': 'uploads',
				'uploads': 1,
				'banner': 1,
				'menu': 1
			}
		};
		
		YRC.merge(channel, bc);
		YRC.EM.trigger('yrc.defaults', channel);
		return channel;
	};
		
	YRC.Setup = function(id, channel, host){
		if(channel.meta.playlist) channel.meta.onlyonce = false;
		if(channel.meta.onlyonce){
			channel.meta.playlist = channel.meta.channel_uploads;
			this.onlyonce = true;
			channel.meta.maxv = parseInt(channel.meta.maxv) || 0;
			channel.meta.per_page = parseInt(channel.meta.per_page) || 50;
		}
		if(!channel.meta.playlist){
			channel.meta.default_sorting = (channel.meta.default_sorting === 'none') ? '' : channel.meta.default_sorting;
			channel.meta.temp_sort = 'none';
		}
		
		channel = YRC.backwardCompatible( channel );
		if(host.find('.yrc-cu-pl').length){
			channel.meta.custom = channel.meta.custom_vids = host.find('.yrc-cu-pl').data('cupl').videos;
		}
						
		this.id = id;
		this.data = channel;
		this.channel = channel.meta.channel;
		this.host = host;
		this.rtl = channel.style.rtl ? 'yrc-rtl' : '';
		this.player = {};
				
		this.size = YRC.sizer();		
		this.active_sections = {};
		
		if(this.data.style.playlists)this.active_sections.playlists = true;
		if(this.data.style.search)this.active_sections.search = true;
		if(this.data.style.uploads)this.active_sections.uploads = true;
		
		this.size.size(this);
		this.init();
		if(this.active_sections.uploads)
			this.uploads = new YRC.Uploads().init(this, 'uploads');
		
		if(this.active_sections.playlists){
			this.playlist = new YRC.Playlist().init(this, 'playlist');
			this.playlists = new YRC.Playlists().init(this, 'playlists');
		}
		
		YRC.EM.trigger('yrc.setup', this);
		this.section = this.data.style.default_tab;
		if( !$(this.sel+' .yrc-menu-items li[data-section='+this.section+']').length )
			this.section = $(this.sel+' .yrc-menu-items li').first().data('section');
		$(this.sel+' .yrc-menu-items li[data-section='+this.section+']').addClass('yrc-active');
		this.size.sections();
		return this;
	};
	
	YRC.Setup.prototype = {
		'init': function(){
			this.player_mode = window.parseInt(this.data.style.player_mode);
			this.data.style.rating_style = this.data.style.video_style[0] === 'large' ? window.parseInt(this.data.style.rating_style) : 0;
			this.data.style.video_style.push(this.data.style.rating_style ? 'pie' : 'bar');
			this.data.style.video_style.push(this.data.style.thumb_image_size);
			
			this.host.append('<div class="yrc-shell '+this.rtl+ (YRC.is_pro ? ' yrc-pro-v' : ' yrc-free-v') +'" id="yrc-shell-'+ this.id +'">'+ YRC.template.content( this.active_sections ) +'</div>')
			this.sel = '#yrc-shell-'+ this.id;
			yrcStyle( this.sel, this.data );
			this.load();
			
			if(Object.keys(this.active_sections).length < 2){
				if(!YRC.is_pro || (YRC.is_pro && (!this.data.style.uploads || !this.data.style.menu)))
					$(this.sel+' .yrc-menu').addClass('pb-hidden');
			}
		},
		
		'load': function(){
			YRC.auth.apikey = this.data.meta.apikey;
			var yc = this, url = YRC.auth.baseUrl('channels?part=snippet,contentDetails,statistics,brandingSettings&id='+this.channel);
			//var channel = JSON.parse( localStorage.getItem( this.channel || '{}') );
			
			//if( !channel || ((+new Date - channel[1]) > 24*60*60*1000))
			if(this.data.style.banner){
				$.get(url, function(re){ yc.deploy( re.items[0] ); });
			} else {
				this.events();
				$(this.sel + ' .yrc-banner').css('display', 'none');
				YRC.EM.trigger('yrc.deployed', [[this.sel, this.data]]);
			}
			//else
				//yc.deploy( channel[0] );
		},
		
		'deploy': function(channel){
			//localStorage.setItem(channel.id, JSON.stringify([channel, +new Date]));
			var image = this.size.ww > 640 ? 'bannerTabletImageUrl' : 'bannerMobileImageUrl';
				image = channel.brandingSettings.image[ image ];
			var brands = $(this.sel).find('.yrc-brand');
				brands.css('background', 'url('+ (image || channel.brandingSettings.image.bannerImageUrl)+ ') no-repeat '+this.data.style.colors.item.background);
				brands.eq(0).append( YRC.template.header(channel) );
			$(this.sel +' .yrc-stats').css('top', function(){ return 75 - ($(this).height()/2); })		
			this.events();
			YRC.EM.trigger('yrc.deployed', [[this.sel, this.data]]);
		},
		
		'events': function(){
			var sel = this.sel, yc = this;
			$('body').on('click', sel+' .yrc-menu-item', function(e){ 
				var idx = $(this).index();
				yc.section = $(this).data('section');
				$(this).addClass('yrc-active').siblings().removeClass('yrc-active');
				$(sel+' .yrc-sections').css({'height': function(){
					return $(this).find('.yrc-section:eq('+ idx +')').height();
				}}).css('margin-'+(yc.rtl ? 'right': 'left'), (idx * -yc.size.ww));
				if(yc.section === 'search') $(sel+' .yrc-search-form-top').css('display', 'none');
				else $(sel+' .yrc-search-form-top').css('display', '');
			});
			
			$('body').on('click', sel+' .yrc-playlist-bar .yrc-close span', function(e){ 
				var t = $(this);
				t.parents('.yrc-sub-section').css('margin-top', 0);
				window.setTimeout(function(){
					$(sel).find('.yrc-playlist-videos .yrc-core').empty().end().find('.yrc-playlist-videos .yrc-load-more-button').remove();
					t.parents('.yrc-sections').css('height', function(){ return $(this).find('.yrc-playlists').height(); });
					t.parents('li').remove();
				}, 500);
			});
						
			$('body').on('click', sel+' .yrc-video a', function(e){
				if(yc.player_mode !== 2){
					e.preventDefault();
					YRC.play(yc, sel, $(this));
				}
				$('body')
					.off('click', '.yrc-player-bar .yrc-close span')
					.on('click', '.yrc-player-bar .yrc-close span', function(e){
						yc.closePlayer(e, yc);
					});
					
				$('body')
					.off('click', '.yrc-player-shell')
					.on('click', '.yrc-player-shell', function(e){
						if(!$(e.target).is('.yrc-player-shell')) e.stopPropagation();
						yc.closePlayer(e);
					});
				
				$(document).keyup(function(e) {
				  if (e.keyCode == 27) yc.closePlayer(e);
				});	
			});	
			
			
			$(window).on('resize', function(e){
					yc.size.resize();

			});
			
		},
		
		'closePlayer': function(e, yc){
			if(e.isPropagationStopped && e.isPropagationStopped()) return false;
			this.player.player.destroy();
			$('.yrc-player-shell').remove();
			$('.yrc-onlyone-video, .yrc-playing').removeClass('yrc-onlyone-video, yrc-playing');
			$(this.sel+' .yrc-sections').css('height', this.player.list.parents('.yrc-section').height());
			this.player = {};
		},
		
		'listVideos': function(vids, cont, res){
			var core = cont.children('.yrc-core'), append = 1, i;
			var srt = this.data.meta.temp_sort || (this.uploads ? (this.uploads.criteria || 'etad') : 'etad');
			if((srt !== 'none') && ( this.onlyonce || this.data.meta.playlist || this.data.meta.custom) ){
				if((srt === 'date' || srt === 'title' || srt === 'etad' || srt === 'title_desc')){
					vids.sort(function(a, b){
							if(srt === 'date') {i = (new Date(a.snippet.publishedAt) < new Date(b.snippet.publishedAt));}
							else if (srt === 'title_desc') {i = (a.snippet.title < b.snippet.title);}
							else if (srt === 'title') {i = (a.snippet.title > b.snippet.title);}
							else {i = (new Date(a.snippet.publishedAt) > new Date(b.snippet.publishedAt));}
						return i ? 1 : -1;	
					});
					append = 0;
					this.lstVideos(vids, core, res);
				}
			} else {
				if(srt==='title_desc')vids.sort(function(a, b){i = (a.snippet.title < b.snippet.title); return i ? 1 : -1;});
				this.lstVideos(vids, core, res);
			}
			
			YRC.EM.trigger('yrc.videos_listed', [[core, vids, this, append]]);
		},
		
		'lstVideos': function(vids, core, res){
			//if(this.data.style.pagination && this.uploads.page > 1){
			if(this.data.style.pagination){
				core.empty();
				if((core.offset().top - $(window).scrollTop()) < 0){
					$('html,body').animate({'scrollTop': core.offset().top-50}, 'fast');
				}
			}
			
			var yc = this;
			vids.forEach(function( vid ){
				core.append( YRC.template.video( vid, res, yc.data.style.video_style, yc.gridstyle.img ) );
			});
			core.find('.yrc-onlyone-video').removeClass('yrc-onlyone-video');
			this.adjust(core, '.yrc-video', this.section);	
			core.find('.yrc-just-listed img').load(function(e){
				$(this).parent().addClass('yrc-full-scale');
			});	
			
			if(!this.first_loaded && !this.preloading){
				this.first_loaded = true;
				YRC.EM.trigger('yrc.first_load', [[this, core]]);
			}
		},
		
		'adjust': function(core, item, section){
			var items = core.find(item), in_row = this.gridstyle.in_row, rem = this.gridstyle.rem; 
			var margin_dir = this.rtl ? 'right' : 'left';
			var lastrow = items.length - (items.length % in_row) - 1;
			core.find(item+'.yrc-has-left').css(('margin-'+margin_dir), 0).removeClass('yrc-has-left');
			
			core.find(item).css('width', this.gridstyle.fw).css(('margin-'+(margin_dir ==='left'?'right':'left')), function(i){
				if(i > lastrow) $(this).css(('margin-'+margin_dir), rem).addClass('yrc-has-left');
				if((i+1)%in_row) return rem;
				return 0;
			}).addClass('yrc-full-scale');
			
			core.parents('.yrc-sections').css('height', 'auto');
		},
		
		'calcThumbSize': function(pl){
			var fw = 0, rem = (parseInt(this.data.style.thumb_margin)||8), ww = this.size.ww, in_row = 0, yc = this;
			
			function determineColumns( s ){
				var vid_f = s ? s : (pl || yc.data.style.video_style[0] !== 'small') ? 2 : 1,
					fxw = 160*vid_f;
				fw = fxw;
				in_row = Math.round(ww/fw);
					
				if(in_row > 1) ww -= (in_row - 1) * rem; 
				
				fw = ww/in_row;
				//fw = fw > fxw ? fxw : fw;
				//fw += (yc.size.ww - ((fw*in_row) + (in_row-1)*rem)) / in_row;
				//console.log(yc.size.ww, ww, in_row, fw);
			}
			 
			function thumbWidthFixedColumns(){
				 in_row = parseInt(yc.data.style.columns);
				 fw = (yc.size.ww - ( (in_row-1)*rem )) / ( in_row );
				 if( fw < 140 ) determineColumns( 1 );
			}
						
			if( !parseInt(this.data.style.columns) || pl ) determineColumns();
			else thumbWidthFixedColumns();
			
			if(!pl)this.size.per_row = in_row;
			this.gridstyle = {'fw':fw, 'in_row':in_row, 'rem':rem, 'img': fw > 330 ? 'high' : 'medium'};
		}
	};
	
	YRC.play = function(yc, sel, a){
		var li = a.parent();
		if( li.is('.yrc-playing') ) return false;
		
		$('.yrc-player-shell').remove();
				
		$('.yrc-onlyone-video, .yrc-playing').removeClass('yrc-onlyone-video, yrc-playing');
		if(!li.siblings().length) li.addClass('yrc-onlyone-video');
		li.addClass('yrc-playing');
		
		if(yc.player_mode){	// inline
			if( parseInt(yc.player_mode) === 3){
				li.parent().prepend( YRC.template.player( li, yc ) );
			} else {
				var idx = li.index()+1;
					idx = idx - idx%yc.size.per_row;
					idx = idx ? idx : yc.size.per_row;
					
				var v = a.parents('ul').children('li');
					v = v.eq(idx-1).length ? v.eq(idx-1) : v.last();
					v.after( YRC.template.player( li, yc ) );
			}
			
			var ofs = ($(window).height() - (((9/16) * $('.yrc-player').width()) + $(sel+' .yrc-player-bar').outerHeight()) ) / 2;
				
			$('html,body').animate({'scrollTop': $(sel+' .yrc-player').offset().top-ofs}, 'slow');
		} else {
			$('body').append( YRC.template.player( li, yc, true) );
		}
		$(sel+' .yrc-sections').css('height', 'auto');
		$(sel+' .yrc-player-frame, .yrc-lightbox .yrc-player-frame').css('height', ((9/16) * $('.yrc-player').width()) );
		yc.player.player = YRC.Player(yc, true);
		yc.player.list = li.parent();
	};
	
	YRC.Player = function(yc, play){
		return new YT.Player('yrc-player-frame', {
			events: {
				'onReady':function(e){
					if(play && !YRC.iOS)e.target.playVideo();
				},
				'onStateChange': function(e){YRC.EM.trigger('yrc.player_state_change', [[yc, e]]); }
			}
		});
	};	
	
	YRC.sizer = function(){
		return {
			'size': function(ref){
				this.ref = ref || this.ref;
				var th = this.ref.host.css('height', $(window).height()+5);
				this.ww = this.ref.host.parent().width() || 280;
				this.ref.host.css('height', 'auto').removeClass('yrc-mobile yrc-desktop').addClass((this.ww < 481 ? 'yrc-mobile' : 'yrc-desktop'));
			},
			
			'resize': function(){
				this.size();
				this.sections();
				this.ref.calcThumbSize();
				this.ref.adjust($(this.ref.sel+' .yrc-core'), '.yrc-video');
				this.ref.calcThumbSize(true);
				this.ref.adjust($(this.ref.sel+' .yrc-core'), '.yrc-playlist-item', '', true);
				$(this.ref.sel+' .yrc-sections').css('height', $(this.ref.sel+' .yrc-'+this.ref.section).parent().height());
				var ref = this.ref;
				window.setTimeout(function(){
					$(ref.sel+' .yrc-sections').css('height', $(ref.sel+' .yrc-'+ref.section).parent().height());
				}, 250);
			},
			
			'sections': function(){
				var yc = this, section;
				$(yc.ref.sel+'.yrc-shell, '+yc.ref.sel+' .yrc-section').css('width', this.ww);
				$(yc.ref.sel+' .yrc-sections').css('width', this.ww*Object.keys(yc.ref.active_sections).length).css('margin-'+(yc.ref.rtl ? 'right': 'left'), function(){
					section = $(this).parent().find('.yrc-menu-items .yrc-active').data('section');
					return -($(this).parent().find('.yrc-menu-items .yrc-active').index() * yc.ww);
				});
				$(yc.ref.sel+' .yrc-sections').css('height', 'auto');
				$('.yrc-player-frame').css('height', ((9/16) * $('.yrc-player').width()) );
			}
		};
	};

		
	YRC.template.header = function(channel){
		return '<div class="yrc-name pb-absolute">\
					<img src="'+ channel.snippet.thumbnails.default.url +'"/>\
					<span>'+ channel.brandingSettings.channel.title +'</span>\
				</div>\
				<div class="yrc-stats pb-absolute">\
					<span class="yrc-subs"></span>\
					<span class="yrc-videos pb-block">'+ YRC.template.vicon +'<span class="pb-inline">'+ YRC.template.num( channel.statistics.videoCount ) +'</span></span>\
					<span class="yrc-views pb-block">'+ YRC.template.eyecon +'<span class="pb-inline">'+ YRC.template.num( channel.statistics.viewCount ) +'</span></span>\
				</div>';
	};	
	
	YRC.template.search = YRC.template.search || function(){ return '';};
	YRC.template.playlists = '<div class="yrc-section pb-inline">\
								<div class="yrc-playlists yrc-sub-section"><ul class="yrc-core"></ul></div>\
								<div class="yrc-playlist-videos yrc-sub-section"><ul class="yrc-core"></ul></div>\
							</div>';
				
	YRC.template.content = function( secs ){
		return '<div class="yrc-banner pb-relative"><div class="yrc-brand pb-relative"></div></div>\
		<div class="yrc-content">\
			<div class="yrc-menu pb-relative">\
				<ul class="yrc-menu-items">'+
					(secs.uploads ? '<li class="pb-inline yrc-menu-item" data-section="uploads">'+ YRC.lang.form.Videos +'</li>' : '') +
					(secs.playlists ? '<li class="pb-inline yrc-menu-item" data-section="playlists">'+ YRC.lang.form.Playlists +'</li>' : '') +
				'</ul>\
			</div>\
			<div class="yrc-sections">' +
				(secs.uploads ? '<div class="yrc-section pb-inline"><div class="yrc-uploads yrc-sub-section"><ul class="yrc-core"></ul></div></div>': '') +
				(secs.playlists ? YRC.template.playlists : '') + (secs.search ? YRC.template.search() : '') +
			'</div>\
		</div>\
		<div class="yrc-banner"><div class="yrc-brand pb-relative"></div></div>';
	};	
	
	YRC.template.loadMoreButton = function (more, prev, multi){
		var wrap = '<div class="yrc-pagination '+ (multi ? 'yrc-multi-page' : '') +'">';
			if(multi && prev) wrap += '<li class="yrc-load-more-button yrc-button yrc-prevpage">'+ YRC.lang.form.Prev +'</li>';
			if(more > 0) wrap += '<li class="yrc-load-more-button yrc-button yrc-nextpage">'+ ( multi ? YRC.lang.form.Next : (YRC.template.num(more) +' '+ YRC.lang.form.more)) +'</li>';
		wrap += '</div>';
		return wrap;
	};
	
	YRC.template.num = function( num ){
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	YRC.template.subSectionBar = function( title , player, type){
		return '<li class="yrc-section-action yrc-player-top-'+type+' '+(player ? 'yrc-player-bar':'yrc-playlist-bar')+'">\
			<span class="yrc-sub-section-name">'+ title
			+'</span><span class="yrc-close"><span>x</span></span>\
		</li>';
	};
	
	YRC.template.playerTop = function(li, type){
		return [li.data('video'), li.find('.yrc-video-'+type).html()||''];
	};
		
	YRC.template.player = function( li, yc, lightbox){
		var type = yc.data.style.player_top;
		var v =  this.playerTop(li, type);
		return '<div class="yrc-player-shell '+(lightbox ? 'yrc-lightbox' : 'yrc-inline-player')+'" id="'+yc.sel.replace('#', '')+'-player-shell">\
			<div class="yrc-player">'
				+ YRC.template.subSectionBar(v[1], true, type) +
				'<div class="yrc-player-frame">\
					<iframe id="yrc-player-frame" style="width:100%;height:100%" src="//www.youtube.com/embed/'+v[0]+'?enablejsapi=1&rel=0&origin='+(window.location.origin)+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\
					<span class="pb-absolute yrc-prev yrc-page-nav"><</span><span class="pb-absolute yrc-next yrc-page-nav">></span>\
				</div>\
			</div></div>';
	};
			
	YRC.template.video = function( vid, res, style, img ){
		var vid_id = res ? vid.snippet.resourceId.videoId : vid.id.videoId,
			cl = style[0] +(style[0] === 'adjacent' ? '' : ' yrc-item-'+style[1]);
		return '<li class="yrc-video yrc-item-'+ cl +' yrc-item pb-inline yrc-just-listed" data-video="'+ vid_id +'">\
			<a href="'+ watch_video + vid_id +'" class="yrc-video-link pb-block" target="_blank">\
				<figure class="yrc-thumb pb-inline pb-relative"><img src="'+ (vid.snippet.thumbnails ? vid.snippet.thumbnails[ img ].url : '') +'"/>\
				</figure><div class="yrc-item-meta pb-inline">\
					<div class="yrc-name-date yrc-nd-'+style[2]+'">\
						<span class="pb-block yrc-video-title yrc-item-title">'+ vid.snippet.title +'</span>\
						<span class="yrc-video-date">'+ miti( new Date(vid.snippet.publishedAt) ) +'</span>\
						<span class="yrc-video-views"></span>\
					</div></div></a><div class="pb-hidden yrc-video-desc">'+YRC.template.urlify(vid.snippet.description)+'</div>\
			</li>';
	};
	
	YRC.template.urlify = function(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		return text.replace(urlRegex, function(url) {
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		});
	};
	
	YRC.iOS = (function(){
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return ( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) );
	}());
	
	YRC.template.playlistItem = function( item, img ){
		return '<li class="yrc-playlist-item yrc-item-adjacent pb-inline yrc-item" data-playlist="'+ item.id +'">\
				<figure class="yrc-thumb pb-inline yrc-full-scale"><img src="'+ item.snippet.thumbnails[ img ].url +'"\>\
					</figure><div class="pb-inline yrc-item-meta"><div class="pb-block yrc-item-title">'+ item.snippet.title +'</div>\
					<span class="pb-block">'+ item.contentDetails.itemCount +' '+YRC.lang.form.Videos.toLowerCase()+'</span>\
					<span class="pb-block">'+ miti( new Date(item.snippet.publishedAt) ) +'</span></div>\
			</li>';
	};
	
	
	YRC.template.eyecon = '<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M16,8.286C8.454,8.286,2.5,16,2.5,16S8.454,23.715,16,23.715C21.771,23.715,29.5,16,29.5,16S21.771,8.286,16,8.286ZM16,20.807C13.350999999999999,20.807,11.193,18.65,11.193,15.999999999999998S13.350999999999999,11.192999999999998,16,11.192999999999998S20.807000000000002,13.350999999999997,20.807000000000002,15.999999999999998S18.649,20.807,16,20.807ZM16,13.194C14.451,13.194,13.193999999999999,14.450000000000001,13.193999999999999,16C13.193999999999999,17.55,14.45,18.806,16,18.806C17.55,18.806,18.806,17.55,18.806,16C18.806,14.451,17.55,13.194,16,13.194Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>';			
	YRC.template.vicon = '<svg height="40" version="1.1" width="40" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden;"><path fill="#fff" stroke="#ffffff" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" stroke-width="3" stroke-linejoin="round" opacity="0" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: round; opacity: 0;"></path><path class="yrc-stat-icon" stroke="none" d="M27.188,4.875V5.969H22.688V4.875H8.062V5.969H3.5619999999999994V4.875H2.5619999999999994V26.125H3.5619999999999994V25.031H8.062V26.125H22.686999999999998V25.031H27.186999999999998V26.125H28.436999999999998V4.875H27.188ZM8.062,23.719H3.5619999999999994V20.594H8.062V23.719ZM8.062,19.281H3.5619999999999994V16.156H8.062V19.281ZM8.062,14.844H3.5619999999999994V11.719H8.062V14.844ZM8.062,10.406H3.5619999999999994V7.281H8.062V10.406ZM11.247,20.59V9.754L20.628999999999998,15.172L11.247,20.59ZM27.188,23.719H22.688V20.594H27.188V23.719ZM27.188,19.281H22.688V16.156H27.188V19.281ZM27.188,14.844H22.688V11.719H27.188V14.844ZM27.188,10.406H22.688V7.281H27.188V10.406Z" transform="matrix(1,0,0,1,4,4)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="0" y="0" width="32" height="32" r="0" rx="0" ry="0" fill="#000000" stroke="#000" opacity="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); opacity: 0;"></rect></svg>';
	
	$('body').on('click', '.yrc-shell .yrc-banner, .yrc-shell .yrc-sections', function(e){
		e.stopPropagation();
		$('.yrc-sort-uploads').addClass('pb-hidden');
	});	
		
	YRC.Setups = {};	
	YRC.run = function(shell){
		if(!shell.attr('data-yrc-setup') && shell.length){
			shell.attr('data-yrc-setup', 1);
			YRC.Setups[YRC.counter] = new YRC.Setup(YRC.counter++, shell.data('yrc-channel'), shell);
		}
	};
	
	YRC.lang = YRC.lang || yrc_lang_terms;
	
	// Backward compatible
	
	//YRC.lang.form.prev = 'Prev';
	//YRC.lang.form.next = 'Next';
		
	if (!window.location.origin) {
	  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
	
	YRC.run( $('.yrc-shell-cover').eq(0) );
	YRC.EM.trigger('yrc.run');
	
	
});
