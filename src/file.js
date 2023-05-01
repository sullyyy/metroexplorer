let stationsToLoadStr = ["./data/stations/OKHOTNY RYAD.json","./data/stations/TEATRAL'NAYA.json"];
let stationsData = [];

class File {
    constructor () {
		
	}
	
	//loading stations map data
	static loadStationsData()
	{
		for(let i = 0; i < stationsToLoadStr.length; i++)
			{
				loadJSON(stationsToLoadStr[i], 
					function loadjson(json)
					{
						stationsData.push(json);
						
					}
				);
			}
		
		
	}
	
	//loading assets data
	static loadAssets()
	{
		loadJSON("./data/assets.json", function loadAssets_c(json){
			assets_array = json;
		}
		
		);
		
	}
	
	//saving level
	static save(obj,name)
	{
		saveJSON(obj,name + ".json");
	}
}

//loading a file map
function handleFile(file)
{
	map.levels[map.curent_level].lvl_array = file.data;
	editor.fileInputloadB.elt.value = "";
	editor.buttonsAssArr["fileInputloadB"].elt.blur();
	map.levels[map.curent_level].sort();
}








