if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

RedactorPlugins.xenforo = {
	init:function(obj, event, key)
	{
	      	switch (key) {
      		case 'xen_undo': 
      			obj.execCommand('undo', false);
      			break;
      		case 'xen_redo': 
      			obj.execCommand('redo', false);
      			break;
      		case 'xen_removeformat':
      			obj.inactiveAllButtons(); 
      			obj.execCommand('removeformat', false);
      			break;
      		case 'xen_media':
      			RedactorPlugins.media.init(obj); 
      			break;
	      	}
	},
	loadOverlay:function(title, dialog, width, redactor, src, callback)
	{
		var t = RedactorPlugins.xenforo,
		selectedHtmlParent = $(redactor.getParentNode()).html(),
		selectedHtml = redactor.getSelectedHtml;
		
		if (typeof(callback) !== 'string' ||  typeof(src[callback]) !== 'function')
		{
			callback = false;
		}

		redactor.saveSelection();
		redactor.setBuffer();

		XenForo.myRedactor = {
			title: title,
			template: false,
			width: width,
			redactor: redactor,
			src: src,
			callback: callback,
			selectedHtmlParent: selectedHtml,
			selectedHtml: selectedHtml
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
     
RedactorPlugins.xenforo_swith = {
     
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
RedactorPlugins.media = {

	init: function(redactor)
	{
		RedactorPlugins.xenforo.loadOverlay('Media', 'media', 500, redactor, RedactorPlugins.media, 'callback');
	},
	callback: function(redactor)
	{
		Redactor_Media.onload($('#redactor_modal'));
	}
}


