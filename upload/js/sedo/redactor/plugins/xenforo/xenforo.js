if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

var xenRedactor = {
	backup: {},
	config: {
		/***
			if needed, code inside will be merged to the template config object
		***/
	},
	cmd:function(obj, event, key)
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
	  			obj.execCommand('unlink', false);	  			
	  			break;
	  		case 'xen_media':
	  			this.exec.xen_media.init(obj); 
	  			break;
	  		case 'xen_code':
	  			this.exec.xen_code.init(obj); 
	  			break;	  			
	  		case 'xen_link':
	  			this.exec.xen_link.init(obj); 
	  			break;	  	
	  		case 'xen_colors':
	  		case 'xen_backcolors':
	  			this.exec.xen_colors.init(obj, event, key);
	  			break;
		}
	},
	dropdowns:function(key)
	{
		switch (key) {
	 		case 'xen_fontNames':
	 		case 'xen_fontSize':
				return this.exec.xen_fonts.dropdown(key);
				break;
			case 'xen_link':
				return this.exec.xen_link.dropdown();
		  		break;
		}		  	
	},
	commandCallbacks:function(obj, command)
	{
      	  	switch (command) {
      	 		case 'fontSize':
      				this.exec.xen_fonts.commandFontSize(obj);
      	  			break;
      	 		case 'fontName':
      				this.exec.xen_fonts.commandFontName(obj);
      	  			break;
      	  	}		
	},	
	tools : 
	{
		loadOverlay:function(title, dialog, width, redactor, src, callback)
		{
			var t = xenRedactor.tools,
			selectedHtmlParent = $(redactor.getParentNode()).html(),
			selectedHtml = redactor.getSelectedHtml,
			isEmpty = ($('<p>'+redactor.getCode()+'</p>').text()) ? false : true;
			
			if (typeof(callback) !== 'string' ||  typeof(src[callback]) !== 'function')
			{
				callback = false;
			}
	
			redactor.setBuffer();
	
			xenRedactor.backup = {
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
				var config = xenRedactor.backup;
	
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
		execToSpan: function(tag, tagPropType, tagProp, cssProp, propFunc, addClass)
		{
			var ed = this, prop;
			
			$tag = ed.$editor.find(tag).filter(function() {
				if(tagPropType == 'css'){
					return $(this).css(tagProp).indexOf();
				}else if (tagPropType == 'attr'){
					return $(this).attr(tagProp);				
				}
			});

			$tagChildren = $tag.children('span');
			$tag.first().before('<span id="memTemp1" />');
			$tag.last().after('<span id="memTemp2" />');

			/***
			*	Get final property value
			***/
			if(tagPropType == 'css'){
				prop = $tag.css(tagProp);
			}else if (tagPropType == 'attr'){
				prop = $tag.attr(tagProp);			
			}
	
			if(typeof(prop) === 'undefined'){
				return false;
			}
	
			/***
			*	Modify if needed the tagProp value for css 
			*	I just needs an object with the value of the tagProp as key
			***/
			if(propFunc !== false){
				prop = propFunc[prop];
			}

			/***
			*	Replace font=>span OR update existed span
			***/			
			if($tagChildren.length > 0) {
				
				$tagChildren.each(function()
				{
					$(this).css(cssProp, prop);
				})
				.unwrap();
				
				if(typeof(addClass) !== 'undefined')
				{
					$tagChildren.addClass(addClass);
				}
				
			}else{
				
				var cssClass = (typeof(addClass) !== 'undefined') ? 'class="'+addClass+'"' : '';

				$tag.replaceWith(function() {
					return $('<span '+cssClass+' style="'+cssProp+': ' + prop + ';">' + $(this).html() + '</span>');
				});
			}

			/***
			*	Retrieve selection
			***/	
			first = $("#memTemp1").get(0);
			last = $("#memTemp2").get(0);

	  		try{
	  			ed.setSelection(first, 0, last, 0);
	  		}catch(e){
	  			console.error(e.message);
	  		}
	      		
	      		ed.saveSelection();
			$('#memTemp1, #memTemp2').remove();

			/***
			*	Sync rte editor content with textarea
			***/			
			ed.syncCode();		
		},
	      	/* Use to get data from RTE and send them inside a textarea or input - available options: noBlank*/
	      	unescapeHtml : function(string, options) 
	      	{
	      		string = string
	      			.replace(/&amp;/g, "&")
	      			.replace(/&lt;/g, "<")
	      			.replace(/&gt;/g, ">")
	      			.replace(/&quot;/g, '"')
	      			.replace(/&#039;/g, "'");
	      			
	      		if(options == 'noBlank')
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
	      	/* Use to get data from textarea/inputs and send inside RTE - available options: noBlank & onlyBlank */
	      	escapeHtml: function(string, options) 
	      	{
	      		if( options !== 'onlyBlank' ){
	      			string = string
	      				.replace(/&/g, "&amp;")
	      				.replace(/</g, "&lt;")
	      				.replace(/>/g, "&gt;")
	      				.replace(/"/g, "&quot;")
	      				.replace(/'/g, "&#039;");
	      		}

	      		if( options !== 'noBlank' ){
	      			var emptyMark =  (this.oldIE()) ? '&nbsp;' : '<br />';
	      		
	      			string = string
	      				.replace(/\t/g, '	')
	      				.replace(/ /g, '&nbsp;')
	      				.replace(/\n/g, '</p>\n<p>')
	      				.replace(/<p><\/p>/g, '<p>'+emptyMark+'</p>');//needed
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
	exec:
	{
		xen_fonts:
		{
			dropdown: function(key)
			{
				if(key === 'xen_fontSize') {
					return this.fontSizeDp();
				}
				
				if(key === 'xen_fontNames') {
					return this.getFontNamesDp();
				}
			},
			fonts: {
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
			sizes: {
				'1':'xx-small',
				'2':'x-small',
				'3':'small',
				'4':'medium',
				'5':'large',
				'6':'x-large',
				'7':'xx-large'
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
				ed.execToSpan('font', 'attr', 'size', 'font-size', this.sizes);
			},
			commandFontName: function(ed)
			{
				ed.execToSpan('font', 'attr', 'face', 'font-family', this.fonts);
			}
		},
		xen_colors:
		{
			eraseColors: false, //Doesn't work well, better to disable it
			init: function(ed, event, key)
			{
		      	  	this.ed = ed;
		      	  	xenRedactor.colorKey = this.key = key;
		
				if (key === 'xen_colors'){
					$target = $('.xen_colors_dropdown');
				}
				else if (key === 'xen_backcolors') {
					$target = $('.xen_backcolors_dropdown');
				}
		
				if($target.length == 0) {
				  		var dropdown = $('<div class="redactor_dropdown '+key+'_dropdown" style="display:none">'),
				  		button = ed.getBtn(key);
		
			  			dropdown = this.buildColorPicker(dropdown, key);
				  		ed.dropdowns.push(dropdown.appendTo($(document.body)));
			
				  		// observing dropdown
						ed.hdlShowDropDown = $.proxy(function(e) { ed.showDropDown(e, dropdown, key); }, this);
						button.click(ed.hdlShowDropDown);
						
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
		
		      				if(mode === 'forecolor'){
	
							_self.execToSpan('font', 'attr', 'color', 'color', false);
						}
						
						if(ed.browser('msie') && mode === 'BackColor'){
	
							_self.execToSpan('font', 'attr', 'style', 'background-color', false);
						}
						else if ( mode === 'BackColor' ||  mode === 'hilitecolor'){
							//Background-color for other broswers
							_self.execToSpan('span', 'css', 'background-color', 'background-color', false);
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
			    	this.ed.loadOverlay('Colors', 'colors', 500, this.ed, this, 'callback');
		      	},		
			callback: function(ed)
			{
				Redactor_Colors.onload($('#redactor_modal'));
			}
		},
		xen_media : 
		{
			init: function(ed)
			{
				ed.loadOverlay('Media', 'media', 500, ed, this, 'callback');
			},
			callback: function(ed)
			{
				Redactor_Media.onload($('#redactor_modal'));
			}
		},
		xen_code :
		{
			init: function(ed)
			{
				ed.loadOverlay('Code', 'code', 500, ed, this, 'callback');
			},
			callback: function(ed)
			{
				Redactor_Code.onload($('#redactor_modal'));
			}
		},
		xen_link:
		{
			init: function(ed)
			{
				//
			},
			dropdown: function(){
				var builder = {
					'link' : {
						title: RLANG.link,
						func: '_xenLinkLoader'

					},
					'unlink': {
						title: RLANG.unlink,
						exec: 'unlink'
					}
				}
				return builder;
			},
			callback: function(ed)
			{
				Redactor_Link.onload($('#redactor_modal'));
			}
		}			
	}
};

RedactorPlugins.xenLoader = {
	init:function()
	{
		$.extend(this, xenRedactor.tools);
	},
	_xenLinkLoader:function()
	{
		this.loadOverlay('Link', 'link', 500, this, xenRedactor.exec.xen_link, 'callback');
	}
};

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
};

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
};

RedactorPlugins.xen_fonts = {
	init: function()
	{
		var _self = this;
		
		var callback_fontSize = 
			$.proxy(function(e) { 
				$('.redactor_dropdown:visible')
					.addClass('dp_fontsize')
					.children().click(function () {
						//Bloody undo/redo... ok wil not work here since the exec will be done after
						_self.setBuffer();
					});
			}, this);
			
		var callback_fontName = 
			$.proxy(function(e) { 
				$('.redactor_dropdown:visible')
					.addClass('dp_fontname')
					.children().click(function () {
						_self.setBuffer();
					});
			}, this);

		var fontSize = this.getBtn('xen_fontSize'), fontNames = this.getBtn('xen_fontNames');		
			
		fontSize.text(this.opts.params.xenforo.fontsize)
			.addClass('textbutton')
			.one('click', callback_fontSize);

		fontNames.text(this.opts.params.xenforo.fontfamily)
			.addClass('textbutton')
			.one('click', callback_fontName);
	}
};

