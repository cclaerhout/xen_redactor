!function($, window, document, _undefined)
{    
	Redactor_Media = 
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
			var url = $modal.find('#ctrl_url').val();

			XenForo.ajax(
				'index.php?editor/media',
				{ url: url },
				this.insert
			);
		},
		insert: function(ajaxData)
		{
			if (XenForo.hasResponseError(ajaxData))
			{
				return false;
			}
	
			if (ajaxData.matchBbCode)
			{
				var ed = XenForo.myRedactor.redactor,
				//Check if content empty: if yes wrap html with tags to avoid caret problems
				html = ($('<p>'+ed.getCode()+'</p>').text()) ? ajaxData.matchBbCode : '<p>'+ajaxData.matchBbCode+'</p>'; 

				ed.restoreSelection();
				ed.execCommand('inserthtml', html);
				ed.modalClose();
			}
			else if (ajaxData.noMatch)
			{
				alert(ajaxData.noMatch);
			}
		}
	}
}
(jQuery, this, document);