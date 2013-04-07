<?php
class Sedo_Redactor_Listener_ControllerPublic
{
	public static function listen($class, array &$extend)
	{
		if ($class == 'XenForo_ControllerPublic_Editor')
        	{
			$extend[] = 'Sedo_Redactor_ControllerPublic_Editor';
		}
	}
}