<?php
class Sedo_Redactor_ControllerPublic_Editor extends XFCP_Sedo_Redactor_ControllerPublic_Editor
{
	public function actionRedactorDialog()
	{
		$styleId = $this->_input->filterSingle('style', XenForo_Input::UINT);
		if ($styleId)
		{
			$this->setViewStateChange('styleId', $styleId);
		}

		$dialog = $this->_input->filterSingle('dialog', XenForo_Input::STRING);
		$selectedHtmlParent = $this->_input->filterSingle('selectedHtmlParent', XenForo_Input::STRING);
		$selectedHtml = $this->_input->filterSingle('selectedText', XenForo_Input::STRING);

		$htmlCharacterLimit = 4 * XenForo_Application::get('options')->messageMaxLength;

		if ($htmlCharacterLimit && utf8_strlen($selectedHtml) > $htmlCharacterLimit)
		{
			throw new XenForo_Exception(new XenForo_Phrase('submitted_message_is_too_long_to_be_processed'), true);
		}

		$regex_url_module = '(?:(?:https?|ftp|file)://|www\.|ftp\.)[-\p{L}0-9+&@\#/%=~_|$?!:,.]*[-\p{L}0-9+&@\#/%=~_|$]';
		$regex_url = '#^(?:\s+)?<a[^>]+?(?P<url>'.$regex_url_module.')[^>]*?>(?P<urlName>.+?)</a>(?:\s+)?$#ui';
	
		$isUrl = (!empty($selectedHtmlParent) && preg_match($regex_url, $selectedHtmlParent, $matches)) ? true : false;

		if(!$isUrl)
		{
			//Should not be needed
			$isUrl = (!empty($selectedHtml) && preg_match($regex_url, $selectedHtml, $matches)) ? true : false;		
		}

		$url = (isset($matches['url'])) ? $matches['url'] : null;
		$urlName = (isset($matches['urlName'])) ? $matches['urlName'] : null;
		
		$viewParams = array(
			'javaScriptSource' => XenForo_Application::$javaScriptUrl,
			'selection' => array(
				'text' => strip_tags($selectedHtml),
				'html' => $selectedHtml,
				'bbCode' => $this->getHelper('Editor')->convertEditorHtmlToBbCode($selectedHtml, $this->_input),
				'parentText' => strip_tags($selectedHtmlParent),
				'parentHtml' => $selectedHtmlParent,
				'parentBbCode' => $this->getHelper('Editor')->convertEditorHtmlToBbCode($selectedHtmlParent, $this->_input),
				'isUrl' => $isUrl
			),
			'url' => $url,
			'urlName' => $urlName
		);

		if ($dialog == 'media')
		{
			$viewParams['sites'] = $this->_getBbCodeModel()->getAllBbCodeMediaSites();
		}

		return $this->responseView('Sedo_Redactor_ViewPublic_Editor_Dialog', 'redactor_dialog_' . $dialog, $viewParams);	
	}
}