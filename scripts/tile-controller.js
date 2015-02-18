tileController = function() {
    var inited = false;
    var GRID_SIZE = 3;
    var GRID_WIDTH = 250;
    var PERCENT_OVERLAP_PUSH = 30;
    var IMAGE_PATH = "images/donut_";
    return {
	init : function(wrapper) {
	    if(!inited) {
		inited = true;
		var tileWrapper = wrapper;
		var tileFns = [];
		var tiles = [];
		
		//set up grid
		for(var i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
		    var gridObj = {'gridnum':i};		    
		    var gridCell = $('#tileGrid').tmpl(gridObj).appendTo($(tileWrapper).find('.tile-box'));
		    var row = Math.floor(i / GRID_SIZE);
		    var col = i % GRID_SIZE;
		    $(gridCell).gridMoveTo(row, col, GRID_SIZE, GRID_WIDTH);		    
		    $(gridCell).disableSelection();
		    //TODO: add grid to grids array here
		}
		//set up tiles
		for(var i = 0; i < (GRID_SIZE*GRID_SIZE); i++) {
		    var tileObj = {'name':i, 'ongrid':i, 'imgPath':IMAGE_PATH+i+'.png'};
		    var tile = $('#tile').tmpl(tileObj).appendTo($(tileWrapper).find('.tile-drag'));
		    tile.gridMoveTo(parseInt(i/GRID_SIZE), i%GRID_SIZE, GRID_SIZE, GRID_WIDTH);
		    tileFns[i] = tile;
		    tiles[i] = tile[0];
		}
		//mix up tiles
		

		//var firstTile = $('#tile').tmpl({'tileText':"DRAG ME"}).appendTo($(tileWrapper).find('.tile-drag'));
		//TODO?: refactor init of sizing
		var tileBox = $(tileWrapper).find('.tile-box');
		var tileDrag = $(tileWrapper).find('.tile-drag');
		$(tileBox).width(GRID_SIZE*GRID_WIDTH);
		$(tileBox).height(GRID_SIZE*GRID_WIDTH);
		$(tileDrag).width(GRID_SIZE*GRID_WIDTH);
		$(tileDrag).height(GRID_SIZE*GRID_WIDTH);
		$(tileWrapper).disableSelection();
		
		//TODO?: this is part of the refactoring of init sizing
		var fontSize = parseInt(GRID_WIDTH/8);
		$('.tile').css({'width':GRID_WIDTH, 'height':GRID_WIDTH, 'line-height':GRID_WIDTH+'px'});
		$('.tile-grid').css({'width':GRID_WIDTH, 'height':GRID_WIDTH, 'line-height':GRID_WIDTH+'px'});
		grid = $(tileWrapper).find('.tile-grid');
		
		var gridOverlaps = [];//firstTile.filterCollide(grid);
		var tileOverlaps = [];
		var prevGrid;// = gridOverlaps[0].object;		
		var dragTile;
		var onGrid;
		//TODO: lock to prevent dragging other things when tiles are still moving to correct location
		$(tileFns).draggable({		    
		    start:function() {
			dragTile = this;
			onGrid = $(this).attr('ongrid');
			//tiles[onGrid] = null;
			console.log('START: '+onGrid);
			$(this).css('z-index',1000);
			if(gridOverlaps.length > 0) {
			    prevGrid = gridOverlaps[0].object;
			}
		    },
		    drag:function() {
			var gridNum;
			gridOverlaps = $(this).filterCollide(grid);
			grid.removeClass('tile-hover');
			tiles.forEach(function(tile) {
			    $(tile).removeClass('tile-bullied');
			});
			if(gridOverlaps.length > 0) {
			    //console.log(gridOverlaps[0].gridnum);
			    var bestGrid = gridOverlaps[0].object;
			    var dragGrid = $(this).attr('ongrid');
			    $(bestGrid).addClass('tile-hover');
			    gridNum = $(bestGrid).attr('gridnum');
			    if(gridNum != dragGrid && tiles[gridNum]) {
				var bulliedTile = tiles[gridNum];
				$(bulliedTile).addClass('tile-bullied');
				//tell me which adjacent grids are open
				var adjacentGrids = $(bulliedTile).adjacentGrids(GRID_SIZE);
				var availableGrids = adjacentGrids.filter(function(i) {
				    if(i == dragGrid) {
					return true;
				    }
				    return !(tiles[i]);
				});
				//console.log(availableGrids);
				if(availableGrids.length > 0) {
				    //TODO: refactor moving tile to a grid spot ie. refactor calculating row and col
				    var availGrid = parseInt(availableGrids[0]);
				    var row = Math.floor(availGrid / GRID_SIZE);
				    var col = availGrid % GRID_SIZE;
				    //TODO: refactor to combine gridMoveTo and change onGrid attribute AND tile attribute updates
				    $(bulliedTile).gridMoveTo(row, col, GRID_SIZE, GRID_WIDTH);
				    $(this).attr('ongrid', gridNum);
				    $(bulliedTile).attr('ongrid', availGrid);
				    $().swap(gridNum, availGrid, tiles);
				    //combine swap up to here
				    $(bulliedTile).removeClass('tile-bullied');
				    //$().displayTiles(tiles);
				}
			    }
			}
		    },
		    stop:function() {
			gridOverlaps = $(this).filterCollide(grid);
			grid.removeClass('tile-hover');
			//var empty = $().getEmptyTile(tiles);
			
			//tiles[empty] = this;
			console.log("======");
			$().displayTiles(tiles);
			if(gridOverlaps.length > 0) {
			    var bestGrid = gridOverlaps[0].object;
			    $(this).goToMid($(bestGrid));
			} else {
			    //TODO: change this to move to empty spot
			    $(this).goToMid($(prevGrid));
			}
			console.log($(this).attr('ongrid'));
			$(this).css('z-index', $(this).attr('ongrid'));
		    }
		});

		/*
		tiles.click(function(evt) {
		    $(evt.target).toggleClass('tile-select');
		});
		*/
	    }
	}
    };
}();
