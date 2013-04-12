//@From TinyMCE - GNU LESSER GENERAL PUBLIC LICENSE
!function($, window, document, _undefined)
{    
	Redactor_Colors = 
	{
		detail: 50,
		strhex: "0123456789abcdef",
		isMouseDown:false,
		isMouseOver:false,
		startColor:'#888888',
		livePreview:false,
		colors: [
			"#000000","#000033","#000066","#000099","#0000cc","#0000ff","#330000","#330033",
			"#330066","#330099","#3300cc","#3300ff","#660000","#660033","#660066","#660099",
			"#6600cc","#6600ff","#990000","#990033","#990066","#990099","#9900cc","#9900ff",
			"#cc0000","#cc0033","#cc0066","#cc0099","#cc00cc","#cc00ff","#ff0000","#ff0033",
			"#ff0066","#ff0099","#ff00cc","#ff00ff","#003300","#003333","#003366","#003399",
			"#0033cc","#0033ff","#333300","#333333","#333366","#333399","#3333cc","#3333ff",
			"#663300","#663333","#663366","#663399","#6633cc","#6633ff","#993300","#993333",
			"#993366","#993399","#9933cc","#9933ff","#cc3300","#cc3333","#cc3366","#cc3399",
			"#cc33cc","#cc33ff","#ff3300","#ff3333","#ff3366","#ff3399","#ff33cc","#ff33ff",
			"#006600","#006633","#006666","#006699","#0066cc","#0066ff","#336600","#336633",
			"#336666","#336699","#3366cc","#3366ff","#666600","#666633","#666666","#666699",
			"#6666cc","#6666ff","#996600","#996633","#996666","#996699","#9966cc","#9966ff",
			"#cc6600","#cc6633","#cc6666","#cc6699","#cc66cc","#cc66ff","#ff6600","#ff6633",
			"#ff6666","#ff6699","#ff66cc","#ff66ff","#009900","#009933","#009966","#009999",
			"#0099cc","#0099ff","#339900","#339933","#339966","#339999","#3399cc","#3399ff",
			"#669900","#669933","#669966","#669999","#6699cc","#6699ff","#999900","#999933",
			"#999966","#999999","#9999cc","#9999ff","#cc9900","#cc9933","#cc9966","#cc9999",
			"#cc99cc","#cc99ff","#ff9900","#ff9933","#ff9966","#ff9999","#ff99cc","#ff99ff",
			"#00cc00","#00cc33","#00cc66","#00cc99","#00cccc","#00ccff","#33cc00","#33cc33",
			"#33cc66","#33cc99","#33cccc","#33ccff","#66cc00","#66cc33","#66cc66","#66cc99",
			"#66cccc","#66ccff","#99cc00","#99cc33","#99cc66","#99cc99","#99cccc","#99ccff",
			"#cccc00","#cccc33","#cccc66","#cccc99","#cccccc","#ccccff","#ffcc00","#ffcc33",
			"#ffcc66","#ffcc99","#ffcccc","#ffccff","#00ff00","#00ff33","#00ff66","#00ff99",
			"#00ffcc","#00ffff","#33ff00","#33ff33","#33ff66","#33ff99","#33ffcc","#33ffff",
			"#66ff00","#66ff33","#66ff66","#66ff99","#66ffcc","#66ffff","#99ff00","#99ff33",
			"#99ff66","#99ff99","#99ffcc","#99ffff","#ccff00","#ccff33","#ccff66","#ccff99",
			"#ccffcc","#ccffff","#ffff00","#ffff33","#ffff66","#ffff99","#ffffcc","#ffffff"
		],
		named:  {
			'#F0F8FF':'Alice Blue','#FAEBD7':'Antique White','#00FFFF':'Aqua','#7FFFD4':'Aquamarine','#F0FFFF':'Azure','#F5F5DC':'Beige',
			'#FFE4C4':'Bisque','#000000':'Black','#FFEBCD':'Blanched Almond','#0000FF':'Blue','#8A2BE2':'Blue Violet','#A52A2A':'Brown',
			'#DEB887':'Burly Wood','#5F9EA0':'Cadet Blue','#7FFF00':'Chartreuse','#D2691E':'Chocolate','#FF7F50':'Coral','#6495ED':'Cornflower Blue',
			'#FFF8DC':'Cornsilk','#DC143C':'Crimson','#00FFFF':'Cyan','#00008B':'Dark Blue','#008B8B':'Dark Cyan','#B8860B':'Dark Golden Rod',
			'#A9A9A9':'Dark Gray','#A9A9A9':'Dark Grey','#006400':'Dark Green','#BDB76B':'Dark Khaki','#8B008B':'Dark Magenta','#556B2F':'Dark Olive Green',
			'#FF8C00':'Darkorange','#9932CC':'Dark Orchid','#8B0000':'Dark Red','#E9967A':'Dark Salmon','#8FBC8F':'Dark Sea Green','#483D8B':'Dark Slate Blue',
			'#2F4F4F':'Dark Slate Gray','#2F4F4F':'Dark Slate Grey','#00CED1':'Dark Turquoise','#9400D3':'Dark Violet','#FF1493':'Deep Pink','#00BFFF':'Deep Sky Blue',
			'#696969':'Dim Gray','#696969':'Dim Grey','#1E90FF':'Dodger Blue','#B22222':'Fire Brick','#FFFAF0':'Floral White','#228B22':'Forest Green',
			'#FF00FF':'Fuchsia','#DCDCDC':'Gainsboro','#F8F8FF':'Ghost White','#FFD700':'Gold','#DAA520':'Golden Rod','#808080':'Gray','#808080':'Grey',
			'#008000':'Green','#ADFF2F':'Green Yellow','#F0FFF0':'Honey Dew','#FF69B4':'Hot Pink','#CD5C5C':'Indian Red','#4B0082':'Indigo','#FFFFF0':'Ivory',
			'#F0E68C':'Khaki','#E6E6FA':'Lavender','#FFF0F5':'Lavender Blush','#7CFC00':'Lawn Green','#FFFACD':'Lemon Chiffon','#ADD8E6':'Light Blue',
			'#F08080':'Light Coral','#E0FFFF':'Light Cyan','#FAFAD2':'Light Golden Rod Yellow','#D3D3D3':'Light Gray','#D3D3D3':'Light Grey','#90EE90':'Light Green',
			'#FFB6C1':'Light Pink','#FFA07A':'Light Salmon','#20B2AA':'Light Sea Green','#87CEFA':'Light Sky Blue','#778899':'Light Slate Gray','#778899':'Light Slate Grey',
			'#B0C4DE':'Light Steel Blue','#FFFFE0':'Light Yellow','#00FF00':'Lime','#32CD32':'Lime Green','#FAF0E6':'Linen','#FF00FF':'Magenta','#800000':'Maroon',
			'#66CDAA':'Medium Aqua Marine','#0000CD':'Medium Blue','#BA55D3':'Medium Orchid','#9370D8':'Medium Purple','#3CB371':'Medium Sea Green','#7B68EE':'Medium Slate Blue',
			'#00FA9A':'Medium Spring Green','#48D1CC':'Medium Turquoise','#C71585':'Medium Violet Red','#191970':'Midnight Blue','#F5FFFA':'Mint Cream','#FFE4E1':'Misty Rose','#FFE4B5':'Moccasin',
			'#FFDEAD':'Navajo White','#000080':'Navy','#FDF5E6':'Old Lace','#808000':'Olive','#6B8E23':'Olive Drab','#FFA500':'Orange','#FF4500':'Orange Red','#DA70D6':'Orchid',
			'#EEE8AA':'Pale Golden Rod','#98FB98':'Pale Green','#AFEEEE':'Pale Turquoise','#D87093':'Pale Violet Red','#FFEFD5':'Papaya Whip','#FFDAB9':'Peach Puff',
			'#CD853F':'Peru','#FFC0CB':'Pink','#DDA0DD':'Plum','#B0E0E6':'Powder Blue','#800080':'Purple','#FF0000':'Red','#BC8F8F':'Rosy Brown','#4169E1':'Royal Blue',
			'#8B4513':'Saddle Brown','#FA8072':'Salmon','#F4A460':'Sandy Brown','#2E8B57':'Sea Green','#FFF5EE':'Sea Shell','#A0522D':'Sienna','#C0C0C0':'Silver',
			'#87CEEB':'Sky Blue','#6A5ACD':'Slate Blue','#708090':'Slate Gray','#708090':'Slate Grey','#FFFAFA':'Snow','#00FF7F':'Spring Green',
			'#4682B4':'Steel Blue','#D2B48C':'Tan','#008080':'Teal','#D8BFD8':'Thistle','#FF6347':'Tomato','#40E0D0':'Turquoise','#EE82EE':'Violet',
			'#F5DEB3':'Wheat','#FFFFFF':'White','#F5F5F5':'White Smoke','#FFFF00':'Yellow','#9ACD32':'Yellow Green'
		},
		namedLookup: {},
		getKey: function()
		{
			return xenRedactor.colorKey;
		},
		getMode: function()
		{
			var ed = xenRedactor.backup.redactor,
			key = xenRedactor.colorKey;

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
			return mode;		
		},
		onload: function($modal){
			var t = this;
			
			/*Params*/
			var params =  xenRedactor.backup.redactor.opts.params.xenforo;
			t.startColor = (typeof(params.startColor) !== 'undefined') ? params.startColor : t.startColor;
	
			/*Mouse manager*/
			$('#redactor_rgb_tab')
				.click(function() { 
					t.generateWebColors();
				})
				.mousedown(function() {
					return false;
				});

			$('#redactor_named_tab')
				.click(function() { 
					t.generateNamedColors();
				})
				.mousedown(function() {
					return false;
				});
			
			$('#redactor_colors')
				.click(function(e) {
					t.computeColor(e);
				})
				.mousedown(function() {
					t.isMouseDown = true;
					return false;
				})
				.mouseup(function() {
					t.isMouseDown = false;
					return false;
				})
				.mousemove(function(e) {
					if(t.isMouseDown && t.isMouseOver) {
						t.computeColor(e);
						return false;				
					}
				})
				.mouseover(function() {
					t.isMouseOver = true;
				})
				.mouseout(function() {
					t.isMouseOver = false;
				});


			$modal.find('.rteTrigger').click(function() {
				t.ontrigger($modal);
			});

			/*Cleaner*/
			var ed = xenRedactor.backup.redactor,
			key = t.getKey();
			ed.$editor.find('.'+key+'_tmp').removeClass(key+'_tmp');

			/*init*/
			this.init();
		},
		init: function() {
			var t = Redactor_Colors;
			$rc = $('input#redactor_color');
			var inputColor = t.convertRGBToHex($rc.val()), key, value;

			if(!inputColor){
				inputColor = t.startColor;
			}
		
			t.generatePicker();
			t.generateWebColors();
			t.generateNamedColors();
		
			t.changeFinalColor(inputColor);
		
			col = t.convertHexToRGB(inputColor);
		
			if (col)
				t.updateLight(col.r, col.g, col.b);
			
			for (key in this.named) {
				value = this.named[key];
				t.namedLookup[value.replace(/\s+/, '').toLowerCase()] = key.replace(/#/, '').toLowerCase();
			}
		},
		ontrigger: function($modal) {
			var ed = xenRedactor.backup.redactor,
			key = this.getKey();
			
			ed.setBuffer();

			this.insertAction();
		
			ed.$editor.find('.'+key+'_tmp').removeClass(key+'_tmp');
			ed.syncCode();
			ed.modalClose();
		},
		insertAction: function() {
			var ed = xenRedactor.backup.redactor,
			color = $('#redactor_color').val(),
			key = Redactor_Colors.getKey(),
			mode = Redactor_Colors.getMode();
			
			$target = ed.$editor.find('.'+key+'_tmp');

      			ed.$editor.focus();
      			ed.restoreSelection();
			var hasSelection = ed.getSelectedHtml();
		
			if($target.length != 0){
				if(key === 'xen_colors'){
					$target.css('color', color);
				}
				else{
					$target.css('background-color', color);				
				}
			}
			else{
	      			if(hasSelection){
	      				ed.execCommand(mode, color);

	      				if(mode === 'forecolor'){

						ed.execToSpan('font', 'attr', 'color', 'color', false, key+'_tmp');
					}
					
					if(ed.browser('msie') && mode === 'BackColor'){

						ed.execToSpan('font', 'attr', 'style', 'background-color', false, key+'_tmp');
					}
					else if ( mode === 'BackColor' ||  mode === 'hilitecolor'){
						//Background-color for other broswers
						ed.execToSpan('span', 'css', 'background-color', 'background-color', false, key+'_tmp');
					}
		      		}else {
	      				if(key === 'xen_colors'){
						ed.execCommand('inserthtml', '<span class="'+key+'_tmp" style="color: ' + color + ';"></span>');
					}
					else{
						ed.execCommand('inserthtml', '<span class="'+key+'_tmp" style="background-color: ' + color + ';"></span>');
					}

					$target = $('.'+key+'_tmp').get(0);
		      			ed.setSelection($target, 0, $target, 0);
		      			ed.saveSelection();
		      		}
	      		}
		},	
		toHexColor: function(color) {
			var matches, red, green, blue, toInt = parseInt;
		
			function hex(value) {
				value = parseInt(value).toString(16);
		
				return value.length > 1 ? value : '0' + value; // Padd with leading zero
			};
		
			color = color.replace(/[\s#]+/g, '').toLowerCase();
			color = this.namedLookup[color] || color;
			matches = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})|([a-f0-9])([a-f0-9])([a-f0-9])$/.exec(color);
		
			if (matches) {
				if (matches[1]) {
					red = toInt(matches[1]);
					green = toInt(matches[2]);
					blue = toInt(matches[3]);
				} else if (matches[4]) {
					red = toInt(matches[4], 16);
					green = toInt(matches[5], 16);
					blue = toInt(matches[6], 16);
				} else if (matches[7]) {
					red = toInt(matches[7] + matches[7], 16);
					green = toInt(matches[8] + matches[8], 16);
					blue = toInt(matches[9] + matches[9], 16);
				}
		
				return '#' + hex(red) + hex(green) + hex(blue);
			}
		
			return '';
		},
		showColor: function(color, name) {
			if (name)
				$('#redactor_colorname').html(name);
		
			$('#redactor_preview').css('backgroundColor', color);
			//$('#redactor_color').val(color.toUpperCase());
		},
		convertRGBToHex: function (col) {
			var re = new RegExp("rgb\\s*\\(\\s*([0-9]+).*,\\s*([0-9]+).*,\\s*([0-9]+).*\\)", "gi");
		
			if (!col)
				return col;
		
			var rgb = col.replace(re, "$1,$2,$3").split(',');
			if (rgb.length == 3) {
				r = parseInt(rgb[0]).toString(16);
				g = parseInt(rgb[1]).toString(16);
				b = parseInt(rgb[2]).toString(16);
		
				r = r.length == 1 ? '0' + r : r;
				g = g.length == 1 ? '0' + g : g;
				b = b.length == 1 ? '0' + b : b;
		
				return "#" + r + g + b;
			}
		
			return col;
		},
		convertHexToRGB: function (col) {
			if (col.indexOf('#') != -1) {
				col = col.replace(new RegExp('[^0-9A-F]', 'gi'), '');
		
				r = parseInt(col.substring(0, 2), 16);
				g = parseInt(col.substring(2, 4), 16);
				b = parseInt(col.substring(4, 6), 16);
		
				return {r : r, g : g, b : b};
			}
		
			return null;
		},
		generatePicker: function () {
			var t = this, h = '', i;
		
			for (i = 0; i < this.detail; i++){
				h += '<div id="redactor_gs'+i+'" class="redactor_gs" style="background-color:#000000; width:15px; height:3px; border-style:none; border-width:0px;"></div>';
			}
		
			$('#redactor_light').html(h);
			
			$('.redactor_gs').each(function(index, value) {
				
				var $e = $(this);

				$(this).click(function() {
					t.changeFinalColor($e.css('background-color'));
				})
				.mousedown(function() {
					t.isMouseDown = true;
					return false;
				})
				.mouseup(function() {
					t.isMouseDown = false;
					return false;
				})
				.mousemove(function() {
					if(t.isMouseDown && t.isMouseOver) {
						t.changeFinalColor($e.css('background-color'));
					}
				})
				.mouseover(function() {
					t.isMouseOver = true;
				})
				.mouseout(function() {
					t.isMouseOver = false;
				});
			});
		},
		generateWebColors: function() {
			var t = Redactor_Colors;
			var $el = $('#redactor_webcolors'), h = '', i;
		
			if ($el.hasClass('generated'))
				return;
		
			var href = (t.livePreview === true) ? 'href="javascript:Redactor_Colors.insertAction();"' : '';
		
			h += '<div role="listbox" aria-labelledby="webcolors_title" tabindex="0"><table role="presentation" border="0" cellspacing="1" cellpadding="0">'
				+ '<tr>';
		
			for (i=0; i<t.colors.length; i++) {
				h += '<td bgcolor="' + t.colors[i] + '" width="10" height="10">'
					+ '<a '+href+' role="option" tabindex="-1" aria-labelledby="web_colors_' + i + '" onclick="Redactor_Colors.changeFinalColor(\'' + t.colors[i] + '\');" class="redactor_mce_webcolors">';
				h += '<span class="mceVoiceLabel" style="display:none;" id="web_colors_' + i + '">' + t.colors[i].toUpperCase() + '</span>';
				h += '</a></td>';
				if ((i+1) % 18 == 0)
					h += '</tr><tr>';
			}
		
			h += '</table></div>';
		
			$el.html(h).addClass('generated');
		
			t.paintCanvas($el);
			t.enableKeyboardNavigation($el.first());
		},
		paintCanvas: function ($el) {
			$el.add('canvas.mceColorSwatch').each(function(index, canvas) { 
				var context;
				if (canvas.getContext && (context = canvas.getContext("2d"))) {
					context.fillStyle = canvas.getAttribute('data-color');
					context.fillRect(0, 0, 10, 10);
				}
			});
		},
		generateNamedColors: function()  {
			var t = Redactor_Colors;
			var $el = $('#redactor_namedcolors'), h = '', n, v, i = 0;
		
			if ($el.hasClass('generated'))
				return;

			var href = (t.livePreview === true) ? 'href="javascript:Redactor_Colors.insertAction();"' : '';

			for (n in t.named) {
				v = t.named[n];
				h += '<a '+href+' role="option" tabindex="-1" aria-labelledby="named_colors_' + i + '" onclick="Redactor_Colors.changeFinalColor(\'' + n + '\',\'' + v + '\');Redactor_Colors.showColor(\'' + n + '\',\'' + v + '\');" style="background-color: ' + n + '">';
				h += '<span class="mceVoiceLabel" style="display:none;" id="named_colors_' + i + '">' + v + '</span>';
				h += '</a>';
				i++;
			}

			$el.html(h).addClass('generated');
		
			t.paintCanvas($el);
			t.enableKeyboardNavigation($el.first());
		},
		enableKeyboardNavigation: function ($el) {
			/*
				To recreate if needed
			*/
		},
		dechex: function (n) {
			return this.strhex.charAt(Math.floor(n / 16)) + this.strhex.charAt(n % 16);
		},
		computeColor: function (e) {
			var t = Redactor_Colors;
			$src = $('#redactor_colors');
			var x, y, partWidth, partDetail, imHeight, r, g, b, coef, i, finalCoef, finalR, finalG, finalB, pos = $src.offset();

			x = e.offsetX ? e.offsetX : (e.target ? e.clientX - pos.left : 0);
			y = e.offsetY ? e.offsetY : (e.target ? e.pageY - pos.top : 0);

			partWidth = $src.width() / 6;
			partDetail = t.detail / 2;
			imHeight = $src.height();

			r = (x >= 0)*(x < partWidth)*255 + (x >= partWidth)*(x < 2*partWidth)*(2*255 - x * 255 / partWidth) + (x >= 4*partWidth)*(x < 5*partWidth)*(-4*255 + x * 255 / partWidth) + (x >= 5*partWidth)*(x < 6*partWidth)*255;
			g = (x >= 0)*(x < partWidth)*(x * 255 / partWidth) + (x >= partWidth)*(x < 3*partWidth)*255	+ (x >= 3*partWidth)*(x < 4*partWidth)*(4*255 - x * 255 / partWidth);
			b = (x >= 2*partWidth)*(x < 3*partWidth)*(-2*255 + x * 255 / partWidth) + (x >= 3*partWidth)*(x < 5*partWidth)*255 + (x >= 5*partWidth)*(x < 6*partWidth)*(6*255 - x * 255 / partWidth);
		
			coef = (imHeight - y) / imHeight;
			r = 128 + (r - 128) * coef;
			g = 128 + (g - 128) * coef;
			b = 128 + (b - 128) * coef;
		
			t.changeFinalColor('#' + t.dechex(r) + t.dechex(g) + t.dechex(b));
			t.updateLight(r, g, b);
			
			if(t.livePreview === true)
				t.insertAction();
		},
		updateLight: function (r, g, b) {
			var i, partDetail = this.detail / 2, finalCoef, finalR, finalG, finalB, color;
		
			for (i=0; i<this.detail; i++) {
				if ((i>=0) && (i<partDetail)) {
					finalCoef = i / partDetail;
					finalR = this.dechex(255 - (255 - r) * finalCoef);
					finalG = this.dechex(255 - (255 - g) * finalCoef);
					finalB = this.dechex(255 - (255 - b) * finalCoef);
				} else {
					finalCoef = 2 - i / partDetail;
					finalR = this.dechex(r * finalCoef);
					finalG = this.dechex(g * finalCoef);
					finalB = this.dechex(b * finalCoef);
				}
		
				color = finalR + finalG + finalB;
		
				this.setCol($('#redactor_gs'+i), '#'+color);
			}
		},
		changeFinalColor: function(color) {
			if (color.indexOf('#') == -1)
				color = this.convertRGBToHex(color);
		
			this.setCol($('#redactor_preview'), color);
			$('#redactor_color').val(color);
		},
		setCol: function($e, color) {
			try {
				$e.css('background-color', color);
			} catch (ex) {
				// Ignore IE warning
			}
		}		
	}
}
(jQuery, this, document);
