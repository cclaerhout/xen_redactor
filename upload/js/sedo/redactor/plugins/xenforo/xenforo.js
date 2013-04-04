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
	      	}
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
}