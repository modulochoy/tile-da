tileController = function() {
    var inited = false;
    var GRID_SIZE = 5;
    var GRID_WIDTH = 200;
    var PERCENT_OVERLAP_PUSH = 30;
    return {
	init : function(wrapper) {
	    if(!inited) {
		inited = true;
		var tileWrapper = wrapper;
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
		for(var i = 1; i < (GRID_SIZE*GRID_SIZE); i++) {
		    var tileObj = {'ongrid':i, 'tileText':"i am tile "+i};
		    var tile = $('#tile').tmpl(tileObj).appendTo($(tileWrapper).find('.tile-box'));
		    tile.gridMoveTo(parseInt(i/GRID_SIZE), i%GRID_SIZE, GRID_SIZE, GRID_WIDTH);
		    tiles[i] = tile[0];
		}
		var firstTile = $('#tile').tmpl({'tileText':"DRAG ME"}).appendTo($(tileWrapper).find('.tile-drag'));
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
		
		var gridOverlaps = firstTile.filterCollide(grid);
		var tileOverlaps = [];
		var prevGrid = gridOverlaps[0].object;

		firstTile.draggable({
		    start:function() {
			if(gridOverlaps.length > 0) {
			    prevGrid = gridOverlaps[0].object;
			}
		    },
		    drag:function() {
			var gridNum;
			gridOverlaps = firstTile.filterCollide(grid);
			grid.removeClass('tile-hover');
			tiles.forEach(function(tile) {
			    $(tile).removeClass('tile-bullied');
			});
			if(gridOverlaps.length > 0) {
			    var bestGrid = gridOverlaps[0].object;
			    $(bestGrid).addClass('tile-hover');
			    gridNum = $(bestGrid).attr('gridnum');
			    
			    if(tiles[gridNum]) {
				var currTile = tiles[gridNum];
				$(currTile).addClass('tile-bullied');
				//move me
				//tell me which adjacent grids are open
				var adjacentGrids = $(currTile).adjacentGrids(GRID_SIZE);
				var availableGrids = adjacentGrids.filter(function(i) {
				    return !(tiles[i]);
				});
				if(availableGrids.length > 0) {
				    //TODO: refactor moving tile to a grid spot ie. refactor calculating row and col
				    var availGrid = parseInt(availableGrids[0]);
				    var row = Math.floor(availGrid / GRID_SIZE);
				    var col = availGrid % GRID_SIZE;
				    //TODO: refactor to combine gridMoveTo and change onGrid attribute AND ALDO tile attribute updates
				    $(currTile).gridMoveTo(row, col, GRID_SIZE, GRID_WIDTH);
				    $(currTile).attr('ongrid', availGrid);
				    $().swap(gridNum, availGrid, tiles);
				    $(currTile).removeClass('tile-bullied');
				    
				}
			    }
			}
			/*
			if(tileOverlaps.length > 1) {
			    var percentOverlap = (tileOverlaps[1].overlap/(GRID_WIDTH*GRID_WIDTH))*100;
			    if(percentOverlap > PERCENT_OVERLAP_PUSH) {
				var bulliedTile = tileOverlaps[1].object;
				$(bulliedTile).addClass('tile-bullied');
				//move bulliedTile here
			    }
			}
			*/
		    },
		    stop:function() {
			gridOverlaps = firstTile.filterCollide(grid);
			grid.removeClass('tile-hover');
			if(gridOverlaps.length > 0) {
			    var bestGrid = gridOverlaps[0].object;
			    firstTile.goToMid($(bestGrid));
			} else {
			    firstTile.goToMid($(prevGrid));
			}
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
