tileController = function() {
    var tileBox;
    var inited = false;
    var GRID_SIZE = 3;
    var GRID_WIDTH = 250;
    return {
	init : function(box) {
	    if(!inited) {
		tileBox = box;
		$(tileBox).disableSelection();
		//setup grid
		for(var i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
		    var gridObj = {'gridNum':i};
		    var gridCell = $('#tileGrid').tmpl(gridObj).appendTo($(tileBox).find('.tile-box'));
		    var row = Math.floor(i / GRID_SIZE);
		    var col = i % GRID_SIZE;
		    $(gridCell).animate({
			'top' : row*GRID_WIDTH+'px',
			'left' : col*GRID_WIDTH+'px'			
		    });
		    $(gridCell).disableSelection();
		}

		firstTile = $('#tile').tmpl().appendTo($(tileBox).find('.tile-box'));
		//firstTile.draggable({revert:'invalid'});
		grid = $(tileBox).find('.tile-grid');
		
		var overlaps = firstTile.filterCollide(grid);
		var prevGrid = overlaps[0].object;

		firstTile.draggable({
		    start:function() {
			if(overlaps.length > 0) {
			    prevGrid = overlaps[0].object;
			}
		    },
		    drag:function() {
			overlaps = firstTile.filterCollide(grid);
			grid.removeClass('tile-hover');
			if(overlaps.length > 0) {
			    var bestGrid = overlaps[0].object;
			    $(bestGrid).addClass('tile-hover');
			}
		    },
		    stop:function() {
			overlaps = firstTile.filterCollide(grid);
			grid.removeClass('tile-hover');
			if(overlaps.length > 0) {
			    var bestGrid = overlaps[0].object;
			    firstTile.goToMid($(bestGrid));
			} else {
			    firstTile.goToMid($(prevGrid));
			}
		    }
		});

		//tiles = $(tileBox).find('.tile');

		/*
		tiles.click(function(evt) {
		    $(evt.target).toggleClass('tile-select');
		});
		*/
	    }
	}
    }
}();
