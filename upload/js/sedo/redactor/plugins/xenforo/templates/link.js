!function($, window, document, _undefined)
{    
	Redactor_Link = 
	{
		onload: function($modal)
		{
			var t = this;
			$modal.find('.rteTrigger').click(function() {
				t.ontrigger($modal);
			});
		},
		ontrigger: function($modal)
		{
			this.ed = xenRedactor.backup.redactor;
			var tab_selected = $('#redactor_tab_selected').val();
			var link = '', text = '', targettext = '', target = '';

			if (tab_selected === '1') // url
			{
				link = $('#ctrl_url_link').val();
				text = $('#ctrl_url_text').val();

				// test url
				var pattern = '/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/';
				//var pattern = '((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}';
				var re = new RegExp('^(http|ftp|https)://' + pattern,'i');
				var re2 = new RegExp('^' + pattern,'i');
				if (link.search(re) == -1 && link.search(re2) == 0 && this.opts.protocol !== false)
				{
					link = this.ed.opts.protocol + link;
				}

			}
			else if (tab_selected === '2') // mailto
			{
				link = 'mailto:' + $('#ctrl_mail_link').val();
				text = $('#ctrl_mail_text').val();
			}

			text = (text) ? text : link;
			
			text = this.ed.escapeHtml(text);
			link = this.ed.escapeHtml(link);

			this.insert('<a href="' + link + '">' +  text + '</a>', $.trim(text), link);
		},
		insert: function(a, text, link)
		{
			this.ed._insertLink(a, text, link, '_blank');
		}
	}
}
(jQuery, this, document);