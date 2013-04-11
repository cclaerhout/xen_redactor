if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

RedactorPlugins.xenforo = {
	init:function(obj, event, key)
	{
		switch (key) {
	  		case 'xen_undo': 
	  			obj.shortcuts(event, 'undo');
	  			break;
	  		case 'xen_redo': 
	  			obj.shortcuts(event, 'redo');
	  			break;
	  		case 'xen_removeformat':
	  			obj.inactiveAllButtons(); 
	  			obj.execCommand('removeformat', false);
	  			break;
	  		case 'xen_media':
	  			RedactorPlugins.xen_media.init(obj); 
	  			break;
	  		case 'xen_code':
	  			RedactorPlugins.xen_code.init(obj); 
	  			break;	  			
	  		case 'xen_link':
	  			RedactorPlugins.xen_link.init(obj); 
	  			break;	  	
	  		case 'xen_colors':
	  			RedactorPlugins.xen_colors.init(obj, event, key);
	  			break;
	  		case 'xen_backcolors':
	  			RedactorPlugins.xen_colors.init(obj, event, key);
	  			break;
		}
	},
	dropdowns:function(key)
	{
		switch (key) {
	 		case 'xen_fontNames':
	 		case 'xen_fontSize':
				return RedactorPlugins.xen_fonts.dropdown(key);
	  		break;
		}		  	
	},
	commandCallbacks:function(obj, command)
	{
		  	switch (command) {
		 		case 'fontSize':
					RedactorPlugins.xen_fonts.commandFontSize(obj);
		  			break;
		 		case 'fontName':
					RedactorPlugins.xen_fonts.commandFontName(obj);
		  			break;
		  	}		
	},	
	loadOverlay:function(title, dialog, width, redactor, src, callback)
	{
		var t = RedactorPlugins.xenforo,
		selectedHtmlParent = $(redactor.getParentNode()).html(),
		selectedHtml = redactor.getSelectedHtml,
		isEmpty = ($('<p>'+redactor.getCode()+'</p>').text()) ? false : true;
		
		if (typeof(callback) !== 'string' ||  typeof(src[callback]) !== 'function')
		{
			callback = false;
		}

		redactor.setBuffer();

		XenForo.myRedactor = {
			title: title,
			template: false,
			width: width,
			redactor: redactor,
			src: src,
			callback: callback,
			selectedHtmlParent: selectedHtml,
			selectedHtml: selectedHtml,
			isEmpty: isEmpty
		};

		XenForo.ajax('index.php?editor/redactor-dialog', { dialog: dialog, selectedHtmlParent: selectedHtmlParent, selectedHtml: selectedHtml}, t._overlayLoader);
	},
	_overlayLoader:function(ajaxData)
	{
		if (XenForo.hasResponseError(ajaxData) || typeof(ajaxData.templateHtml) == 'undefined')
		{
			return;
		}
	
		if (ajaxData.templateHtml) 
		{
			var config = XenForo.myRedactor;

 			new XenForo.ExtLoader(ajaxData, function()
  			{
				var title = $(ajaxData.templateHtml).find('.rteTitle').html(),
				callback = 
					$.proxy(function(){
						
						if(typeof(title) === 'string')
						{
							$('#redactor_modal_header').html(title);							
						}
						
						$('#redactor_modal').find('.rteFocus').focus();
						
						if(config.callback !== false){
							config.src[config.callback](config.redactor);
						}
					}, config.src);

				config.redactor.modalInit(config.title, ajaxData.templateHtml, config.width, callback);
				return false;
			});
		}
	},
      	/* Use to get data from RTE and send them inside a textarea or input - available options: space */
      	unescapeHtml : function(string, options) 
      	{
      		string = string
      			.replace(/&amp;/g, "&")
      			.replace(/&lt;/g, "<")
      			.replace(/&gt;/g, ">")
      			.replace(/&quot;/g, '"')
      			.replace(/&#039;/g, "'");
      			
      		if(options == 'space')
      		{
      			string = string
      				.replace(/	/g, '\t')
      				.replace(/&nbsp;/g, '  ')
      				.replace(/<\/p>\n<p>/g, '\n');
      		}
      
      		var regex_p = new RegExp("^<p>([\\s\\S]+)</p>$", "i");
      		if(regex_p.test(string))
      		{
      			string = string.match(regex_p);
      			string = string[1];
      		}
      			
      		return string;
      	},
      	/* Use to get data from textarea/inputs and send inside RTE - available options: space or onlyspace */
      	escapeHtml: function(string, options) 
      	{
      		//No need anymore with editor/to-html ?
      		if( options != 'onlyspace' )
      		{
      			string = string
      				.replace(/&/g, "&amp;")
      				.replace(/</g, "&lt;")
      				.replace(/>/g, "&gt;")
      				.replace(/"/g, "&quot;")
      				.replace(/'/g, "&#039;");
      		}
      		
      		//Must be executed in second
      		if(options == 'space' || options == 'onlyspace')
      		{
      			string = string
      				.replace(/\t/g, '	')
      				.replace(/ /g, '&nbsp;')
      				.replace(/\n/g, '</p>\n<p>');
      		}
      
      		return string;
      	},
      	zen2han: function(str)
      	{
      		// ==========================================================================
      		// Project:   SproutCore - JavaScript Application Framework
      		// Copyright: ©2006-2011 Strobe Inc. and contributors.
      		//			©2008-2011 Apple Inc. All rights reserved.
      		// License:   Licensed under MIT license (see license.js)
      		// ==========================================================================
      		var nChar, cString= '', j, jLen;
      		//here we cycle through the characters in the current value
      		for (j=0, jLen = str.length; j<jLen; j++)
      		{
      			nChar = str.charCodeAt(j);
      			   //here we do the unicode conversion from zenkaku to hankaku roomaji
      			nChar = ((nChar>=65281 && nChar<=65392)?nChar-65248:nChar);
      	
      			//MS IME seems to put this character in as the hyphen from keyboard but not numeric pad...
      			nChar = ( nChar===12540?45:nChar) ;
      			cString = cString + String.fromCharCode(nChar);
      		}
      		return cString;
      	}	
},
	 
RedactorPlugins.xenforo_switch = {
	 
	init: function()
	{
		this.addBtn('xen_switch', this.opts.params.xenforo.bbcode_switch_text[0], function(obj)
		{
			obj.wysiwygToBbCode();
		});
		
		this.setBtnRight('xen_switch');
	},
      	wysiwygToBbCode: function()
      	{
      		XenForo.ajax(
      			'index.php?editor/to-bb-code',
      			{ html: this.getCode() },
      			$.context(this, 'wysiwygToBbCodeSuccess')
      		);
      	},
      	wysiwygToBbCodeSuccess: function(ajaxData)
      	{
      		if (XenForo.hasResponseError(ajaxData) || typeof(ajaxData.bbCode) == 'undefined')
      		{
      			return;
      		}

      		$container = this.$box;
      		$existingTextArea = this.$el;
      		$textContainer = $('<div class="bbCodeEditorContainer" />');
      		$newTextArea = $('<textarea class="textCtrl Elastic" rows="5" />');

      		if ($existingTextArea.attr('disabled'))
      		{
      			return; // already using this
      		}

      		$newTextArea
      			.attr('name', $existingTextArea.attr('name').replace(/_html(]|$)/, ''))
      			.val(ajaxData.bbCode)
      			.appendTo($textContainer);

      		$('<a />')
      			.attr('href', 'javascript:')
      			.text(this.opts.params.xenforo.bbcode_switch_text[1])
      			.click($.context(this, 'bbCodeToWysiwyg'))
      			.appendTo(
      				$('<div />').appendTo($textContainer)
      			);

      		$existingTextArea.attr('disabled', true);
    		$container.after($textContainer);

      		if ($.browser.mozilla)
      		{
      			// reloading the page needs to remove this as it will start in wysiwyg mode
      			$(window)
      				.unbind('unload.rte')
      				.bind('unload.rte', function() {
      					$existingTextArea.removeAttr('disabled');
      				});
      		}

      		$container.hide();

      		$textContainer.xfActivate();

      		$newTextArea.focus();

      		this.$bbCodeTextContainer = $textContainer;
      		this.$bbCodeTextArea = $newTextArea;
      	},
      	bbCodeToWysiwyg: function()
      	{
      		XenForo.ajax(
      			'index.php?editor/to-html',
      			{ bbCode: this.$bbCodeTextArea.val() },
      			$.context(this, 'bbCodeToWysiwygSuccess')
      		);
      	},
      	bbCodeToWysiwygSuccess: function(ajaxData)
      	{
      		if (XenForo.hasResponseError(ajaxData) || typeof(ajaxData.html) == 'undefined')
      		{
      			return;
      		}

	    	$container = this.$box;
	    	$existingTextArea = this.$el;

      		if (!$existingTextArea.attr('disabled'))
      		{
      			return; // already using
      		}

      		$existingTextArea.attr('disabled', false);

      		$container.show();

      		this.setCode(ajaxData.html);
      		this.$editor.focus();

      		this.$bbCodeTextContainer.remove();
      	},
},

RedactorPlugins.fullscreen = {
	init: function()
	{	
		this.fullscreen = false;
		
		this.addBtn('fullscreen', 'Fullscreen', function(obj)
		{
			obj.toggleFullscreen();
		});
		
		this.setBtnRight('fullscreen');
	},
	toggleFullscreen: function()
	{
		var html;

		if (this.fullscreen === false)
		{
			this.changeBtnIcon('fullscreen', 'normalscreen');
			this.setBtnActive('fullscreen');
			this.fullscreen = true;
			
			this.fsheight = this.$editor.height();
			this.fcheight = this.$content.height();
			
			this.tmpspan = $('<span></span>');
			this.$box.addClass('redactor_box_fullscreen').after(this.tmpspan);

			$('body, html').addClass('redactor_toolbar_fullscreen');
			$('body').prepend(this.$box);

			this.fullScreenResize();
			$(window).resize($.proxy(this.fullScreenResize, this));
			$(document).scrollTop(0,0);

			this.$editor.focus();
		}
		else
		{
			this.removeBtnIcon('fullscreen', 'normalscreen');
			this.setBtnInactive('fullscreen');
			this.fullscreen = false;

			$(window).unbind('resize', $.proxy(this.fullScreenResize, this));
			$('body, html').removeClass('redactor_toolbar_fullscreen');
			
			this.$box.removeClass('redactor_box_fullscreen').css({ width: 'auto', height: 'auto' });
			this.tmpspan.after(this.$box).remove();
			
			this.syncCode();
			
			if (this.opts.autoresize)
			{
				this.$el.css('height', 'auto');
				this.$editor.css('height', 'auto');					
				this.$content.css('height', 'auto');
			}
			else
			{
				this.$el.css('height', this.fsheight);
				this.$editor.css('height', this.fsheight);			
				this.$content.css('height', this.fcheight);
			}
			
			this.$editor.focus();
			$('html, body').animate({ scrollTop: this.$box.offset().top }, 500, 'easeInOutCubic');
		}
		
		this.setCode(this.getCode());
	},
	fullScreenResize: function()
	{
		if (this.fullscreen === false)
		{
			return false;
		}
	
		var pad = parseInt(this.$editor.css('padding-top'));
		var height = $(window).height() - 34;
		var toolbar = this.$toolbar.height();
		
		this.$box.width($(window).width() - 2).height(height+34);		
		this.$editor.height(height-(pad*2));
		this.$el.height(height);
		this.$content.height(height-toolbar);
	}
},

RedactorPlugins.xen_media = {

	init: function(redactor)
	{
		RedactorPlugins.xenforo.loadOverlay('Media', 'media', 500, redactor, RedactorPlugins.xen_media, 'callback');
	},
	callback: function(redactor)
	{
		Redactor_Media.onload($('#redactor_modal'));
	}
},

RedactorPlugins.xen_code = {

	init: function(redactor)
	{
		RedactorPlugins.xenforo.loadOverlay('Code', 'code', 500, redactor, RedactorPlugins.xen_code, 'callback');
	},
	callback: function(redactor)
	{
		Redactor_Code.onload($('#redactor_modal'));
	}
},

RedactorPlugins.xen_link = {

	init: function(redactor)
	{
		RedactorPlugins.xenforo.loadOverlay('Link', 'link', 500, redactor, RedactorPlugins.xen_link, 'callback');
	},
	callback: function(redactor)
	{
		Redactor_Link.onload($('#redactor_modal'));
	}
},

RedactorPlugins.xen_colors = {

	eraseColors: false, //Doesn't work well, better to disable it
	init: function(redactor, event, key)
	{
		  	this.ed = redactor;
		  	this.key = key;

		if (key === 'xen_colors'){
			$target = $('.xen_colors_dropdown');
		}
		else if (key === 'xen_backcolors') {
			$target = $('.xen_backcolors_dropdown');		
		}

		if($target.length == 0) {
		  		var dropdown = $('<div class="redactor_dropdown '+key+'_dropdown" style="display:none">'),
		  		button = redactor.getBtn(key);

	  			dropdown = this.buildColorPicker(dropdown, key);
		  		redactor.dropdowns.push(dropdown.appendTo($(document.body)));
	
		  		// observing dropdown
				redactor.hdlShowDropDown = $.proxy(function(e) { redactor.showDropDown(e, dropdown, key); }, this);
				button.click(redactor.hdlShowDropDown);
				
			//Trigger dropdown
			button.trigger('click');
		}
	},
      	buildColorPicker: function(dropdown, key)
      	{
      		var mode,
      		ed = this.ed;

      		if (key === 'xen_backcolors') {
      			if (ed.browser('msie')) {
      				mode = 'BackColor';
      			}
      			else {
      				mode = 'hilitecolor';
      			}
      		}
      		else {
      			mode = 'forecolor';
      		}

     		$(dropdown).width(210);

      		$colors = $('<div class="'+key+'_block"></div>');

      		var len = ed.opts.colors.length;
      		for (var i = 0; i < len; ++i)
      		{
      			var color = ed.opts.colors[i];

      			var swatch = $('<a rel="' + color + '" href="javascript:void(null);" class="redactor_color_link"></a>').css({ 'backgroundColor': color });
    	  		$colors.append(swatch);

      			var _self = ed;
      			$(swatch).click(function()
      			{
      				$('.'+key+'_dropdown').hide();
      				
      				_self.setBuffer();
      				
      				_self.execCommand(mode, $(this).attr('rel'));

      				if (mode === 'forecolor')
      				{
      					_self.$editor.find('font').replaceWith(function() {

      						return $('<span style="color: ' + $(this).attr('color') + ';">' + $(this).html() + '</span>');

      					});
      				}

      				if (_self.browser('msie') && mode === 'BackColor')
      				{
      					_self.$editor.find('font').replaceWith(function() {

      						return $('<span style="' + $(this).attr('style') + '">' + $(this).html() + '</span>');

      					});
      				}
      				
      				_self.syncCode();
      			});
        	}

	      	$(dropdown).append($colors);
	
	      	$tools = $('<div class="xen_tools_block"></div>');

      		var picker = $('<a href="javascript:void(null);" class="redactor_color_picker"></a>')
      			.html(ed.opts.params.xenforo.colorpicker)
      			.click($.proxy(this.loadOverlay, this));

	      	$tools.append(picker);

	      	if(this.eraseColors === true) {
	      	  		var elnone = $('<a href="javascript:void(null);" class="redactor_color_none"></a>').html(RLANG.none);
	      
	      	  		if (key === 'xen_backcolors'){
	      	  			elnone.click($.proxy(this.setBackgroundNone, this));
	      	  		}
	      	  		else{
	      	  			elnone.click($.proxy(this.setColorNone, this));
	      	  		}
	      
	      	  		$tools.append(elnone);
	      	}

	      	$(dropdown).append($tools);
	
	        return dropdown;
	},
	setBackgroundNone: function()
	{
		$('.'+this.key+'_dropdown').hide();
		
		ed = this.ed;
      		ed.$editor.focus();
		ed.restoreSelection();
		ed.setBuffer();
	
	      	var hasSelection = ed.getSelectedHtml();
	      	
	      	if(hasSelection) {
	      		var regex = new RegExp('background-color(\s*?)[:].*?(?=[;"])', "gi"),
	      		selection = hasSelection.replace(regex, '');
	      		ed.execCommand('inserthtml', selection);
	      	}

      		$(ed.getParentNode())
      			.css('background-color', 'transparent')
      			.children().each(function(){
      			$(this).css('background-color', 'transparent');
      		});
      		
      		ed.syncCode();
        },
       	setColorNone: function()
       	{
      		$('.'+this.key+'_dropdown').hide();
      		
      		ed = this.ed;
      	      	ed.$editor.focus();
      		ed.restoreSelection();
      		ed.setBuffer();

	      	var hasSelection = ed.getSelectedHtml();
	
	      	if(hasSelection) {
	      		var regex = new RegExp('color(\s*?)[:].*?(?=[;"])|color=".*?"', "gi"),
	      		selection = hasSelection.replace(regex, '');
	      		ed.execCommand('inserthtml', selection);
	      	}
	
	      	$(ed.getParentNode())
	      		.attr('color', '').css('color', '')
	      		.children().each(function(){
	      			$(this).attr('color', '').css('color', '');
	      		});

        	ed.syncCode();
        }, 
      	loadOverlay: function()
      	{
      		$('.'+this.key+'_dropdown').hide();
	    	RedactorPlugins.xenforo.loadOverlay('Colors', 'colors', 500, this.ed, RedactorPlugins.xen_colors, 'callback');
      	},		
	callback: function(redactor)
	{
		Redactor_Colors.onload($('#redactor_modal'));
	}	  	
},

RedactorPlugins.xen_fonts = {
	init: function()
	{
		/***
		*	This init function is a real plugin
		*	Important: The plugin part is executed after the dropdown
		*
		***/

		var _self = this;
		
		var callback_fontSize = 
			$.proxy(function(e) { 
					$('.redactor_dropdown:visible')
						.addClass('dp_fontsize')
						.children().click(function () {
						_self.setBuffer();//Bloody undo/redo
					});
				},
			this);
			
		var callback_fontName = 
			$.proxy(function(e) { 
					$('.redactor_dropdown:visible')
						.addClass('dp_fontname')
						.children().click(function () {
						_self.setBuffer();
					});
				},
			this);

		var fontSize = this.getBtn('xen_fontSize'), fontNames = this.getBtn('xen_fontNames');		
			
		fontSize.text(this.opts.params.xenforo.fontsize)
			.addClass('textbutton')
			.one('click', callback_fontSize);

		fontNames.text(this.opts.params.xenforo.fontfamily)
			.addClass('textbutton')
			.one('click', callback_fontName);			
	},
	dropdown: function(key)
	{
		if(key === 'xen_fontSize') {
			return this.fontSizeDp();
		}
		
		if(key === 'xen_fontNames') {
			return this.getFontNamesDp();
		}
	},
	fonts : {
		'Andale Mono':'andale mono,times',
		'Arial':'arial,helvetica,sans-serif',
		'Arial Black':'arial black,avant garde',
		'Book Antiqua':'book antiqua,palatino',
		'Courier New':'courier new,courier',
		'Georgia':'georgia,palatino',
		'Helvetica':'helvetica',
		'Impact':'impact,chicago',
		'Tahoma':'tahoma,arial,helvetica,sans-serif',
		'Times New Roman':'times new roman,times',
		'Trebuchet MS':'trebuchet ms,geneva',
		'Verdana':'verdana,geneva'
	},
	getFontNamesDp: function()
	{
		var t = this, builder = {};

		$.each(this.fonts, function(k, v) {
			var _class = k.toLowerCase().replace(/[ -]/g, '');
			
			builder[k] = {
				title: k,
				exec: 'fontName',
				className: 'redactor_font_'+_class,
				fontFamily: v
			};
		});

		return builder;
	},
	fontSizeDp: function()
	{
		var builder = {};
		
		for (i=1; i<8; i++) {
			builder[i] = {
				title: i,
				exec: 'fontSize',
				className: 'redactor_size_'+i
			};
		}
		
		return builder;
	},
	commandFontSize: function(ed)
	{
		ed.$editor.find('font').replaceWith(function() {
			var attr = parseInt($(this).attr('size')), size;

			if(attr)
			{
				switch (attr) {
				  		case 1: size = 'xx-small'; break;
				  		case 2: size = 'x-small'; break;
				  		case 3: size = 'small'; break;
				  		case 4: size = 'medium'; break;
				  		case 5: size = 'large'; break;
				  		case 6: size = 'x-large'; break;
				  		case 7: size = 'xx-large'; break;
				  		default: size = 'medium';				  	 				  	 				  	 				  	 				  	 
 				}

				return $('<span style="font-size: ' + size + ';">' + $(this).html() + '</span>');
			}
		});

		ed.$editor.focus();
		
		ed.syncCode();
	},
	commandFontName: function(ed)
	{
		var t = this;
		ed.$editor.find('font').replaceWith(function() {
			var attr = ($(this).attr('face'));

			if(attr.length > 0)
			{
				var family = t.fonts[attr];
				return $('<span style="font-family: ' + family + ';">' + $(this).html() + '</span>');
			}
		});

		ed.$editor.focus();
		
		ed.syncCode();	
	}
}
