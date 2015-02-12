(function($) {
    $.fn.extend({
	toObject: function() {
            var result = {}
            $.each(this.serializeArray(), function(i, v) {
		result[v.name] = v.value;
            });
	    return result;
        },
	/*
	  * obj and dest must be siblings
	  */
	goToMid: function(obj) {
	    $(this).animate({
		'left':(obj.outerWidth() - this.outerWidth())/2 + obj.position().left,
		'top':(obj.outerHeight() - this.outerHeight())/2 + obj.position().top
	    });
	},
	/*
	 * acts like a filter: returns list of items that collide w/ object
	 * arr items should have same parent as 'this'
	 * sorts according to most surface area first
	 */
	filterCollide: function(arr) {
	    var items = [];
	    var thisBounds = this.position();
	    thisBounds.right = thisBounds.left+this.outerWidth();
	    thisBounds.bottom = thisBounds.top+this.outerHeight();

	    compareOverlap = function(obj1, obj2) {
		if(obj1.overlap < obj2.overlap) {
		    return -1;
		}
		if(obj1.overlap > obj2.overlap) {
		    return 1;
		}
		return 0;
	    };
	    
	    for(var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		var objBounds = $(obj).position();
		objBounds.right = objBounds.left+$(obj).outerWidth();
		objBounds.bottom = objBounds.top+$(obj).outerHeight();
		
		if(!(objBounds.right < thisBounds.left ||
		   objBounds.left > thisBounds.right ||
		   objBounds.bottom < thisBounds.top ||
		   objBounds.top > thisBounds.bottom)) {
		    
		    var xOverlap = objBounds.left < thisBounds.left ? Math.abs(objBounds.right - thisBounds.left) : Math.abs(objBounds.left - thisBounds.right);
		    var yOverlap = objBounds.top < thisBounds.top ? Math.abs(objBounds.bottom - thisBounds.top) : Math.abs(objBounds.top - thisBounds.bottom);
		    
		    var pushItem = {'object':obj, 'overlap':xOverlap*yOverlap};
		    items.push(pushItem);
		    items.sort(compareOverlap);
		    items.reverse();
		}
	    }
	    return items;
	}
    });
})(jQuery);
