!function($, window, document, _undefined)
{    
	Redactor_Code = 
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
			var code = $modal.find('#ctrl_code').val(),
			type = $modal.find('#ctrl_type').val();

			switch (type)
			{
				case 'html':
					tag = 'HTML';
					break;
				case 'php':  
					tag = 'PHP';
					break;
				default:
					tag = 'CODE';
			}
			
			code = RedactorPlugins.xenforo.escapeHtml(code, 'space');
			
			output = '[' + tag + ']' + code + '[/' + tag + ']';
			if (output.match(/\n/))
			{
				output = '<p>' + output + '</p>';
			}

			this.insert(output);
		},
		insert: function(output)
		{
      			var ed = XenForo.myRedactor.redactor,
      			//Check if content empty: if yes wrap html with tags to avoid caret problems
      			html = ($('<p>'+ed.getCode()+'</p>').text()) ? output : '<p>'+output+'</p>'; 

      			ed.$editor.focus();
      			ed.restoreSelection();
      			ed.execCommand('inserthtml', html);
      			ed.modalClose();
		}
	}
}
(jQuery, this, document);