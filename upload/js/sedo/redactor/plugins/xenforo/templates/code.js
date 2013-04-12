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
			var ed = xenRedactor.backup.redactor,
			code = $modal.find('#ctrl_code').val(),
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
			
			code = ed.escapeHtml(code);
			
			output = '[' + tag + ']' + code + '[/' + tag + ']';
			if (output.match(/\n/))
			{
				output = '<p>' + output + '</p>';
			}

			this.insert(ed, output);
		},
		insert: function(ed, output)
		{
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