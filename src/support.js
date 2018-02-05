//ignore this JS (only used for demo purposes)

var dashboard_configurator = 
{	
	parse_id_xy: function(id)
	{
		var tempSplit = id.split("_");
		
		if(tempSplit.length <= 1)
			console.error("no xy in id!");
		
		var lastIdx = tempSplit.length - 1;
		
		var x = parseInt(tempSplit[lastIdx].charAt(0));
		var y = parseInt(tempSplit[lastIdx].charAt(1));
		
		return [x,y];
	},
	on_grid_selector_hover: function(element)  
	{
		var x = element.getAttribute("data-x");
		var y = element.getAttribute("data-y");
		dashboard_configurator.grid_choser_parameters = {x:x, y:y};
		$('#grid_chooser').children('div').each(function () 
		{
			if(this.dataset.x <= dashboard_configurator.grid_choser_parameters.x 
					&& this.dataset.y <= dashboard_configurator.grid_choser_parameters.y)
				this.classList.add("chosen");
			else
				this.classList.remove("chosen");
		});
	},
	on_grid_selector_click: function(element)
	{
		var x = element.getAttribute("data-x");
		var y = element.getAttribute("data-y");
		
		var container = $("#grid_configurator");
		
		var table = '<table style="table-layout:fixed">';
		for(var i=0; i<x; i++)
		{
			table += "<tr>";
			for(var j=0; j<y; j++)
			{
				table += "<td id='grid_configurator_cell_"+i+j+"' onclick='$(this).toggleClass(\"selected\")'></td>";
			}
			table += "</tr>";
		}
		table += "</table>";

		container.fadeOut(1,function(){container.html(table);});
		container.fadeIn(400);
		
	}
}