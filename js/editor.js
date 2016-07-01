//make SVG compatibility
SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

$(function () {
    // split pane
    $('div.split-pane').splitPane();

    //add nano scroll to pages
    $(".nano").nanoScroller();
});

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

var participant = new joint.shapes.sequence.Participant({
    position: {x: 60, y: 10}
});

var frame = new joint.shapes.sequence.frame({
    position: {x: 5, y: 200}
});

//add to cells
projectAssetsGraph.addCells([participant, frame]);

//main editor
var mainEditor = $('#editor-main');
var graph = new joint.dia.Graph,
    paper = new joint.dia.Paper({
        defaultLink: new joint.shapes.sequence.Link,
        el: mainEditor,
        width: mainEditor.width(),
        height: mainEditor.height(),
        model: graph,
        gridSize: 10
    });

projectAssetsPaper.on('cell:pointerdown', function (cellView, e, x, y) {
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
    $('body').on('mousemove.fly', function (e) {
        $("#invisiblePaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
    });
    $('body').on('mouseup.fly', function (e) {
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

function setGrid(paper, gridSize, color) {
    // Set grid size on the JointJS paper object (joint.dia.Paper instance)
    paper.options.gridSize = gridSize;
    // Draw a grid into the HTML 5 canvas and convert it to a data URI image
    var canvas = $('<canvas/>', {width: gridSize, height: gridSize});
    canvas[0].width = gridSize;
    canvas[0].height = gridSize;
    var context = canvas[0].getContext('2d');
    context.beginPath();
    context.rect(1, 1, 1, 1);
    context.fillStyle = color || '#AAAAAA';
    context.fill();
    // Finally, set the grid background image of the paper container element.
    var gridBackgroundImage = canvas[0].toDataURL('image/png');
    paper.$el.css('background-image', 'url("' + gridBackgroundImage + '")');
}

// Example usage:
setGrid(paper, 10, 'rgba(106, 115, 124, 0.7)');

//handle mouse transform
paper.on('cell:pointerup', function (cellView) {

    //to avoid trigger on links
    if (cellView.model instanceof joint.dia.Link) return;

    var freeTransform = new joint.ui.resize({cellView: cellView});
    freeTransform.render();

    var cell = cellView.model;
    var cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());

    if (cellViewsBelow.length) {
        // Note that the findViewsFromPoint() returns the view for the `cell` itself.
        var cellViewBelow = _.find(cellViewsBelow, function (c) {
            return c.model.id !== cell.id
        });

        // Prevent recursive embedding.
        if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
            cellViewBelow.model.embed(cell);
        }
    }
});

// First, un-embed the cell that has just been grabbed by the user.
paper.on('cell:pointerdown', function (cellView, evt, x, y) {

    var cell = cellView.model;

    if (!cell.get('embeds') || cell.get('embeds').length === 0) {
        // Show the dragged element above all the other cells (except when the
        // element is a parent).
        cell.toFront();
    }

    if (cell.get('parent')) {
        graph.getCell(cell.get('parent')).unembed(cell);
    }
});