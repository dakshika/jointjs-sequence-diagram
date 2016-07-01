/**
 * Free transform logic for editor
 * @type {void|*}
 */
joint.ui.resize = joint.mvc.View.extend({
    className: "ui-resize",
    events: {
        "mousedown .resize": "blockResizing"
    },
    options: {
        cellView: void 0,
    },
    DIRECTIONS: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
    POSITIONS: ["top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"],
    init: function () {
        this.options.cellView && _.defaults(this.options, {
            cell: this.options.cellView.model,
            paper: this.options.cellView.paper,
            graph: this.options.cellView.paper.model
        }), _.bindAll(this, "update", "remove", "cursorup", "cursormove"),

            this.listenTo(this.options.graph, "all", this.update),
            this.listenTo(this.options.paper, "blank:pointerdown", this.remove),
            paper.$el.append(this.el),
            $(document.body).on("mousemove", this.cursormove),
            $(document).on("mouseup", this.cursorup)
    },
    renderView: function () {
        var transformControllers = $('<div/>'),
            tcpositions = transformControllers.clone().addClass('positon-clone'),
            positions = _.map(this.POSITIONS, function (tcpositions) {
                return transformControllers.clone().addClass("resize").attr("data-position", tcpositions)
            });
        this.$el.empty().append(transformControllers, positions);

    },
    render: function () {
        this.renderView(),
            this.update();
    },
    update: function () {
        var bboxCordinates = this.options.cell.getBBox();

        this.$el.css({
            width: bboxCordinates.width + 8,
            height: bboxCordinates.height + 8,
            top: bboxCordinates.y - 5,
            left: bboxCordinates.x - 5
        });

        var getDirections = this.DIRECTIONS;
        this.$(".resize").removeClass(this.DIRECTIONS.join(" ")).each(function (a) {
            $(bboxCordinates).addClass(getDirections[a])
        })

    },
    startResize: function (a) {
        a && ($(a).addClass("in-operation"), this._elementOp = a), this.$el.addClass("resizing-on")
    },
    stopResize: function () {
        this._elementOp && ($(this._elementOp).removeClass("resizing-on"), delete this._elementOp), this.$el.removeClass("resizing-on")
    },
    cursorup: function (a) {
        this._action && (this.stopResize(), this.options.graph.trigger("batch:stop"), delete this._action, delete this._initial)
        //remove previously draw controllers
        // this.options.graph.trigger("batch:stop")
    },
    cursormove: function (a) {
        if (this._action) {
            a = joint.util.normalizeEvent(a);
            var mapAngle = this.options.paper.snapToGrid({
                    x: a.clientX,
                    y: a.clientY
                }),
                paperGrid = this.options.paper.options.gridSize,
                getClickedCell = this.options.cell;
            var initialVal = this._initial;
            switch (this._action) {
                case "resize":
                    var getBBox = getClickedCell.getBBox(),
                        h = g.point(mapAngle).rotate(getBBox.center(), initialVal.angle),
                        i = h.difference(getBBox[initialVal.selector]()),
                        j = initialVal.resizeX ? i.x * initialVal.resizeX : getBBox.width,
                        k = initialVal.resizeY ? i.y * initialVal.resizeY : getBBox.height;

                    getClickedCell.resize(j, k);

                    break;
            }

        }

        //   this.options.cell.resize(a.clientX - (getBBox.x) , a.clientY - (getBBox.y))

    },
    blockResizing: function (a) {
        a.stopPropagation(), this.options.graph.trigger("batch:start");
        var clickedPointer = $(a.target).data("position"),
            d = 0,
            e = 0;
        _.each(clickedPointer.split("-"), function (a) {
            d = {left: -1, right: 1}[a] || d,
                e = {top: -1, bottom: 1}[a] || e
        });
        var f = this.validResizedDirections(clickedPointer),
            h = {
                "top-right": "bottomLeft",
                "top-left": "corner",
                "bottom-left": "topRight",
                "bottom-right": "origin"
            }[f];
        this._initial = {
            angle: g.normalizeAngle(this.options.cell.get("angle") || 0),
            selector: h,
            resizeX: d,
            resizeY: e
        }
        this._action = "resize", this.startResize(a.target)

    },
    validResizedDirections: function (a) {
        return {
                top: "top-left",
                bottom: "bottom-right",
                left: "bottom-left",
                right: "top-right"
            }[a] || a
    }
});