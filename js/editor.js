// use to split pane
$(function() {
    $('div.split-pane').splitPane();
});
//add nano scroll to pages
$(".nano").nanoScroller();

//make SVG compatibility
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
};

//create left pane items
var projectAssets = $('#project-assets');
var projectAssetsGraph = new joint.dia.Graph,
    projectAssetsPaper = new joint.dia.Paper({
        el: projectAssets,
        height: projectAssets.height(),
        width: projectAssets.width(),
        model: projectAssetsGraph,
        interactive: false
    });

var r1 = new joint.shapes.basic.Rect({
    position: {
        x: 10,
        y: 10
    },
    size: {
        width: 100,
        height: 40
    },
    attrs: {
        text: {
            text: 'Rect1'
        }
    }
});
var r2 = new joint.shapes.basic.Rect({
    position: {
        x: 10,
        y: 60
    },
    size: {
        width: 100,
        height: 40
    },
    attrs: {
        text: {
            text: 'Rect2'
        }
    }
});
var participant = new joint.shapes.sequence.Participant({
    position: { x: 10, y: 110 }
});




projectAssetsGraph.addCells([r1, r2, participant]);


//main editor
var mainEditor = $('#editor-main');
var graph = new joint.dia.Graph,
    paper = new joint.dia.Paper({
        el: mainEditor,
        width: mainEditor.width(),
        height: mainEditor.height(),
        model: graph,
        gridSize: 1
    });

projectAssetsPaper.on('cell:pointerdown', function(cellView, e, x, y) {
    $('body').append('<div id="invisiblePaper" style="position:fixed;z-index:100;opacity:.8;pointer-event:none;"></div>');
    var flyGraph = new joint.dia.Graph,
        invisiblePaper = new joint.dia.Paper({
            el: $('#invisiblePaper'),
            model: flyGraph,
            interactive: false
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
            x: x - pos.x,
            y: y - pos.y
        };

    flyShape.position(0, 0);
    flyGraph.addCell(flyShape);
    $("#invisiblePaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
    });
    $('body').on('mousemove.fly', function(e) {
        $("#invisiblePaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
    });
    $('body').on('mouseup.fly', function(e) {
        var x = e.pageX,
            y = e.pageY,
            target = paper.$el.offset();

        if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
            var s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            graph.addCell(s);
        }
        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#invisiblePaper').remove();
    });
});
